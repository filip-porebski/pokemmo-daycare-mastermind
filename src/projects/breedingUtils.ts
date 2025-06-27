/**
 * @copyright 2020 Adam (charrondev) Charron
// Changes 2024 onwards filip-porebski
 * @license GPL-3.0-only
 */

import { ivsMeetMinimums, nonEmptyIVs } from "@pokemmo/pokemon/IVUtils";
import {
    Gender,
    IPokemonBreederStub,
    IPokemon,
    Stat,
} from "@pokemmo/pokemon/PokemonTypes";
import { difference } from "lodash-es";

export enum BreedingItem {
    HP = "Power Weight",
    ATK = "Power Bracer",
    DEF = "Power Belt",
    SP_ATK = "Power Lens",
    SP_DEF = "Power Band",
    SPEED = "Power Anklet",
    NATURE = "Everstone",
}

export interface IBreedingPair {
    stub: IPokemonBreederStub;
    parents: Record<Gender, IPokemonBreederStub> | null;
}

export function helpItemForPair(
    pair: IBreedingPair,
): Record<Gender, BreedingItem | null> {
    if (!pair.parents) {
        return {
            [Gender.MALE]: null,
            [Gender.FEMALE]: null,
        };
    }

    const { male, female } = pair.parents;
    const maleStats = Object.keys(nonEmptyIVs(male.ivs));
    const femaleStats = Object.keys(nonEmptyIVs(female.ivs));

    let maleItem = heldItemForStat(
        (difference(maleStats, femaleStats)[0] as Stat) ?? null,
    );
    let femaleItem = heldItemForStat(
        (difference(femaleStats, maleStats)[0] as Stat) ?? null,
    );
    if (male.nature) {
        maleItem = BreedingItem.NATURE;
    } else if (female.nature) {
        femaleItem = BreedingItem.NATURE;
    }

    return {
        [Gender.MALE]: maleItem,
        [Gender.FEMALE]: femaleItem,
    };
}

export function heldItemForStat(stat: Stat | null): BreedingItem | null {
    switch (stat) {
        case Stat.HP:
            return BreedingItem.HP;
        case Stat.ATTACK:
            return BreedingItem.ATK;
        case Stat.DEFENSE:
            return BreedingItem.DEF;
        case Stat.SPECIAL_ATTACK:
            return BreedingItem.SP_ATK;
        case Stat.SPECIAL_DEFENSE:
            return BreedingItem.SP_DEF;
        case Stat.SPEED:
            return BreedingItem.SPEED;
        default:
            return null;
    }
}

export function pokemonMatchesStub(
    pokemon: IPokemon,
    stub: IPokemonBreederStub,
): boolean {
    if (stub.gender !== pokemon.gender) {
        return false;
    }

    if (stub.nature && pokemon.nature !== stub.nature) {
        return false;
    }

    if (
        stub.forcedIdentifier &&
        stub.forcedIdentifier !== pokemon.identifier
    ) {
        return false;
    }

    if (stub.allowedIdentifiers.length > 0) {
        if (!stub.allowedIdentifiers.includes(pokemon.identifier)) {
            return false;
        }
    }

    return ivsMeetMinimums(pokemon.ivs, stub.ivs);
}
