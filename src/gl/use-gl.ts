import React, { RefObject, useState } from "react";

interface Props {
    canvasRef: RefObject<HTMLCanvasElement>;
    config?: WebGLContextAttributes;
}

const DEFAULT_CONFIG: WebGLContextAttributes = {
    alpha: true,
    antialias: false,
    depth: true,
    desynchronized: true,
    failIfMajorPerformanceCaveat: undefined,
    powerPreference: "default",
    premultipliedAlpha: true,
    preserveDrawingBuffer: false,
    stencil: false,
};

export function useGL({ canvasRef, config = DEFAULT_CONFIG }: Props): WebGL2RenderingContext | undefined {
    const [gl, setGL] = useState<WebGL2RenderingContext | undefined>();

    React.useLayoutEffect(() => {
        const canvas = canvasRef.current;
        setGL(canvas?.getContext?.("webgl2", config) ?? undefined);
    }, []);
    return gl;
}