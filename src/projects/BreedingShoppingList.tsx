/**
 * @copyright 2020 Adam (charrondev) Charron
// Changes 2024 onwards filip-porebski
 * @license GPL-3.0-only
 */

import { getPokemon } from "@pokemmo/data/pokedex";
import { FormHeading } from "@pokemmo/form/FormHeading";
import { LabelAndValue } from "@pokemmo/form/LabelAndValue";
import { GridLayout, GridSection } from "@pokemmo/layout/GridLayout";
import { Separator } from "@pokemmo/layout/Separator";
import { PokemonMeta } from "@pokemmo/pokemon/PokemonMeta";
import { IPokemonBreederStub, Stat } from "@pokemmo/pokemon/PokemonTypes";
import { usePokemon } from "@pokemmo/pokemon/pokemonHooks";
import { BreedingAttachButton } from "@pokemmo/projects/BreedingAttachButton";
import { colorForStat } from "@pokemmo/projects/IVView";
import { useProject } from "@pokemmo/projects/projectHooks";
import { IProject } from "@pokemmo/projects/projectsSlice";
import { DecoratedCard } from "@pokemmo/styles/Card";
import { notEmpty } from "@pokemmo/utils";
import React, { useDebugValue } from "react";

export function BreedingShoppingList(props: { project: IProject }) {
    const { project } = props;
    const { projectID } = project;
    const ownedStubs = useBreederStubs(projectID, true, true);
    const requiredStubs = useBreederStubs(projectID, false, true);
    const requiredLength = Object.values(requiredStubs).flat().length;
    const ownedLength = Object.values(ownedStubs).flat().length;
    const totalLength = requiredLength + ownedLength;

    return (
        <>
            <FormHeading
                title={
                    <>
                        Shopping/Catching List{" "}
                        <span css={{ fontWeight: "normal" }}>
                            ({ownedLength}/{totalLength})
                        </span>
                    </>
                }
                description={
                    <>
                        In order to breed this pokemon, you will need to
                        purchase or catch the following pokemon & items. If you
                        buy or catch a pokemon that is already already has some
                        desired IVs, just add it to the project.{" "}
                        <strong>
                            Estimated spread is to reduce purchasing costs.
                        </strong>
                    </>
                }
            />
            <GridLayout>
                {requiredLength > 0 && (
                    <GridSection title="Required">
                        {Object.values(requiredStubs).map((stubs, i) => {
                            return (
                                <ShoppingListStubItem
                                    projectID={projectID}
                                    stubs={stubs}
                                    key={i}
                                    css={{
                                        margin: 18,
                                    }}
                                    type="add"
                                />
                            );
                        })}
                    </GridSection>
                )}
                {ownedLength > 0 && (
                    <GridSection title="Owned">
                        {Object.values(ownedStubs).map((stubs, i) => {
                            return (
                                <ShoppingListStubItem
                                    projectID={projectID}
                                    stubs={stubs}
                                    key={i}
                                    css={{
                                        margin: 18,
                                    }}
                                    type="remove"
                                />
                            );
                        })}
                    </GridSection>
                )}
            </GridLayout>
        </>
    );
}

function ShoppingListStubItem(props: {
    stubs: IPokemonBreederStub[];
    projectID: string;
    className?: string;
    action?: React.ReactNode;
    type: "add" | "remove";
}) {
    const { projectID } = props;
    const { stubs } = props;
    const first = stubs[0];
    // Get the project outside the callback
    const project = useProject(projectID);
    // Get the target Pokémon from the project
    const targetPokemon = usePokemon(project?.targetPokemonID || null);

    if (!first) {
        // Shouldn't happen.
        return null;
    }

    let firstStat: Stat | null = null;
    for (const [stat, firstStatInfo] of Object.entries(first.ivs)) {
        if (firstStatInfo.value) {
            firstStat = stat as Stat;
        }
    }
    
    // Format the allowed breeders text
    let allowedBreedersText = "";
    if (project && targetPokemon) {
        const targetIdentifier = targetPokemon.identifier;
        const dexMon = getPokemon(targetIdentifier);
        
        if (dexMon) {
            // Check if this stub allows the target Pokémon
            const allowsTarget = first.allowedIdentifiers.includes(targetIdentifier);
            
            // Check if alternative breeders are allowed (more than just the target)
            const hasAlternatives = first.allowedIdentifiers.length > 1 || 
                (first.allowedIdentifiers.length === 1 && !allowsTarget);
            
            // Format the display text
            if (allowsTarget && hasAlternatives) {
                allowedBreedersText = `${dexMon.displayName}, Alternative Breeders`;
            } else if (allowsTarget) {
                allowedBreedersText = dexMon.displayName;
            } else if (hasAlternatives) {
                allowedBreedersText = "Alternative Breeders";
            } else {
                allowedBreedersText = "None";
            }
        }
    }

    return (
        <DecoratedCard
            itemCount={stubs.length}
            className={props.className}
            css={{
                marginBottom: 18,
                display: "flex",
                alignItems: "stretch",
                justifyContent: "space-between",
            }}
            decorationColor={colorForStat(firstStat) ?? undefined}
        >
            <div
                css={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",

                    "& > *:last-child": {
                        marginBottom: 0,
                    },
                }}
            >
                <PokemonMeta
                    ivs={first.ivs}
                    nature={first.nature}
                    gender={first.gender}
                />
                <LabelAndValue label="Allowed Breeders">
                    {allowedBreedersText}
                </LabelAndValue>
            </div>
            <div css={{ display: "flex", alignItems: "center" }}>
                <Separator vertical />
                <BreedingAttachButton stub={first} projectID={projectID} />
            </div>
        </DecoratedCard>
    );
}

function useBreederStubs(
    projectID: string,
    owned: boolean,
    onlyLeaves?: boolean,
): Record<string, IPokemonBreederStub[]> {
    const project = useProject(projectID);

    const result: Record<string, IPokemonBreederStub[]> = {};
    if (project) {
        for (const [stubHash, stubs] of Object.entries(project.breederStubs)) {
            const filtered = stubs.filter(stub => {
                if (onlyLeaves && stub.parents) {
                    return false;
                }

                if (owned && stub.attachedPokemonID) {
                    return true;
                } else if (!owned && !stub.attachedPokemonID) {
                    return true;
                }

                return false;
            });

            if (filtered.length > 0) {
                result[stubHash] = filtered;
            }
        }
    }

    useDebugValue({ result });

    return result;
}
