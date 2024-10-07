import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "@pokemmo/state/reducers";
import { addPokemon, updatePokemonInStore } from "@pokemmo/pokemon/pokemonSlice";
import { usePageContentSize } from "@pokemmo/layout/PageContent";
import { ButtonType, FormButton } from "@pokemmo/form/FormButton";
import { FormHeading } from "@pokemmo/form/FormHeading";
import { FormInput } from "@pokemmo/form/FormInput";
import { FormLabel } from "@pokemmo/form/FormLabel";
import { FormRow } from "@pokemmo/form/FormRow";
import { LabelAndValue } from "@pokemmo/form/LabelAndValue";
import { Breadcrumbs } from "@pokemmo/layout/Breadcrumbs";
import { pageContainerPadding } from "@pokemmo/layout/PageContainer";
import { usePokemon } from "@pokemmo/pokemon/pokemonHooks";
import { PokemonInfoRow } from "@pokemmo/pokemon/PokemonInfoRow";
import { IPokemonBreederStub } from "@pokemmo/pokemon/PokemonTypes";
import { ProjectAlternativeBreederForm } from "@pokemmo/projects/ProjectAlternativeBreederForm";
import {
    useProject,
    useProjectActions,
    useProjectPokemon,
} from "@pokemmo/projects/projectHooks";
import { ProjectPricingRequirementsForm } from "@pokemmo/projects/ProjectPricingRequirementsForm";
import { IProject } from "@pokemmo/projects/projectsSlice";
import { DecoratedCard } from "@pokemmo/styles/Card";
import { boxShadowCard, colorPrimary } from "@pokemmo/styles/variables";
import { relativeTime } from "@pokemmo/utils";
import { useHistory, useParams } from "react-router-dom";
import { PokemonForm } from "@pokemmo/pokemon/PokemonForm";
import { PokemonBuilder } from "@pokemmo/pokemon/PokemonBuilder";
import { IPokemon } from "@pokemmo/pokemon/PokemonTypes";

interface IProps {}

export function ProjectView(props: IProps) {
    const dispatch = useDispatch();
    const { updateProject } = useProjectActions();
    const { projectID } = useParams<{ projectID: string }>();
    const project = useProject(projectID);
    const projectPokemon = useProjectPokemon(projectID);
    const [isEditingGoalPokemon, setIsEditingGoalPokemon] = useState(false);

    // Fetch the Pokémon state using the useSelector hook
    const pokemonState = useSelector((state: RootState) => state.pokemon.pokemonByID);

    console.log('Project ID:', projectID);
    console.log('Project Data:', project);
    console.log('Project Pokémon:', projectPokemon);
    console.log('Full Pokemon State:', pokemonState);

    if (!project || !projectPokemon) {
        console.warn('Project or Project Pokémon not found:', { project, projectPokemon });
        return <>Not Found</>;
    }

    const handleGoalPokemonUpdate = (newGoalPokemon: IPokemon) => {
        console.log('Updating Goal Pokémon:', newGoalPokemon);
    
        // Check if the Pokémon exists in the current state
        const existingPokemon = pokemonState[newGoalPokemon.id];
    
        if (existingPokemon) {
            // Update the Pokémon if it already exists in the state
            const updatedPokemon = {
                ...existingPokemon,
                ivs: newGoalPokemon.ivs,
                nature: newGoalPokemon.nature,
                gender: newGoalPokemon.gender,
                ownershipStatus: newGoalPokemon.ownershipStatus,
            };
    
            console.log('Existing Pokémon:', existingPokemon);
            console.log('Updated Pokémon:', updatedPokemon);
    
            
            // Update the Pokémon state in the Redux store
            dispatch(updatePokemonInStore(updatedPokemon));
        } else {
            // If the Pokémon doesn't exist, add it to the state
            console.log('Adding new Pokémon to state:', newGoalPokemon);
            dispatch(addPokemon([newGoalPokemon]));
        }
    
        // Update the project to use the new goal Pokémon ID
        updateProject({ projectID, targetPokemonID: newGoalPokemon.id });
    
        console.log('Updated Project after setting new target Pokemon:', { projectID, targetPokemonID: newGoalPokemon.id });
        console.log('Updated Pokémon State:', pokemonState);
    
        setIsEditingGoalPokemon(false);
    };
    
    

    return (
        <div>
            <Breadcrumbs
                crumbs={[
                    { name: "Projects", href: "/projects" },
                    { name: project.projectName, href: `/projects/${project.projectID}` },
                ]}
            />
            <FormHeading title="Project Information" description="Meta information about your Project." />
            <FormRow itemStyles={{ marginRight: 18 }}>
                <FormLabel css={{ maxWidth: 400 }} label="Project Name">
                    <FormInput
                        placeholder="Project 1"
                        onChange={(projectName) => updateProject({ projectID, projectName })}
                        value={project.projectName}
                    />
                </FormLabel>
                <DecoratedCard css={{ minWidth: "200px !important", flex: 0 }} decorationColor={colorPrimary}>
                    <LabelAndValue vertical label="Last Updated">
                        {relativeTime(project.dateUpdated) + " ago"}
                    </LabelAndValue>
                </DecoratedCard>
            </FormRow>
            <FormHeading title="Goal Pokemon" description="The pokemon you are trying to breed." />
            {projectPokemon && <PokemonInfoRow pokemon={projectPokemon} />}
            <ProjectPricingRequirementsForm project={project} />
            <ProjectAlternativeBreederForm project={project} />
            <CalculateBar project={project} onEditGoalPokemon={() => setIsEditingGoalPokemon(true)} />
            {isEditingGoalPokemon && (
                <PokemonForm
                    isOpen={isEditingGoalPokemon}
                    onDismiss={() => setIsEditingGoalPokemon(false)}
                    isProject={true}
                    projectID={projectID}
                    afterSubmit={handleGoalPokemonUpdate}
                    requirements={{ allowedIdentifiers: undefined }}
                />
            )}
        </div>
    );
}

function CalculateBar(props: { project: IProject; onEditGoalPokemon: () => void }) {
    const { project, onEditGoalPokemon } = props;
    const { projectID } = project;
    const { updateProject } = useProjectActions();
    const history = useHistory();
    const pokemon = usePokemon(project.targetPokemonID);
    const pageSize = usePageContentSize();

    console.log('CalculateBar Component - Current Project:', project);
    console.log('Current Target Pokemon in CalculateBar:', pokemon);

    if (!pokemon) {
        console.warn('No target Pokemon found in CalculateBar for project:', projectID);
        return null;
    }

    const { breederStubs } = project;
    const hasBeenCalculated = breederStubs
        ? Object.keys(breederStubs).length > 0
        : false;

    const calculateBreeders = () => {
        console.log('Calculating breeders for target Pokémon:', pokemon);
        const breeders = PokemonBuilder.from(pokemon)
            .ivs(project.ivPricing)
            .calculateBreeders({
                allowedIdentifiers: project.altBreederIdentifiers,
            });
        const stubs: Record<string, IPokemonBreederStub[]> = {};
        breeders.forEach((breeder: IPokemonBreederStub) => {
            if (stubs[breeder.stubHash]) {
                stubs[breeder.stubHash].push(breeder);
            } else {
                stubs[breeder.stubHash] = [breeder];
            }
        });

        console.log('Calculated Breeders:', breeders);

        updateProject({ projectID, breederStubs: stubs });
        console.log('Updated Project after calculating breeders:', { projectID, breederStubs: stubs });

        history.push(`/projects/${project.projectID}/guide`);
    };

    return (
        <>
            <div css={{ height: 32 }}></div>
            <div
                css={{
                    height: 66,
                    position: "fixed",
                    bottom: 0,
                    right: 0,
                    left: pageSize.left,
                    background: "#fff",
                    boxShadow: boxShadowCard,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: pageContainerPadding,
                    paddingTop: 0,
                    paddingBottom: 0,
                }}
            >
                <h3 css={{ marginBottom: 0 }}>Breeding Guide</h3>
                <div>
                    <FormButton
                        css={{ marginRight: 18 }}
                        buttonType={ButtonType.STANDARD}
                        onClick={onEditGoalPokemon}
                    >
                        Edit Goal Pokémon
                    </FormButton>
                    {hasBeenCalculated && (
                        <FormButton
                            css={{ marginRight: 18 }}
                            buttonType={ButtonType.STANDARD}
                            onClick={calculateBreeders}
                        >
                            Recalculate
                        </FormButton>
                    )}
                    <FormButton
                        buttonType={ButtonType.PRIMARY}
                        onClick={() => {
                            if (hasBeenCalculated) {
                                history.push(`/projects/${project.projectID}/guide`);
                                return;
                            }
                            calculateBreeders();
                        }}
                    >
                        {hasBeenCalculated ? "View" : "Calculate"}
                    </FormButton>
                </div>
            </div>
        </>
    );
}

