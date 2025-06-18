/**
 * @copyright 2020 Adam (charrondev) Charron
// Changes 2024 onwards filip-porebski
 * @license GPL-3.0-only
 */

import { css, Global } from "@emotion/core";
import {
    colorBG,
    colorPrimary,
    colorText,
    fontSizeLarge,
    fontSizeTitle,
    fontSizeTitleLarge,
} from "@pokemmo/styles/variables";
import "@reach/dialog/styles.css";
import "@reach/menu-button/styles.css";
import emotionNormalize from "emotion-normalize";
import "focus-visible";
import React from "react";

export function CssReset() {
    return (
        <Global
            styles={css`
                ${emotionNormalize}
                html, body, #root {
                    height: 100%;
                }

                body {
                    background: ${colorBG.string()};
                    color: ${colorText.string()};
                    box-sizing: border-box;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    line-height: 1.6;
                }
                *,
                *:before,
                *:after {
                    box-sizing: inherit;
                }

                li,
                ul,
                ol {
                    padding: 0;
                    margin: 0;
                    list-style: none;
                }

                /*
                 * This will hide the focus indicator if the element receives focus via the mouse,
                 * but it will still show up on keyboard focus.
                 */
                .js-focus-visible * {
                    outline: none;
                }

                .focus-visible {
                    box-shadow: 0 0 0 3px ${colorPrimary.lighten(0.7).string()};
                }

                a {
                    color: ${colorPrimary.toString()};
                    text-decoration: none;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }

                a:hover,
                a.focus-visible,
                a:active {
                    text-decoration: underline;
                    box-shadow: none;
                    color: ${colorPrimary.darken(0.2).toString()};
                }

                h1,
                h2,
                h3,
                h4,
                h5,
                h6 {
                    display: block;
                    line-height: 1.25;
                    font-weight: 700;
                    margin-top: 0;
                    margin-bottom: 16px;
                    letter-spacing: -0.5px;
                }

                p {
                    margin-bottom: 16px;
                    line-height: 1.7;
                }
                
                button, input, select, textarea {
                    font-family: inherit;
                }
                
                img {
                    max-width: 100%;
                    height: auto;
                }

                h1 {
                    font-size: ${fontSizeTitleLarge};
                }

                h2 {
                    font-size: ${fontSizeTitle};
                }

                h3 {
                    font-size: ${fontSizeLarge};
                }
            `}
        />
    );
}
