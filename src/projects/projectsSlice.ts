/**
 * @copyright 2020 Adam (charrondev) Charron
// Changes 2024 onwards filip-porebski
 * @license GPL-3.0-only
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { pokemonSlice } from "@pokemmo/pokemon/pokemonSlice";
import { stubSlice } from "@pokemmo/projects/stubSlice";
import { IPokemonBreederStub, IVRequirements } from "@pokemmo/pokemon/PokemonTypes";

export interface IProject {
    projectName: string;
    projectID: string;
    ivPricing: IVRequirements;
    averagePricing: number;
    targetPokemonID: string;
    breederPokemonIDs: string[];
    breederStubs: Record<string, IPokemonBreederStub[]>;
    altBreederIdentifiers: string[];
    allowEvolvedAltBreeders: boolean;
    dateCreated: string;
    dateUpdated: string;
}

interface IProjectsState {
    projectsByID: Record<string, IProject>;
}

type StateWithProject<T extends string> = IProjectsState & { [key in T]: IProject };

type ProjectPayload<T> = PayloadAction<T & { projectID: string }>;

function ensureProject<T>(
    data: IProjectsState,
    action: ProjectPayload<T>,
): data is StateWithProject<typeof action["payload"]["projectID"]> {
    return action.payload.projectID in data.projectsByID;
}

function handleDates(data: IProjectsState, action: ProjectPayload<any>) {
    const { projectID } = action.payload;
    const project = data.projectsByID[projectID];
    if (project) {
        project.dateUpdated = new Date().toISOString();
    }
}

export const UNTITLED_PROJECT = "(Untitled Project)";

export const projectsSlice = createSlice({
    name: "projects",
    initialState: {
        projectsByID: {},
    } as IProjectsState,
    reducers: {
        addProject: (state, action: PayloadAction<{ project: IProject }>) => {
            const { project } = action.payload;
            state.projectsByID[project.projectID] = project;
        },
        updateProject: (state, action: ProjectPayload<Partial<IProject>>) => {
            if (ensureProject(state, action)) {
                handleDates(state, action);
                state.projectsByID[action.payload.projectID] = {
                    ...state.projectsByID[action.payload.projectID],
                    ...action.payload,
                };
            }
        },
        deleteProject: (state, action: PayloadAction<{ project: IProject }>) => {
            const { project } = action.payload;
            delete state.projectsByID[project.projectID];
        },
        addAlternative: (state, action: ProjectPayload<{ alternativeIdentifier: string }>) => {
            if (ensureProject(state, action)) {
                handleDates(state, action);
                const { projectID, alternativeIdentifier } = action.payload;
                const alternativeSet = new Set(state.projectsByID[projectID].altBreederIdentifiers);
                alternativeSet.add(alternativeIdentifier);
                state.projectsByID[projectID].altBreederIdentifiers = Array.from(alternativeSet);
            }
        },
        removeAlternative: (state, action: ProjectPayload<{ alternativeIdentifier: string }>) => {
            if (ensureProject(state, action)) {
                handleDates(state, action);
                const { projectID, alternativeIdentifier } = action.payload;
                const alternativeSet = new Set(state.projectsByID[projectID].altBreederIdentifiers);
                alternativeSet.delete(alternativeIdentifier);
                state.projectsByID[projectID].altBreederIdentifiers = Array.from(alternativeSet);
            }
        },
        clearAlternatives: (state, action: ProjectPayload<{}>) => {
            if (ensureProject(state, action)) {
                handleDates(state, action);
                const { projectID } = action.payload;
                state.projectsByID[projectID].altBreederIdentifiers = [];
            }
        },
        setPokemon: (state, action: ProjectPayload<{ pokemonID: string }>) => {
            if (ensureProject(state, action)) {
                handleDates(state, action);
                const { projectID, pokemonID } = action.payload;
                state.projectsByID[projectID].targetPokemonID = pokemonID;
            }
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(stubSlice.actions.attachPokemonToStub, (state, action) => {
                if (ensureProject(state, action)) {
                    handleDates(state, action);
                    const { projectID, stubHash, stubID, pokemonID } = action.payload;
                    const project = state.projectsByID[projectID];
                    const stubs = project.breederStubs[stubHash];
                    const stubModify = stubs.find(stub => {
                        const matchesSpecificID = stubID ? stub.stubID === stubID : true;
                        return !stub.attachedPokemonID && matchesSpecificID;
                    });
                    if (stubModify) {
                        stubModify.attachedPokemonID = pokemonID;
                    }
                }
            })
            .addCase(stubSlice.actions.detachPokemonFromStub, (state, action) => {
                if (ensureProject(state, action)) {
                    handleDates(state, action);
                    const { projectID, stubHash, pokemonID } = action.payload;
                    const project = state.projectsByID[projectID];
                    const stub = project.breederStubs[stubHash]?.find(stub => {
                        if (stub.attachedPokemonID === pokemonID) {
                            return stub;
                        }
                    });
                    if (stub) {
                        stub.attachedPokemonID = null;
                    }
                }
            })
            .addCase(pokemonSlice.actions.deletePokemon, (state, action) => {
                const pokemonID = action.payload.pokemonID; // Corrected to use pokemonID
                Object.values(state.projectsByID).forEach(project => {
                    if (project.targetPokemonID === pokemonID) {
                        // Delete the project if the target Pokémon ID matches.
                        delete state.projectsByID[project.projectID];
                    } else {
                        // Otherwise, go through all breeder stubs and remove the Pokémon reference.
                        Object.values(project.breederStubs)
                            .flat()
                            .forEach(stub => {
                                if (stub.attachedPokemonID === pokemonID) {
                                    stub.attachedPokemonID = null;
                                }
                            });
                    }
                });
            })            
});

export const {
    addProject,
    updateProject,
    deleteProject,
    addAlternative,
    removeAlternative,
    clearAlternatives,
    setPokemon,
} = projectsSlice.actions;

export default projectsSlice.reducer;
