import React, { CSSProperties, RefObject, useCallback, useEffect, useState } from "react";
import { useGL } from "./gl/use-gl";
import { useCanvasSize } from "./dimension/use-canvas-size";
import { ProgramConfig, ProgramId } from "./gl/program/program";
import { useProgram } from "./gl/program/use-program";
import { GlController } from "./control/gl-controller";

export interface Props {
    pixelRatio?: number;
    onRefresh?: (gl: WebGL2RenderingContext) => ()=>void | undefined;
    style?: CSSProperties;
    webglAttributes?: WebGLContextAttributes;
    initialProgram?: ProgramId;
    programs?: ProgramConfig[];
    showDebugInfo?: boolean;
    controller?: GlController;
}

export default function GLCanvas(props?: Props): JSX.Element {
    const { pixelRatio = 2, onRefresh, showDebugInfo, controller, initialProgram, webglAttributes } = props ?? {};
    const canvasRef: RefObject<HTMLCanvasElement> = React.useRef<HTMLCanvasElement>(null);
    const gl = useGL({ canvasRef, webglAttributes });
    const { usedProgram } = useProgram({ gl, initialProgram, programs: props?.programs, showDebugInfo, controller });
    const { width, height } = useCanvasSize({ gl, canvasRef, pixelRatio })
    useEffect(() => {
        if (gl && usedProgram) {
            const cleanup = onRefresh?.(gl);
            return () => {
                cleanup?.();
            };
        }
    }, [gl, usedProgram, onRefresh, width, height]);

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
