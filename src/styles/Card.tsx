/**
 * @copyright 2020 Adam (charrondev) Charron
// Changes 2024 onwards filip-porebski
 * @license GPL-3.0-only
 */

import { StyledFactory } from "@pokemmo/styles/styledUtils";
import {
    borderRadius,
    boxShadowCard,
    colorPrimary,
    colorSecondary,
    colorText,
    fontSizeSmall,
} from "@pokemmo/styles/variables";
import Color from "color";
import React from "react";

export const Card = StyledFactory(
    "div",
    {
        background: "#fff",
        color: colorText.string(),
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.06)",
        padding: 24,
        borderRadius: 12,
        transition: "all 0.3s ease",
        border: "1px solid transparent",
    },
    "Card",
);

export function DecoratedCard(
    _props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> & {
        decorationColor?: Color;
        hoverable?: boolean;
        itemCount?: number;
    },
) {
    const {
        decorationColor = colorSecondary,
        hoverable,
        itemCount,
        ...props
    } = _props;
    return (
        <Card
            {...props}
            css={[
                {
                    position: "relative",
                    paddingLeft: 24 + 6,
                    "&::before": {
                        content: "''",
                        display: "block",
                        position: "absolute",
                        top: -1,
                        left: -1,
                        bottom: -1,
                        width: 6,
                        background: `linear-gradient(to bottom, ${decorationColor.string()}, ${decorationColor.lighten(0.2).string()})`,
                        borderTopLeftRadius: 12,
                        borderBottomLeftRadius: 12,
                    },
                },
                hoverable && {
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    background: "linear-gradient(135deg, #f9faff 0%, #f8f9fd 100%)",
                    border: "1px solid rgba(222, 224, 230, 0.5)",
                    "&:hover, &:focus, &:active": {
                        boxShadow: "0 8px 30px 0 rgba(0, 0, 0, 0.08)",
                        borderColor: `rgba(74, 79, 115, 0.15)`,
                        background: "linear-gradient(135deg, #f9faff 0%, #f2f4fa 100%)",
                    },
                },
            ]}
        >
            {props.children}
            {itemCount != null && (
                <span
                    css={{
                        background: colorPrimary.toString(),
                        color: "#fff",
                        fontWeight: "bold",
                        borderRadius: 27,
                        height: 27,
                        width: 27,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute",
                        top: 0,
                        right: 0,
                        transform: "translate(40%, -40%)",
                        fontSize: fontSizeSmall,
                    }}
                >
                    {itemCount}
                </span>
            )}
        </Card>
    );
}
