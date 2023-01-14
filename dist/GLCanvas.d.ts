import { CSSProperties } from "react";
import { ProgramConfig, ProgramId } from "./gl/program/program";
import { CanvasController } from "./control/canvas-controller";
export interface Props {
    pixelRatio?: number;
    onRefresh?: (gl: WebGL2RenderingContext) => () => void | undefined;
    style?: CSSProperties;
    webglAttributes?: WebGLContextAttributes;
    activeProgram?: ProgramId;
    programs?: ProgramConfig[];
    showDebugInfo?: boolean;
    controller?: CanvasController;
}
export default function GLCanvas(props?: Props): JSX.Element;
