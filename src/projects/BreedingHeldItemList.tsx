import { GridLayout, GridSection } from "@pokemmo/layout/GridLayout";
import { DecoratedCard } from "@pokemmo/styles/Card";
import { useProject } from "@pokemmo/projects/projectHooks";
import { helpItemForPair } from "@pokemmo/projects/breedingUtils";
import { Gender, IPokemonBreederStub } from "@pokemmo/pokemon/PokemonTypes";
import React from "react";
import { useDebugValue } from "react";

import EverstoneIcon from "@pokemmo/img/Everstone.png";
import PowerAnkletIcon from "@pokemmo/img/Power_Anklet.png";
import PowerBandIcon from "@pokemmo/img/Power_Band.png";
import PowerBeltIcon from "@pokemmo/img/Power_Belt.png";
import PowerBracerIcon from "@pokemmo/img/Power_Bracer.png";
import PowerLensIcon from "@pokemmo/img/Power_Lens.png";
import PowerWeightIcon from "@pokemmo/img/Power_Weight.png";
import AbilityPillIcon from "@pokemmo/img/Ability_Pill.png";

const itemIcons: Record<string, string> = {
    Everstone: EverstoneIcon,
    "Power Anklet": PowerAnkletIcon,
    "Power Band": PowerBandIcon,
    "Power Belt": PowerBeltIcon,
    "Power Bracer": PowerBracerIcon,
    "Power Lens": PowerLensIcon,
    "Power Weight": PowerWeightIcon,
    "Ability Pill": AbilityPillIcon,
};

export function BreedingHeldItemList(props: { projectID: string }) {
    const { projectID } = props;
    const itemCounts = useHeldItemCounts(projectID);

    if (Object.keys(itemCounts).length === 0) {
        return null;
    }

    return (
        <GridLayout>
            <GridSection title="Required Held Items">
                {Object.entries(itemCounts).map(([item, count]) => (
                    <DecoratedCard
                        key={item}
                        itemCount={count}
                        css={{
                            display: "flex",
                            alignItems: "center",
                            margin: 18,
                        }}
                    >
                        <img
                            src={itemIcons[item]}
                            alt={item}
                            css={{ width: 45, height: 45, marginRight: 12 }}
                        />
                        {item}
                    </DecoratedCard>
                ))}
            </GridSection>
        </GridLayout>
    );
}

export function useHeldItemCounts(projectID: string): Record<string, number> {
    const pairs = useBreederStubPairsForItems(projectID);
    const counts: Record<string, number> = {};
    pairs.forEach(pair => {
        const items = helpItemForPair(pair);
        if (items[Gender.MALE]) {
            counts[items[Gender.MALE]!] = (counts[items[Gender.MALE]!] || 0) + 1;
        }
        if (items[Gender.FEMALE]) {
            counts[items[Gender.FEMALE]!] = (counts[items[Gender.FEMALE]!] || 0) + 1;
        }
    });
    return counts;
}

function useBreederStubPairsForItems(projectID: string) {
    const project = useProject(projectID);

    if (!project) {
        throw new Error("Unknown Project");
    }

    const allStubsByStubHash = project.breederStubs;
    const allStubs = Object.values(allStubsByStubHash).flat();

    const matchedStubs: IPokemonBreederStub[] = [];

    const takeStub = (stubHash: string) => {
        const attachedStub = allStubsByStubHash[stubHash]?.find(
            stub => !matchedStubs.includes(stub) && stub.attachedPokemonID,
        );
        const nonAttachedStub = allStubsByStubHash[stubHash]?.find(
            stub => !matchedStubs.includes(stub) && !stub.attachedPokemonID,
        );

        const stubToUse = attachedStub ?? nonAttachedStub;

        if (!stubToUse) {
            throw new Error("should never happen");
        }

        matchedStubs.push(stubToUse);

        return stubToUse;
    };

    const pairs: { stub: IPokemonBreederStub; parents: Record<Gender, IPokemonBreederStub> | null }[] = [];

    allStubs.forEach(stub => {
        let parents: Record<Gender, IPokemonBreederStub> | null = null;

        if (stub.parents) {
            parents = {
                [Gender.MALE]: takeStub(stub.parents.male),
                [Gender.FEMALE]: takeStub(stub.parents.female),
            };
        }

        pairs.push({ stub, parents });
    });

    const result = pairs.filter(p => !!p.parents);
    useDebugValue({ result });
    return result;
}
