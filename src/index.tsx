import { GLCanvas } from "dok-gl-canvas";
import { GlController } from "dok-gl-canvas/dist/control/gl-controller";
import React from "react";
import * as ReactDOMClient from "react-dom/client";

const programs = [
    {
      id: "sample-multicolor",
      vertex: 
      `#version 300 es

        precision highp float;
        layout (location=0) in vec4 position;
        layout (location=1) in vec3 color;
        
        out vec3 vColor;

        void main() {
            vColor = color;
            gl_Position = position;
        }
      `,
      fragment:
      `#version 300 es

        precision highp float;
        in vec3 vColor;
        out vec4 fragColor;

        void main() {
            fragColor = vec4(vColor, 1.0);
        }
      `
    },
    {
        id: "sample-red",
        vertex: 
        `#version 300 es

          precision highp float;
          in vec4 position;

          void main() {
              gl_Position = position;
          }
        `,
        fragment:
        `#version 300 es

          precision highp float;
          out vec4 fragColor;

          void main() {
              fragColor = vec4(0.5, 0.0, 0.0, 1.0);
          }
        `
    },
    {
      id: "sample-blue",
      vertex: 
      `#version 300 es

        precision highp float;
        in vec4 position;

        void main() {
            gl_Position = position;
        }
      `,
      fragment:
      `#version 300 es

        precision highp float;
        out vec4 fragColor;

        void main() {
            fragColor = vec4(0.0, 0.0, 0.5, 1.0);
        }
      `
    },
];

interface Props {
  controller: GlController;
}

const App = ({ controller }: Props) => <GLCanvas
    controller={controller}
    programs={programs}
    actionScripts={[
      {
        name: "redraw",
        actions: [
          {
            action: "clear",
            color: true,
          },
          {
            action: "draw",
            vertexCount: 3,
          },    
        ],
      },
      {
        name: "animate",
        actions: [
          {
            action: "custom",
            location: "position",
            processAttributeBuffer(positions, time) {
              positions[0] = Math.sin(time / 100);
              return undefined;       
            },
          },
          "redraw"
        ],
      },
    ]}
    actionPipeline={[
      {
        action: "bind-vertex",
      },
      {
        action: "buffer-attribute",
        location: "position",
        buffer: [
            0.0, 0.5, 0.0,
            -0.5, -0.5, 0.0,
            0.5, -0.5, 0.0,
        ],
        size: 3,
      },
      {
        action: "buffer-attribute",
        location: "color",
        buffer: [
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
        ],
        size: 3,
      },
      "redraw"
    ]}
/>;


function hookupApp(root: HTMLDivElement, controller: GlController) {
  const hudRoot = ReactDOMClient.createRoot(root!);

  hudRoot.render(<App controller={controller} />)  
}



const exports = {
  hookupApp,
}

export default exports;

globalThis.exports = exports;
