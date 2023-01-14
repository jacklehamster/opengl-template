import ReactHook from "./ReactHook";
import GLCanvas, { Props } from "./GLCanvas";
import { Controller } from "./control/controller";
import { GlController } from "./control/gl-controller";


function hookupCanvas(div: HTMLDivElement, props?: Props, controller?: Controller & GlController) {
  ReactHook.hookup(div, GLCanvas, { ...props, controller }, controller);
}


const exports = {
  hookupCanvas,
  GLCanvas,
}

export default exports;

globalThis.exports = exports;
