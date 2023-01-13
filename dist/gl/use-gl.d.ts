import { RefObject } from "react";
interface Props {
    canvasRef: RefObject<HTMLCanvasElement>;
    config?: WebGLContextAttributes;
}
export declare function useGL({ canvasRef, config }: Props): WebGL2RenderingContext | undefined;
export {};
