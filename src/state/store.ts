/**
 * @copyright 2020 Adam (charrondev) Charron Changes 2024 onwards filip-porebski
 * @license Proprietary - All Rights Reserved
 */

import { rootReducer, RootState } from "@pokemmo/state/reducers";
import { configureStore, Store } from "@reduxjs/toolkit";
import { load, save } from "redux-localstorage-simple";

let storeCache: Store<RootState> | null = null;

export function getStore() {
    if (storeCache) {
        return storeCache;
    }
    const store = configureStore<RootState>({
        reducer: rootReducer,
        middleware: [save({ debounce: 500 })],
        preloadedState: load(),
    });

    // Enable Webpack hot module replacement for reducers
    module.hot?.accept("../reducers", () => {
        const nextRootReducer = require("./reducers");
        store.replaceReducer(nextRootReducer);
    });

    storeCache = store;

    return store;
}
