import React, { CSSProperties, RefObject, useCallback, useEffect, useState } from "react";
import { useGL } from "./gl/use-gl";
import { useCanvasSize } from "./dimension/use-canvas-size";
import { ProgramConfig, ProgramId } from "./gl/program/program";
import { useProgram } from "./gl/program/use-program";
import { CanvasController } from "./control/canvas-controller";

export interface Props {
    pixelRatio?: number;
    onRefresh?: (gl: WebGL2RenderingContext) => ()=>void | undefined;
    style?: CSSProperties;
    webglAttributes?: WebGLContextAttributes;
    activeProgram?: ProgramId;
    programs?: ProgramConfig[];
    showDebugInfo?: boolean;
    controller?: CanvasController;
}

export default function GLCanvas(props?: Props): JSX.Element {
    const { pixelRatio = 2, onRefresh, showDebugInfo, controller, webglAttributes } = props ?? {};
    const canvasRef: RefObject<HTMLCanvasElement> = React.useRef<HTMLCanvasElement>(null);
    const [activeProgram, setActiveProgram] = useState(props?.activeProgram);
    const gl = useGL({ canvasRef, webglAttributes });
    const { usedProgram } = useProgram({ gl, activeProgram, programs: props?.programs, showDebugInfo });
    const { width, height } = useCanvasSize({ gl, canvasRef, pixelRatio })
    useEffect(() => {
        if (gl && usedProgram) {
            const cleanup = onRefresh?.(gl);
            return () => {
                cleanup?.();
            };
        }
    }, [gl, usedProgram, onRefresh, width, height]);

    useEffect(() => {
        if (controller) {
            controller.setActiveProgram = setActiveProgram;
        }
    }, [controller, setActiveProgram]);

    return <canvas ref={canvasRef}
            width={width}
            height={height}
            style={{
                ...props?.style,
                width: "100%",
                height: "100%",
            }}>
        </canvas>;
}
