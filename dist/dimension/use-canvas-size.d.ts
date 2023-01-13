import { RefObject } from "react";
interface Props {
    canvasRef: RefObject<HTMLCanvasElement>;
    pixelRatio: number;
}
interface State {
    width: number;
    height: number;
}
export declare function useCanvasSize({ canvasRef, pixelRatio }: Props): State;
export {};
