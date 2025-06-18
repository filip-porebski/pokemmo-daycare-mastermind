/**
 * @copyright 2020 Adam (charrondev) Charron
// Changes 2024 onwards filip-porebski
 * @license GPL-3.0-only
 */

import { getPokemon, PokedexMon } from "@pokemmo/data/pokedex";
import { ButtonType, FormButton } from "@pokemmo/form/FormButton";
import { FormCheckBox } from "@pokemmo/form/FormCheckBox";
import { FormHeading } from "@pokemmo/form/FormHeading";
import { FormInput } from "@pokemmo/form/FormInput";
import { FormLabel } from "@pokemmo/form/FormLabel";
import { FormGrid, FormRow } from "@pokemmo/form/FormRow";
import { LabelAndValue } from "@pokemmo/form/LabelAndValue";
import { usePokemon } from "@pokemmo/pokemon/pokemonHooks";
import { PokemonSelect } from "@pokemmo/pokemon/PokemonSelect";
import { PokemonSprite } from "@pokemmo/pokemon/PokemonSprite";
import { useProjectActions } from "@pokemmo/projects/projectHooks";
import { IProject } from "@pokemmo/projects/projectsSlice";
import { DecoratedCard } from "@pokemmo/styles/Card";
import { colorPrimary } from "@pokemmo/styles/variables";
import { notEmpty } from "@pokemmo/utils";
import React, { useMemo, useState } from "react";
import IconClear from "../icons/IconClear.svg";
import IconAdd from "../icons/IconAdd.svg";

export function ProjectAlternativeBreederForm(props: { project: IProject }) {
    const { project } = props;
    const { projectID } = project;
    const {
        updateProject,
        addAlternative,
        removeAlternative,
        clearAlternatives,
    } = useProjectActions();

    // State for search filter and display limit
    const [searchFilter, setSearchFilter] = useState("");
    const [displayLimit, setDisplayLimit] = useState(12); // Show 12 alternatives initially
    
    const pokemon = usePokemon(project.targetPokemonID);
    
    // Get all potential alternative breeders based on egg groups
    const allPotentialAlternatives = useMemo(() => {
        if (!pokemon) return [];
        
        const dexMon = getPokemon(pokemon.identifier);
        if (!dexMon) return [];
        
        const targetEggGroups = [dexMon.eggGroup1, dexMon.eggGroup2].filter(notEmpty);
        // Import pokemon.csv directly
        const allPokemon: PokedexMon[] = require("@pokemmo/data/pokemon.csv");
        const alternatives = new Set<string>();
        
        // Find all Pokémon that share at least one egg group with the target
        allPokemon.forEach((mon: PokedexMon) => {
            // Skip if it's the same as the target
            if (mon.identifier === pokemon.identifier) return;
            
            // Skip if it's already in the alternatives list
            if (project.altBreederIdentifiers.includes(mon.identifier)) return;
            
            // Check if it shares an egg group with the target
            const monEggGroups = [mon.eggGroup1, mon.eggGroup2].filter(notEmpty);
            const sharesEggGroup = monEggGroups.some(group => targetEggGroups.includes(group));
            
            if (sharesEggGroup) {
                // If we don't allow evolved Pokémon, check if it's a base form
                if (!project.allowEvolvedAltBreeders && mon.evolvesFromSpeciesID > 0) {
                    return;
                }
                
                alternatives.add(mon.identifier);
            }
        });
        
        return Array.from(alternatives);
    }, [pokemon, project.altBreederIdentifiers, project.allowEvolvedAltBreeders]);
    
    if (!pokemon) {
        return null;
    }

    const dexMon = getPokemon(pokemon.identifier);
    if (!dexMon) {
        return null;
    }

    return (
        <>
            <FormHeading
                title="Alternative Breeding Stock"
                description="These Pokemon may be substituted while breeding."
            />
            <FormRow
                css={{
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                }}
            >
                <div
                    css={{
                        display: "flex",
                        alignItems: "center",
                        flex: 1,
                    }}
                >
                    <FormLabel
                        label="Add Alternative"
                        css={{ maxWidth: 400, flex: 1, marginRight: 24 }}
                    >
                        <PokemonSelect
                            eggGroups={[
                                dexMon.eggGroup1,
                                dexMon.eggGroup2,
                            ].filter(notEmpty)}
                            excludeIdentifiers={project.altBreederIdentifiers}
                            placeholder="Find Pokemon"
                            onChange={alternativeIdentifier => {
                                addAlternative({
                                    projectID,
                                    alternativeIdentifier: alternativeIdentifier as string,
                                });
                            }}
                            value={null}
                            allowEvolvedPokemon={
                                project.allowEvolvedAltBreeders
                            }
                        />
                    </FormLabel>
                    <FormLabel label="" css={{ paddingTop: 14 }}>
                        <FormCheckBox
                            label="Show Evolved Pokemon"
                            checked={project.allowEvolvedAltBreeders}
                            onChange={allowEvolvedAltBreeders => {
                                updateProject({
                                    allowEvolvedAltBreeders,
                                    projectID,
                                });
                            }}
                        />
                    </FormLabel>
                </div>
                <div css={{ display: "flex", gap: 12 }}>
                    <FormButton
                        css={{ marginBottom: 6, flex: "0 1 auto" }}
                        onClick={() => {
                            // Add all potential alternatives
                            allPotentialAlternatives.forEach(alternativeIdentifier => {
                                addAlternative({
                                    projectID,
                                    alternativeIdentifier,
                                });
                            });
                        }}
                        disabled={allPotentialAlternatives.length === 0}
                        title="Add all compatible Pokémon as alternatives"
                    >
                        <span css={{ display: "flex", alignItems: "center" }}>
                            <IconAdd css={{ height: 14, width: 14, marginRight: 6 }} />
                            Add All Alternatives
                        </span>
                    </FormButton>
                    
                    <FormButton
                        css={{ marginBottom: 6, flex: "0 1 auto" }}
                        onClick={() => {
                            clearAlternatives({ projectID });
                        }}
                        disabled={project.altBreederIdentifiers.length === 0}
                    >
                        Clear Alternatives
                    </FormButton>
                </div>
            </FormRow>
            {project.altBreederIdentifiers.length > 0 && (
                <>
                    <FormRow>
                        <FormInput
                            placeholder="Search alternatives..."
                            value={searchFilter}
                            onChange={(value) => {
                                setSearchFilter(value);
                                // Reset display limit when searching
                                if (value) {
                                    setDisplayLimit(12);
                                }
                            }}
                            css={{ marginBottom: 12 }}
                        />
                    </FormRow>
                    
                    {(() => {
                        // Filter alternatives once to avoid repeating the filtering logic
                        const filteredAlternatives = project.altBreederIdentifiers
                            .filter(alternativeIdentifier => {
                                if (!searchFilter) return true;
                                const dexMon = getPokemon(alternativeIdentifier);
                                if (!dexMon) return false;
                                return dexMon.displayName.toLowerCase().includes(searchFilter.toLowerCase());
                            });
                        
                        // Get the alternatives to display (limited by displayLimit)
                        const displayedAlternatives = filteredAlternatives.slice(0, displayLimit);
                        
                        // Calculate remaining alternatives
                        const remainingCount = filteredAlternatives.length - displayLimit;
                        
                        return (
                            <>
                                <FormGrid
                                    itemStyles={{}}
                                >
                                    {displayedAlternatives.map((alternativeIdentifier, i) => {
                                        const dexMon = getPokemon(alternativeIdentifier);
                                        if (!dexMon) {
                                            return <React.Fragment key={i} />;
                                        }

                                        return (
                                            <AltBreederCard
                                                dexMon={dexMon}
                                                key={i}
                                                onDelete={() => {
                                                    removeAlternative({
                                                        projectID,
                                                        alternativeIdentifier,
                                                    });
                                                }}
                                            />
                                        );
                                    })}
                                </FormGrid>
                                
                                {/* Show more button if there are more alternatives to display */}
                                {remainingCount > 0 && (
                                    <FormButton
                                        css={{ margin: "12px auto", display: "block" }}
                                        onClick={() => setDisplayLimit(prev => prev + 12)}
                                    >
                                        Show More ({remainingCount} remaining)
                                    </FormButton>
                                )}
                                
                                {/* Show count of displayed alternatives */}
                                <div css={{ textAlign: "center", marginTop: 12, color: "#666" }}>
                                    Showing {displayedAlternatives.length} of {filteredAlternatives.length} alternative breeders
                                </div>
                            </>
                        );
                    })()}
                </>
            )}
        </>
    );
}

function AltBreederCard(props: {
    dexMon: PokedexMon;
    className?: string;
    onDelete?: () => void;
}) {
    const { className, dexMon, onDelete } = props;
    return (
        <DecoratedCard
            className={className}
            decorationColor={colorPrimary}
            css={{
                display: "flex",
                alignItems: "center",
            }}
        >
            <PokemonSprite
                dexMon={dexMon}
                css={{ marginRight: 18 }}
                height={36}
                width={36}
            />
            <LabelAndValue
                vertical
                label={dexMon.displayName}
                css={{ flex: 1 }}
            >
                Percentage Male: {dexMon.percentageMale}%
            </LabelAndValue>
            <FormButton
                buttonType={ButtonType.ICON}
                onClick={onDelete}
                title="Remove Pokemon"
            >
                <IconClear
                    css={{
                        height: 14,
                        width: 14,
                    }}
                />
            </FormButton>
        </DecoratedCard>
    );
}
