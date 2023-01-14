import { ProgramId } from "../gl/program/program";

export type OnRefresh = (gl: WebGL2RenderingContext) => ()=>void | undefined;

export interface GlController {
    setActiveProgram?: (id: ProgramId) => boolean;
    setRefresh(onRefresh: OnRefresh): void;
}