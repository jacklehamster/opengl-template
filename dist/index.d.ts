import GLCanvas, { Props } from "./GLCanvas";
import { Controller } from "./control/controller";
import { CanvasController } from "./control/canvas-controller";
declare function hookupCanvas(div: HTMLDivElement, props?: Props, controller?: Controller & CanvasController): void;
declare const exports: {
    hookupCanvas: typeof hookupCanvas;
    GLCanvas: typeof GLCanvas;
};
export default exports;
