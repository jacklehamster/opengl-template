import { useEffect, useMemo, useState } from "react";
import { ProgramResult, useShader } from "../use-shader";
import { ProgramConfig, ProgramId } from "./program";

interface Props {
    gl?: WebGL2RenderingContext;
    activeProgram?: ProgramId;
    programs?: ProgramConfig[];
    showDebugInfo?: boolean;
}

export function useProgram({ gl, activeProgram, programs, showDebugInfo }: Props) {
    const { createProgram, removeProgram } = useShader({ gl, showDebugInfo });
    const [programResults, setProgramResults] = useState<Record<ProgramId, ProgramResult>>({});
    const [usedProgram, setUsedProgram] = useState<WebGLProgram | undefined>();

    useEffect(() => {
        return () => {
            Object.values(programResults).forEach(removeProgram);
        };
    }, [programResults, removeProgram]);

    useEffect(() => {
        setProgramResults(results => {
            const newResults: Record<ProgramId, ProgramResult> = {
                ...results,
            };
            const existingProgramIds = new Set();
            for (let id in results) {
                existingProgramIds.add(id);
            }

            programs?.forEach(program => {
                existingProgramIds.add(program.id);
                if (!results[program.id]) {
                    const result = createProgram(program);
                    if (result) {
                        newResults[program.id] = result;
                    }
                }
            });
            Object.entries(newResults).forEach(([programId, result]) => {
                if (!existingProgramIds.has(programId)) {
                    removeProgram(result);
                    delete newResults[programId];
                }
            });
            return newResults;
        });
    }, [...(programs ?? []), createProgram, removeProgram]);

    const activeProgramResult = useMemo(() => programResults[activeProgram ?? ""], [programResults, activeProgram]);

    useEffect(() => {
        if (activeProgramResult?.program && gl) {
            gl.useProgram(activeProgramResult.program);
            setUsedProgram(activeProgramResult.program);
        } else {
            setUsedProgram(undefined);
        }
    }, [gl, activeProgramResult]);
    return {
        usedProgram,
    }
}