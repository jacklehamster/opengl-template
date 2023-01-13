import { useCallback } from "react";
import { AttributeConfiguration } from "./attribute-config";
import getShaderVariables, { Variable } from "./utils";

interface Props {
    gl?: WebGL2RenderingContext;
    showDebugInfo?: boolean;
}

export interface Uniform {
    name: string;
    location: WebGLUniformLocation;
}

export interface Attribute {
    name: string;
    location: number;
    buffer: WebGLBuffer | null;
    bytesPerInstance: number;
    instances: number;
}

export default function useAttributes({ gl, showDebugInfo }: Props) {
    const assignAttributes = useCallback((program: WebGLProgram, attributes: AttributeConfiguration[], vertexShaderCode: string) => {
        if (!gl) {
            return;
        }
        const variables: Variable[] = getShaderVariables(vertexShaderCode).filter(
          ({ attributeType }) => attributeType === "attribute",
        );
        gl.enableVertexAttribArray(0);
        variables.forEach(({ name }) => {
            const attribute = attributes.filter(attribute => name === attribute.name)[0];
            if (!attribute) {
                return;
            }
            const { location } = attribute;
            if (typeof location == "number") {
                gl.bindAttribLocation(program, location, name);
            }
        });
    }, [gl]);



    const enableLocations = useCallback((name: string, loc: WebGLUniformLocation, dataType: string) => {
        if (!gl) {
            return;
        }
        if (loc === null) {
            console.warn(`Location ${name}(${dataType}) does not exist. Perhaps the shader code doesn't use it.`);
            return;
        }
        const group = dataType.match(/mat(\d?)/);
        const size = !group || group[1] === "" || isNaN(parseInt(group[1])) ? 1 : parseInt(group[1]);

        for (let i = 0; i < size; i++) {
            const l = loc as number;
            gl.enableVertexAttribArray(l + i);
            // if (showDebugInfo) {
            //     console.log(`Enabled location ${name}. Type: ${dataType}.`, loc);
            // }
        }
    }, [gl, showDebugInfo]);

    const clearBuffers = useCallback((attributes: Attribute[]) => {
        if (!gl) {
            return;
        }
        attributes.forEach(attribute => {
            gl.deleteBuffer(attribute.buffer);
            attribute.buffer = null;
        });
    }, [gl]);

    const getTypeArrayClass = useCallback((bufferType: GLenum) => {
        if (!gl) {
            return;
        }
        switch (bufferType) {
          case gl.BYTE:
            return Int8Array;
          case gl.UNSIGNED_BYTE:
            return Uint8Array;
          case gl.SHORT:
            return Int16Array;
          case gl.UNSIGNED_SHORT:
            return Uint16Array;
          case gl.INT:
            return Int32Array;
          case gl.UNSIGNED_INT:
            return Uint32Array;
          case gl.FLOAT:
            return Float32Array;
        }
    }, [gl]);
    
    const getByteSize = useCallback((bufferType: GLenum) => {
        const typedArrayClass = getTypeArrayClass(bufferType);
        return !typedArrayClass ? 0 : typedArrayClass.BYTES_PER_ELEMENT;
    }, [getTypeArrayClass]);
        
    const initializeAttribute = useCallback((name: string, dataType: string, location: number, attributeConfig: AttributeConfiguration, maxInstanceCount: number): Attribute | undefined => {
        if (!gl) {
            return;
        }
        if (location < 0) {
          console.warn(`Attribute ${name} has no location in shader. Perhaps the shader code doesn't use it.`);
          return;
        }
    
        if (!gl[attributeConfig.usage]) {
          console.warn(`Attribute ${name} usage is invalid: ${attributeConfig.usage}.`);
          return;
        }
    
        const NUM_VERTICES = 6;
        const group = dataType.match(/([a-zA-Z]+)(\d?)/);
        const size = !group || group[2] === "" || isNaN(parseInt(group[2])) ? 1 : parseInt(group[2]);
        const dataStructure = !group ? "vec" : group[1];
        const numRows = dataStructure === "mat" ? size : 1;
        const glType = gl[attributeConfig.type || "FLOAT"];
        const bytesPerInstance = size * numRows * getByteSize(glType);
    
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    
        for (let i = 0; i < numRows; i++) {
          const offset = i * size * getByteSize(glType);
          gl.vertexAttribPointer(
            location + i, // location
            size, // size (num values to pull from buffer per iteration)
            glType, // type of data in buffer
            attributeConfig.normalize ?? false, // normalize
            bytesPerInstance, // stride (0 = compute from size and type above)
            offset, // offset in buffer
          );
          gl.vertexAttribDivisor(location + i, attributeConfig.instances || 0);
        }
        const bufferSize = (attributeConfig.instances ? maxInstanceCount : NUM_VERTICES) * bytesPerInstance;
        gl.bufferData(gl.ARRAY_BUFFER, bufferSize, gl[attributeConfig.usage]);
        // if (showDebugInfo) {
        //     console.log(`Buffer initialized: ${name}(${dataType}) usage:${attributeConfig.usage} => ${bufferSize}`);
        // }
    
        return {
          name,
          location,
          buffer,
          bytesPerInstance,
          instances: attributeConfig.instances,
        };
    }, [gl, getByteSize, showDebugInfo]);
        
    const initAttributes = useCallback((program: WebGLProgram, attributeConfigs: AttributeConfiguration[], vertexShaderCode: string, maxInstanceCount: number) => {
        if (!gl) {
            return;
        }
        const attributes: Record<string, Attribute | undefined> = {};
        const variables = getShaderVariables(vertexShaderCode).filter(
        ({ attributeType }) => attributeType === "attribute" || attributeType === "in",
        );
        variables.forEach(({ name, dataType }) => {
        if (!attributeConfigs.find(config => config.name === name)) {
            console.warn(`Attribute ${name} has no configuration. Update config/webgl/attributes.json`);
            return;
        }
        const config = attributeConfigs.filter(config => config.name === name)[0];
        const location = gl.getAttribLocation(program, name);
        attributes[name] = initializeAttribute(name, dataType, location, config, maxInstanceCount);
        if (attributes[name]) {
            enableLocations(name, location, dataType);
        }
        });
        attributeConfigs.forEach(({name}) => {
            if (!attributes[name]) {
                console.warn(`Configured attribute ${name} does not exist in shaders.`);
            }
        });
        return Object.values(attributes);
    }, [gl, initializeAttribute]);
    
    const initUniforms = useCallback((program: WebGLProgram, vertexShaderCode: string, fragmentShaderCode: string) => {
        if (!gl) {
            return;
        }
        const variables: Variable[] = getShaderVariables(vertexShaderCode, fragmentShaderCode).filter(
            ({ attributeType }) => attributeType === "uniform",
        );
        const uniforms: Record<string, Uniform> = {};
        variables.forEach(({ name, dataType }) => {
            if (uniforms[name]) {
                return;
            }
            const location = gl.getUniformLocation(program, name);
            if (location !== null) {
                uniforms[name] = { name, location };
                enableLocations(name, uniforms[name].location, dataType);    
            }
        });
        return Object.values(uniforms);
    }, [gl, enableLocations]);

    return {
        assignAttributes,
        initAttributes,
        initUniforms,
        clearBuffers,
    }
}