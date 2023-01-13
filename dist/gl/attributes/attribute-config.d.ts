type AttributeType = "FLOAT" | "UNSIGNED_BYTE" | "UNSIGNED_SHORT";
type Usage = "STATIC_DRAW" | "DYNAMIC_DRAW";
export interface AttributeConfiguration {
    readonly name: string;
    readonly location?: number;
    readonly type: AttributeType;
    readonly usage: Usage;
    readonly instances: number;
    readonly normalize?: boolean;
}
export {};
