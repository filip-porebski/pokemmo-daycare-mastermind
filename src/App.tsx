/**
 * @copyright 2020 Adam (charrondev) Charron
// Changes 2024 onwards filip-porebski
 * @license GPL-3.0-only
 */

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/core";
import { HelpPage } from "@pokemmo/help/HelpPage";
import { HomePage } from "@pokemmo/home/HomePage";
import { ScrollToTop } from "@pokemmo/layout/ScrollToTop";
import { PokemonPage } from "@pokemmo/pokemon/PokemonPage";
import { ProjectPage } from "@pokemmo/projects/ProjectPage";
import { getStore } from "@pokemmo/state/store";
import { CssReset } from "@pokemmo/styles/CssReset";
import { FontLoader } from "@pokemmo/styles/FontLoader";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

const emotionCache = createCache();
emotionCache.compat = true;

console.log("Hello");

function App() {
    return (
        <>
            <CacheProvider value={emotionCache}>
                <CssReset />
                <FontLoader />
                <Provider store={getStore()}>
                    <BrowserRouter>
                        <ScrollToTop />
                        <Switch>
                            <Route exact path="/" component={HomePage} />
                            <Route path={"/projects"} component={ProjectPage} />
                            <Route path="/pokemon" component={PokemonPage} />
                            <Route path="/help" component={HelpPage} />
                        </Switch>
                    </BrowserRouter>
                </Provider>
            </CacheProvider>
        </>
    );
}

export default App;
