/**
 * @copyright 2020 Adam (charrondev) Charron Changes 2024 onwards filip-porebski
 * @license Proprietary - All Rights Reserved
 */

import {
    allEggGroups,
    stringToOption,
    useOwnEggGroups,
} from "@pokemmo/data/pokedex";
import {
    FormSelectField,
    FormSelectFieldProps,
    SpecializedSelect,
} from "@pokemmo/form/FormSelect";
import React from "react";

export interface EggGroupOption {
    label: string;
    value: string;
}

interface IProps
    extends SpecializedSelect<FormSelectFieldProps<EggGroupOption>> {
    onlyOwned?: boolean;
    fieldName: string;
}

export function EggGroupSelect(_props: IProps) {
    const { onlyOwned, ...props } = _props;
    const ownEggGroups = useOwnEggGroups();
    return (
        <FormSelectField<EggGroupOption>
            isClearable
            {...props}
            options={
                onlyOwned
                    ? ownEggGroups.map(stringToOption)
                    : allEggGroups.map(stringToOption)
            }
            makeOptionFromValue={value => {
                return value ? stringToOption(value) : null;
            }}
        />
    );
}
