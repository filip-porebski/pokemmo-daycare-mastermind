/**
 * @copyright 2020 Adam (charrondev) Charron Changes 2024 onwards filip-porebski
 * @license Proprietary - All Rights Reserved
 */

import { pokemonSlice } from "@pokemmo/pokemon/pokemonSlice";
import { projectsSlice } from "@pokemmo/projects/projectsSlice";
import { combineReducers } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

export const rootReducer = combineReducers({
    projects: projectsSlice.reducer,
    pokemon: pokemonSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function useStateSelector<T>(selector: (state: RootState) => T): T {
    return useSelector(selector);
}
