import { CSSProperties } from "react";
import { ProgramConfig, ProgramId } from "./gl/program/program";
import { GlController } from "./control/gl-controller";
export interface Props {
    pixelRatio?: number;
    onRefresh?: (gl: WebGL2RenderingContext) => () => void | undefined;
    style?: CSSProperties;
    webglAttributes?: WebGLContextAttributes;
    initialProgram?: ProgramId;
    programs?: ProgramConfig[];
    showDebugInfo?: boolean;
    controller?: GlController;
}
export default function GLCanvas(props?: Props): JSX.Element;
