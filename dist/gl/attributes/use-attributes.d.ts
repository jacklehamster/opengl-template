import { AttributeConfiguration } from "./attribute-config";
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
    buffer: WebGLBuffer | null;
    bytesPerInstance: number;
    instances: number;
}
export default function useAttributes({ gl, showDebugInfo }: Props): {
    initAttributes: (program: WebGLProgram, attributeConfigs: AttributeConfiguration[], vertexShaderCode: string, maxInstanceCount: number) => (Attribute | undefined)[] | undefined;
    initUniforms: (program: WebGLProgram, vertexShaderCode: string, fragmentShaderCode: string) => Uniform[] | undefined;
    clearBuffers: (attributes: Attribute[]) => void;
};
export {};
