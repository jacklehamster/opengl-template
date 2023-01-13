import { useCallback } from "react";
import { AttributeConfiguration } from "./attributes/attribute-config";
import { ShaderConfig } from "./shader-config";
import useAttributes, { Attribute, Uniform } from "./attributes/use-attributes";

let nextId = 1;

interface Props {
    gl?: WebGL2RenderingContext;
    showDebugInfo?: boolean;
}

export interface ProgramResult {
    id: number;
    program: WebGLProgram;
    attributes: Attribute[];
    uniforms: Uniform[];
    ready?: boolean;
}

export function useShader({ gl, showDebugInfo }: Props) {
    const { assignAttributes, initAttributes, initUniforms, clearBuffers } = useAttributes({ gl, showDebugInfo });

    const typeName = useCallback((type: number) => {
        return type == gl?.VERTEX_SHADER ? "vertex" :
            type === gl?.FRAGMENT_SHADER ? "fragment" :
            undefined;
    }, [gl]);

    const createShader = useCallback((shaderSource: string, type: GLenum) => {
        if (!gl) {
            return;
        }
        if (type !== gl.VERTEX_SHADER && type !== gl.FRAGMENT_SHADER) {
            throw new Error(`Shader error in ${typeName(type)}`);
        }
        const shader = gl.createShader(type);
        if (!shader) {
            throw new Error(`Unable to generate ${typeName(type)} shader.`);
        }
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);
    
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            // Something went wrong during compilation; get the error
            console.error(`Shader compile error in ${typeName(type)}:` + gl.getShaderInfoLog(shader));
        }
        return shader;      
    }, [gl]);

    const createProgram = useCallback((shaderConfig: ShaderConfig, attributeConfigs: AttributeConfiguration[]): ProgramResult | undefined => {
        if (!gl) {
            return;
        }
        const program = gl.createProgram();
        if (!program) {
            throw new Error(`Unable to create program.`);
        }
        assignAttributes(program, attributeConfigs, shaderConfig.vertex);

        const vertexShader = createShader(shaderConfig.vertex, gl.VERTEX_SHADER)!;
        const fragmentShader = createShader(shaderConfig.fragment, gl.FRAGMENT_SHADER)!;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.detachShader(program, vertexShader);
        gl.detachShader(program, fragmentShader);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error("Unable to initialize the shader program:\n" + gl.getProgramInfoLog(program));
        }
        const uniforms = initUniforms(program, shaderConfig.vertex, shaderConfig.fragment);
        const attributes = initAttributes(program, attributeConfigs, shaderConfig.vertex, shaderConfig.maxInstanceCount);
        const result = {
            id: nextId++,
            uniforms: uniforms ?? [],
            attributes: attributes?.filter((a): a is Attribute => !!a) ?? [],
            program,
        };
        if (showDebugInfo) {
            console.log(`Program ${result.id} created.`);
        }
        return result;
    }, [gl, assignAttributes, initUniforms, showDebugInfo]);

    const removeProgram = useCallback((programResult: ProgramResult) => {
        if (!gl) {
            return;
        }
        clearBuffers(programResult.attributes);
        programResult.attributes.length = 0;
        programResult.uniforms.length = 0;
        gl.deleteProgram(programResult.program);
        if (showDebugInfo) {
            console.log(`Program ${programResult.id} destroyed.`);
        }
        programResult.program = 0;
    }, [gl, clearBuffers, showDebugInfo]);

    return {
        createProgram,
        removeProgram,
    }
}