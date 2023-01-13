import { AttributeConfiguration } from "../attributes/attribute-config";
import { ShaderConfig } from "../shader-config";
export type ProgramId = string;
export interface ProgramConfig {
    readonly id: ProgramId;
    readonly shaderConfig: ShaderConfig;
    readonly attributeConfigs: AttributeConfiguration[];
}
