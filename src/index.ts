import ReactHook from "./ReactHook";
import GLCanvas, { Props } from "./GLCanvas";
import { Controller } from "./control/controller";
import { CanvasController } from "./control/canvas-controller";


function hookupCanvas(div: HTMLDivElement, props?: Props, controller?: Controller & CanvasController) {
  ReactHook.hookup(div, GLCanvas, { ...props, controller }, controller);
}


const exports = {
  hookupCanvas,
  GLCanvas,
}

export default exports;

globalThis.exports = exports;
