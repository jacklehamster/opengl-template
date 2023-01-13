import { CSSProperties } from "react";
import { GLConfig, Info } from "./gl/configure-gl";
import { ProgramConfig, ProgramId } from "./gl/program/program";
import { CanvasController } from "./control/canvas-controller";
export interface Props {
    pixelRatio?: number;
    onRefresh?: (gl: WebGL2RenderingContext) => void;
    style?: CSSProperties;
    glConfig: GLConfig;
    onInfoUpdate?: (info: Info) => void;
    activeProgram?: ProgramId;
    programs?: ProgramConfig[];
    showDebugInfo?: boolean;
    controller?: CanvasController;
}
export default function GLCanvas(props?: Props): JSX.Element;
