import GLCanvas, { Props } from "./GLCanvas";
import { Controller } from "./control/controller";
import { GlController } from "./control/gl-controller";
declare function hookupCanvas(div: HTMLDivElement, props?: Props, controller?: Controller & GlController): void;
declare const exports: {
    hookupCanvas: typeof hookupCanvas;
    GLCanvas: typeof GLCanvas;
};
export default exports;
