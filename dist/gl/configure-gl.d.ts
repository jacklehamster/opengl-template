export interface Info {
    slowAssGPU: boolean;
    gl?: WebGL2RenderingContext;
}
export interface GLConfig {
    cullFace?: "front" | "back";
    depth?: boolean;
    backgroundColor?: {
        r: number;
        g: number;
        b: number;
        a: number;
    };
    config?: WebGLContextAttributes;
}
interface Props {
    gl?: WebGL2RenderingContext;
    glConfig?: GLConfig;
    showDebugInfo?: boolean;
    width: number;
    height: number;
}
interface State {
    info: Info;
}
export default function configureGl({ gl, glConfig, showDebugInfo, width, height }: Props): State;
export {};
