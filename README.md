# opengl-template

This template is for setting up a canvas with WebGL2.
It uses React to setup the template, and we can pass some webgl config.

Typical usage:
```
hookupCanvas(div, {
    pixelRatio: 2,
    onRefresh(gl) {
        //  do some WEBGL drawing
    },
    webglAttributes,
    initialProgram,
    programs,
}, controller);
```

- initialProgram is an id that indicates the first program to use. If ommitted, by default,
it's just the first one.
- programs is an array of shader programs with the following structure:
```
        programs: [
          {
              id: "sample-multicolor",
              vertex: VERTEX_SHADER_CODE,
              fragment: FRAGMENT_SHADER_CODE,
          },
        ],
```

controller is an empty object {}, which will get filled with some methods:
- setActive
- setActiveProgram

setActive: just activate / deactivate the canvas. Note that it also deletes all the canvas's programs.
setActiveProgram: Here pass the program id. This switches between the program.

Once we're done with setting up the config, the code in "onRefresh" can be used to render some WebGL graphics. onRefresh is called by the React component when it detects that it needs to refresh (canvas size changed, program changed, ...), but typically it'll also be used externally in a loop to render any animated graphics.

### Demo

In the [demo](https://jacklehamster.github.io/opengl-template/public), we setup some WebGL to draw a triangle, and we have 3 WebGL programs loaded.