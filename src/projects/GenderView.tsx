/**
 * GenderView component for displaying gender with colored labels
 */

import styled from "@emotion/styled";
import IconFemale from "@pokemmo/icons/IconFemale.svg";
import IconMale from "@pokemmo/icons/IconMale.svg";
import { Gender } from "@pokemmo/pokemon/PokemonTypes";
import { uppercaseFirst } from "@pokemmo/utils";
import Color from "color";
import React from "react";

interface IProps {
  gender: Gender;
  iconOnly?: boolean;
}

const GenderLozenge = styled.span`
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  line-height: 1;
`;

const GenderName = styled.strong`
  color: white;
  font-weight: bold;
  margin-right: 4px;
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 12px;
  width: 12px;
`;

const IconOnlyWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  vertical-align: middle;
  margin-left: 4px;
  position: relative;
  top: -1px;
`;

export const colorForGender = (gender: Gender): Color => {
  switch (gender) {
    case Gender.MALE:
      return Color("#4a90e2"); // Sky blue for male
    case Gender.FEMALE:
      return Color("#e84f8a"); // Pink for female
    default:
      return Color("#95a5a6"); // Gray for undefined/other
  }
};

export function GenderView({ gender, iconOnly = false }: IProps) {
  const genderColor = colorForGender(gender);
  
  if (iconOnly) {
    return (
      <IconOnlyWrapper style={{ backgroundColor: genderColor.toString() }}>
        {gender === Gender.MALE ? (
          <IconMale width={12} height={12} />
        ) : (
          <IconFemale width={12} height={12} />
        )}
      </IconOnlyWrapper>
    );
  }
  
  return (
    <GenderLozenge style={{ backgroundColor: genderColor.toString() }}>
      <GenderName>{uppercaseFirst(gender)}</GenderName>
      <IconWrapper>
        {gender === Gender.MALE ? (
          <IconMale width={12} height={12} />
        ) : (
          <IconFemale width={12} height={12} />
        )}
      </IconWrapper>
    </GenderLozenge>
  );
}