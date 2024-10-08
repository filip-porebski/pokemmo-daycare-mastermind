/**
 * @copyright 2020 Adam (charrondev) Charron Changes 2024 onwards filip-porebski
 * @license Proprietary - All Rights Reserved
 */

import styled from "@emotion/styled";
import { getPokemon, makeSpriteUrl } from "@pokemmo/data/pokedex";
import { uppercaseFirst } from "@pokemmo/utils";
import React, { useMemo } from "react";

const TitleCell = styled.span`
    display: flex;
    align-items: center;
`;

export function PokemonName(props: { name?: string; withSprite?: boolean }) {
    const { name } = props;

    const pokemon = useMemo(() => {
        return name ? getPokemon(name)! : null;
    }, [name]);

    if (!pokemon) {
        return <TitleCell>(Pokemon Not Found)</TitleCell>;
    }

    return (
        <TitleCell>
            {props.withSprite && (
                <img
                    src={makeSpriteUrl(pokemon)}
                    height={24}
                    width={24}
                    alt={""}
                />
            )}
            {uppercaseFirst(pokemon.displayName)}
        </TitleCell>
    );
}
