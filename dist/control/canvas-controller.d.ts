import { ProgramId } from "../gl/program/program";
export interface CanvasController {
    setActiveProgram?: (id: ProgramId) => void;
}
