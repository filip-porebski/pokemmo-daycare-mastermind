/**
 * @copyright 2020 Adam (charrondev) Charron
// Changes 2024 onwards filip-porebski
 * @license GPL-3.0-only
 */

import { ObjectInterpolation } from "@emotion/core";
import Color from "color";
export type CssType = ObjectInterpolation<any>;

// Colors
export const colorBG = Color("#F5F7FA");
export const colorPrimary = Color("#4A4F73");
export const colorPrimaryState = colorPrimary.lighten(0.6);
export const colorSecondary = Color("#B07B7B");
export const colorSecondaryState = colorSecondary.darken(0.18);
export const colorInput = Color("#FAFBFC");
export const colorInputState = colorInput.darken(0.02);
export const colorBorder = Color("#DEE0E6");
export const colorText = colorPrimary;
export const colorSuccess = Color("#4CAF50");
export const colorWarning = Color("#FF9800");
export const colorError = Color("#F44336");
export const colorInfo = Color("#2196F3");

// Gradients
export const gradientPrimary = `linear-gradient(90deg, ${colorPrimary.string()} 0%, ${colorPrimary.lighten(0.2).string()} 100%)`;
export const gradientSecondary = `linear-gradient(90deg, ${colorSecondary.string()} 0%, ${colorSecondary.lighten(0.2).string()} 100%)`;
export const gradientAccent = `linear-gradient(90deg, ${colorPrimary.string()} 0%, ${colorSecondary.string()} 100%)`;

// fonts
export const fontSizeSmall = 12;
export const fontSizeNormal = 14;
export const fontSizeLarge = 16;
export const fontSizeTitleSmall = 18;
export const fontSizeTitle = 24;
export const fontSizeTitleLarge = 36;

// Dimensions
export const containerSize = 1450;

// Other
export const borderRadius = 12;
export const boxShadowCard = "0 8px 30px rgba(0, 0, 0, 0.06)";
export const boxShadowHover = "0 15px 40px rgba(0, 0, 0, 0.12)";
export const transitionSpeed = "0.3s ease";

export const mixinBorder = (color = colorBorder): CssType => ({
    borderColor: color.string(),
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius,
});

export const makeSingleBorder = (width: number) =>
    `${width}px solid ${colorBorder.string()}`;

export const mixinAbsoluteFull = (): CssType => {
    return {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    };
};

export const mixinSrOnly = (): CssType => ({
    border: "0px !important",
    clip: "rect(0, 0, 0, 0) !important",
    display: "block !important",
    height: "1px !important",
    margin: "-1px !important",
    overflow: "hidden !important",
    padding: "0px !important",
    position: "absolute !important" as any,
    width: "1px !important",
});

export const mixinExtendContainer = (by: number): CssType => ({
    width: `calc(100% + ${by * 2}px)`,
    marginLeft: -by,
});
