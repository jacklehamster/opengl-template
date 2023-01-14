export interface Variable {
    name: string;
    line: string;
    location?: string;
    attributeType: string;
    dataType: string;
}
export default function getShaderVariables(...shaders: string[]): Variable[];
