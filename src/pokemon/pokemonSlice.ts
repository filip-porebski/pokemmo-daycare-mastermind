import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPokemon, BreedStatus } from "@pokemmo/pokemon/PokemonTypes";

export type PokemonByID = Record<string, IPokemon>;

interface IPokemonState {
    pokemonByID: {
        [key: string]: IPokemon;
    };
}

const INITIAL_POKEMON_STATE: IPokemonState = {
    pokemonByID: {},
};

export const pokemonSlice = createSlice({
    name: "pokemon",
    initialState: INITIAL_POKEMON_STATE,
    reducers: {
        addPokemon: (state, action: PayloadAction<IPokemon[]>) => {
            action.payload.forEach((pokemon) => {
                state.pokemonByID[pokemon.id] = pokemon;
            });
        },
        updatePokemonInStore: (state, action: PayloadAction<IPokemon>) => {
            const updatedPokemon = action.payload;
            if (state.pokemonByID[updatedPokemon.id]) {
                state.pokemonByID[updatedPokemon.id] = updatedPokemon;
                console.log("Successfully updated Pokémon in store:", updatedPokemon);
            } else {
                console.error("Failed to update Pokémon. ID not found:", updatedPokemon.id);
            }
        },
        deletePokemon: (state, action: PayloadAction<{ pokemonID: string }>) => {
            const { pokemonID } = action.payload;
            delete state.pokemonByID[pokemonID];
        },
        setBreedStatus: (
            state,
            action: PayloadAction<{ pokemonID: string; status: BreedStatus }>
        ) => {
            const { pokemonID, status } = action.payload;
            const pokemon = state.pokemonByID[pokemonID];
            if (pokemon) {
                pokemon.breedStatus = status;
            } else {
                console.error("Failed to set breed status. Pokémon ID not found:", pokemonID);
            }
        },
    },
});

export const { addPokemon, updatePokemonInStore, deletePokemon, setBreedStatus } = pokemonSlice.actions;
export default pokemonSlice.reducer;
