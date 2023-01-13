import { useEffect, useMemo, useState } from "react";

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

export default function configureGl({ gl, glConfig, showDebugInfo, width, height }: Props): State {
    const [slowAssGPU, setSlowAssGPU] = useState(false);

    const info = useMemo(() => ({
        slowAssGPU,
        gl,
    }), [slowAssGPU, gl]);

    useEffect(() => {
        const renderer = gl?.getParameter(gl?.RENDERER);
        if (showDebugInfo && renderer) {
            console.log("WebGL Renderer:", renderer);
        }
    
        setSlowAssGPU(false);
        const debugInfo = gl?.getExtension('WEBGL_debug_renderer_info');
        const unmaskedVendor = gl?.getParameter(debugInfo?.UNMASKED_RENDERER_WEBGL ?? 0);
        if (navigator.userAgent.indexOf("Mac") >= 0) {
          if (unmaskedVendor?.indexOf("Intel") >= 0) {
            setSlowAssGPU(true);
            if (showDebugInfo) {
                console.log("Slow GPU.");
            }
          }
        }    
    }, [gl, showDebugInfo]);

    useEffect(() => {
        if (!gl) {
            return;
        }
        switch (glConfig?.cullFace) {
            case "front":
              gl.enable(gl.CULL_FACE);
              gl.cullFace(gl.FRONT);
              break;
            case "back":
              gl.enable(gl.CULL_FACE);
              gl.cullFace(gl.BACK);
              break;
            default:
              gl.disable(gl.CULL_FACE);
        }
    }, [gl, glConfig?.cullFace]);

    useEffect(() => {
        if (!gl) {
            return;
        }
        if (glConfig?.depth) {
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
        }
    }, [gl, glConfig?.depth]);

    useEffect(() => {
        if (!gl) {
            return;
        }
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }, [gl]);

    useEffect(() => {
        if (!gl) {
            return;
        }
        const {r, g, b, a} = glConfig?.backgroundColor ?? {r:0, g:0, b:0, a:1};
        gl.clearColor(r, g, b, a);
    }, [gl, glConfig?.backgroundColor]);

    useEffect(() => {
        if (gl) {
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        }
    }, [gl, width, height]);

    return {
        info,
    };
}