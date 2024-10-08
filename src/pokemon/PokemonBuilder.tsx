/**
 * @copyright 2020 Adam (charrondev)
 * @license GPL-3.0-only
 */

import {
    EMPTY_IV,
    subtractIVRequirement,
    swapGender,
} from "@pokemmo/pokemon/IVUtils";
import { PokemonStoreAccessor } from "@pokemmo/pokemon/PokemonStoreAccessor";
import {
    BreedStatus,
    Gender,
    IPokemon,
    IPokemonBreederStub,
    IVRequirements,
    OwnershipStatus,
    Stat,
} from "@pokemmo/pokemon/PokemonTypes";
import { hashString, uuidv4 } from "@pokemmo/utils";

export interface IParentOptions {
    allowedIdentifiers: string[];
}

export const DEFAULT_PARENT_BUILDER_OPTIONS: IParentOptions = {
    allowedIdentifiers: [],
};

interface IStubAncestors {
    parents: Record<Gender, IPokemonBreederStub> | null;
    allParents: IPokemonBreederStub[];
}

const EMPTY_PARENT_GROUP: IStubAncestors = {
    parents: null,
    allParents: [],
};

/**
 * Builder pattern implementation for Pokemon.
 */
export class PokemonBuilder extends PokemonStoreAccessor {
    private _identifier: string;
    private _uuid: string = uuidv4();
    private _id: string = this.calculateID();

    public constructor(pokemon: IPokemon);
    public constructor(identifier: string);
    public constructor(pokemonOrIdentfier: IPokemon | string) {
        super();
        if (typeof pokemonOrIdentfier === "string") {
            this._identifier = pokemonOrIdentfier;
        } else {
            const pok = pokemonOrIdentfier;
            this._identifier = pok.identifier;
            this._uuid = pok._uuid;
            this._id = pok.id;
            this._ivs = pok.ivs;
            this._nature = pok.nature;
            this._gender = pok.gender;
            this._projectIDs = pok.projectIDs;
            this._breedStatus = pok.breedStatus;
            this._ownershipStatus = pok.ownershipStatus;
            this._boughtPrice = pok.boughtPrice;
        }
    }

    // Static constants
    public static readonly BRACER_COST = 10000;
    public static readonly AVERAGE_UNDEFINED_PRICE = 10000; // Correctly defined static property
    public static readonly EVERSTONE_COST = 7000;


    public static create(identifier: string): PokemonBuilder {
        return new PokemonBuilder(identifier);
    }

    public static from(pokemon: IPokemon): PokemonBuilder {
        const builder = new PokemonBuilder(pokemon);
        return builder;
    }

    public result(): IPokemon {
        return {
            identifier: this._identifier,
            ivs: this._ivs,
            nature: this._nature,
            gender: this._gender,
            _uuid: this._uuid,
            id: this._id,
            projectIDs: this._projectIDs,
            ownershipStatus: this._ownershipStatus,
            boughtPrice: this._boughtPrice,
            breedStatus: this._breedStatus,
        };
    }

    private _ivs: IVRequirements = {
        [Stat.HP]: EMPTY_IV,
        [Stat.ATTACK]: EMPTY_IV,
        [Stat.DEFENSE]: EMPTY_IV,
        [Stat.SPECIAL_ATTACK]: EMPTY_IV,
        [Stat.SPECIAL_DEFENSE]: EMPTY_IV,
        [Stat.SPEED]: EMPTY_IV,
    };

    public ivs(ivs: IVRequirements) {
        this._ivs = ivs;
        this.calculateID();
        return this;
    }

    private _nature: string | null = null;
    public nature(nature: string | null) {
        this._nature = nature;
        this.calculateID();
        return this;
    }

    private _gender: Gender = Gender.MALE;
    public gender(gender: Gender) {
        this._gender = gender;
        this.calculateID();
        return this;
    }

    private _projectIDs: string[] = [];
    public projectIDs(projectIDs: string[]) {
        this._projectIDs = projectIDs;
        return this;
    }

    private _ownershipStatus: OwnershipStatus = OwnershipStatus.CAUGHT;
    private _boughtPrice: number = 0;
    public ownershipStatus(status: OwnershipStatus, boughtPrice: number = 0) {
        this._ownershipStatus = status;
        this._boughtPrice = boughtPrice;
        return this;
    }

    private _breedStatus: BreedStatus = BreedStatus.NONE;
    public breedStatus(status: BreedStatus) {
        this._breedStatus = status;
        return this;
    }

    private calculateID() {
        const id = `${this._identifier}-${
            this._gender
        }-${PokemonBuilder.ivRequirementsAsString(this._ivs)}-${
            this._nature ? this._nature + "-" : ""
        }${this._uuid}`;
        this._id = id;
        return id;
    }

    public static ivRequirementsAsString(ivs: IVRequirements): string {
        const statNum = (stat: Stat) => {
            const statInfo = ivs?.[stat];
            if (!statInfo) {
                return (0).toString().padStart(2, "0");
            } else {
                return (statInfo.value ?? 31).toString().padStart(2, "0");
            }
        };
        return `${statNum(Stat.HP)}_${statNum(Stat.ATTACK)}_${statNum(
            Stat.DEFENSE,
        )}_${statNum(Stat.SPECIAL_ATTACK)}_${statNum(
            Stat.SPECIAL_DEFENSE,
        )}_${statNum(Stat.SPEED)}`;
    }

    public calculateBreeders(
        options: IParentOptions = DEFAULT_PARENT_BUILDER_OPTIONS,
    ): IPokemonBreederStub[] {
        const { ivs, nature, gender, identifier } = this.result();
        const stub = this.makeBreedingStub({
            ivs,
            nature,
            gender,
            allowedIdentifiers: [identifier],
            forcedIdentifier: identifier,
            generation: 0,
        });
        return [
            stub,
            ...this.internalCalculateBreeders(stub, options).allParents,
        ];
    }

    private internalCalculateBreeders(
        childStub: IPokemonBreederStub,
        options: IParentOptions = DEFAULT_PARENT_BUILDER_OPTIONS,
    ): IStubAncestors {
        const mostExpensive = this.getMostExpensiveStatGender(childStub.ivs);
    
        if (!mostExpensive) {
            return EMPTY_PARENT_GROUP;
        }
    
        let statCount = Object.values(childStub.ivs).filter(
            iv => iv.value !== 0 && iv.value != null,
        ).length;
    
        const firstParentGender = swapGender(mostExpensive.gender);
        const secondParentGender = mostExpensive.gender;
    
        const firstParentIVs = subtractIVRequirement(childStub.ivs, mostExpensive.stat);
        const secondParentIVs = subtractIVRequirement(firstParentIVs, mostExpensive.stat);
    
        const firstParent = this.makeBreedingStub({
            allowedIdentifiers: options.allowedIdentifiers,
            forcedIdentifier: null,
            ivs: firstParentIVs,
            gender: firstParentGender,
            nature: null,
            generation: childStub.generation + 1,
        });
    
        const secondParent = this.makeBreedingStub({
            allowedIdentifiers: options.allowedIdentifiers,
            forcedIdentifier: null,
            ivs: secondParentIVs,
            gender: secondParentGender,
            nature: null,
            generation: childStub.generation + 1,
        });
    
        const firstAncestors = this.internalCalculateBreeders(firstParent, options);
        const secondAncestors = this.internalCalculateBreeders(secondParent, options);
    
        // Explicitly assign the male and female properties
        return {
            parents: {
                male: firstParentGender === Gender.MALE ? firstParent : secondParent,
                female: firstParentGender === Gender.FEMALE ? firstParent : secondParent,
            },
            allParents: [...firstAncestors.allParents, ...secondAncestors.allParents],
        };
    }
    

    private makeBreedingStub(
        stub: Pick<
            IPokemonBreederStub,
            | "allowedIdentifiers"
            | "gender"
            | "ivs"
            | "nature"
            | "generation"
            | "forcedIdentifier"
        >,
    ): IPokemonBreederStub {
        const id =
            PokemonBuilder.ivRequirementsAsString(stub.ivs) +
            "-" +
            stub.gender +
            "-" +
            stub.nature +
            "-" +
            stub.allowedIdentifiers.sort().join(",");

        return {
            ...stub,
            parents: null,
            childHash: null,
            stubID: uuidv4(),
            stubHash: "stub-" + hashString(id).toString(),
            attachedPokemonID: null,
        };
    }

    private getMostExpensiveStatGender(ivs: IVRequirements) {
        const mostExpMaleStat = this.mostExpensiveStat(ivs, Gender.MALE);
        const mostExpFemaleStat = this.mostExpensiveStat(ivs, Gender.FEMALE);

        if (!mostExpMaleStat || !mostExpFemaleStat) {
            return null;
        }

        return this.getPriceForStat(ivs, mostExpMaleStat, Gender.MALE) >
            this.getPriceForStat(ivs, mostExpFemaleStat, Gender.FEMALE)
            ? { stat: mostExpMaleStat, gender: Gender.MALE }
            : { stat: mostExpFemaleStat, gender: Gender.FEMALE };
    }

    private getPriceForStat(ivs: IVRequirements, stat: Stat, gender: Gender): number {
        return ivs[stat].prices[gender] ?? PokemonBuilder.AVERAGE_UNDEFINED_PRICE;
    }

    private mostExpensiveStat(ivs: IVRequirements, gender: Gender): Stat | null {
        let mostExpensiveIV: Stat | null = null;
        let mostExpensiveIVPrice: number = 0;

        for (const [stat, info] of Object.entries(ivs)) {
            if (info.value === 0) {
                continue;
            }
            const price = info?.prices?.[gender] || PokemonBuilder.AVERAGE_UNDEFINED_PRICE;
            if (price >= mostExpensiveIVPrice) {
                mostExpensiveIVPrice = price;
                mostExpensiveIV = stat as Stat;
            }
        }

        return mostExpensiveIV;
    }
}
