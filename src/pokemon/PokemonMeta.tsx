/**
 * @copyright 2020 Adam (charrondev) Charron
// Changes 2024 onwards filip-porebski
 * @license GPL-3.0-only
 */

import { LabelAndValue } from "@pokemmo/form/LabelAndValue";
import { Gender, IVRequirements } from "@pokemmo/pokemon/PokemonTypes";
import { GenderView } from "@pokemmo/projects/GenderView";
import { IVView } from "@pokemmo/projects/IVView";
import { NatureView } from "@pokemmo/projects/NatureView";
import React from "react";

interface IProps {
    identifier?: string;
    nature?: string | null;
    gender?: Gender;
    ivs?: IVRequirements;
    vertical?: boolean;
}

export function PokemonMeta(props: IProps) {
    let hasStats = false;
    if (props.ivs) {
        Object.values(props.ivs).forEach(stat => {
            if (stat?.value !== 0) {
                hasStats = true;
            }
        });
    }
    return (
        <>
            {props.gender && (
                <LabelAndValue vertical={props.vertical} label="Gender">
                    <GenderView gender={props.gender} />
                </LabelAndValue>
            )}
            {hasStats && props.ivs && (
                <LabelAndValue vertical={props.vertical} label="Stats">
                    <IVView ivRequirements={props.ivs} />
                </LabelAndValue>
            )}
            {props.nature && (
                <LabelAndValue vertical={props.vertical} label="Nature">
                    <NatureView nature={props.nature} />
                </LabelAndValue>
            )}
        </>
    );
}
