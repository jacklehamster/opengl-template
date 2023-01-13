import { ProgramConfig, ProgramId } from "./program";
interface Props {
    gl?: WebGL2RenderingContext;
    activeProgram?: ProgramId;
    programs?: ProgramConfig[];
    showDebugInfo?: boolean;
}
export declare function useProgram({ gl, activeProgram, programs, showDebugInfo }: Props): {
    usedProgram: WebGLProgram | undefined;
};
export {};
