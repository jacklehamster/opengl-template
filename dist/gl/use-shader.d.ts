import { AttributeConfiguration } from "./attributes/attribute-config";
import { ShaderConfig } from "./shader-config";
import { Attribute, Uniform } from "./attributes/use-attributes";
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
export declare function useShader({ gl, showDebugInfo }: Props): {
    createProgram: (shaderConfig: ShaderConfig, attributeConfigs: AttributeConfiguration[]) => ProgramResult | undefined;
    removeProgram: (programResult: ProgramResult) => void;
};
export {};
