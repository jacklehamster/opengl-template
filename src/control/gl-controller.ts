import { ProgramId } from "../gl/program/program";

export interface GlController {
    setActiveProgram?: (id: ProgramId) => boolean;
}