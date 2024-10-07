// IVRequirements.ts
export interface IVRequirement {
    value: number; // Represents the IV value (0-31 range typical for Pokémon)
    prices: Record<string, number>; // Prices can be represented as key-value pairs
}

export interface IVRequirements {
    hp: IVRequirement;
    atk: IVRequirement;
    def: IVRequirement;
    spAtk: IVRequirement;
    spDef: IVRequirement;
    speed: IVRequirement;
}
