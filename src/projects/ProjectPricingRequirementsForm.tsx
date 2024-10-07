/**
 * @copyright 2020 Adam (charrondev)
 * @license GPL-3.0-only
 */

import { FormHeading } from "@pokemmo/form/FormHeading";
import { FormInput } from "@pokemmo/form/FormInput"; // Ensure this import is present
import { FormLabel } from "@pokemmo/form/FormLabel";
import { FormRow } from "@pokemmo/form/FormRow";
import { Gender, IVRequirements, Stat } from "@pokemmo/pokemon/PokemonTypes";
import { StatView } from "@pokemmo/projects/IVView";
import { useProjectActions } from "@pokemmo/projects/projectHooks";
import { IProject } from "@pokemmo/projects/projectsSlice";
import React from "react";

export function ProjectPricingRequirementsForm(props: { project: IProject }) {
    const { project } = props;
    const { projectID } = project;
    const { updateProject } = useProjectActions();

    const ivPricing = project.ivPricing;
    const onIVPricingChange = (ivPricing: IVRequirements) => {
        updateProject({ projectID, ivPricing });
    };

    // Calculate the average price dynamically based on male and female prices for each stat.
    const calculateAveragePrice = (): number => {
        const prices = Object.values(ivPricing)
            .map(data => [data.prices.male, data.prices.female])
            .flat()
            .filter(price => price != null) as number[];

        if (prices.length === 0) return 0;

        const totalPrice = prices.reduce((acc, price) => acc + price, 0);
        return Math.round(totalPrice / prices.length);
    };

    const averagePrice = calculateAveragePrice();

    return (
        <>
            <FormHeading
                title="Pricing Information"
                description="Add some pricing information from GTL in order to generate a more accurate price estimate."
            />
            <FormRow>
                <FormLabel
                    css={{ maxWidth: 400 }}
                    label="Average Price (across all stats)"
                >
                    <div
                        style={{
                            alignItems: "center",
                            backgroundColor: "rgb(238, 238, 238)", // Lighter gray background
                            borderBottom: "2px solid rgb(200, 200, 200)", // Softer gray border
                            borderLeft: "2px solid rgb(200, 200, 200)",
                            borderRight: "2px solid rgb(200, 200, 200)",
                            borderTop: "2px solid rgb(200, 200, 200)",
                            borderRadius: "6px",
                            boxSizing: "border-box",
                            color: "rgb(120, 120, 120)", // Slightly darker gray text
                            display: "inline-flex",
                            fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`,
                            height: "42.39px",
                            lineHeight: "18.4px",
                            minWidth: "200px",
                            padding: "9px 12px",
                            textAlign: "left",
                            transition: "all 0.2s ease",
                            width: "451.44px",
                        }}
                    >
                        ¥{averagePrice}
                    </div>
                </FormLabel>
            </FormRow>
            <FormRow itemStyles={{ flexGrow: 1 }}>
                <table
                    css={{
                        width: "100%",
                        "& td, & th": {
                            textAlign: "left",
                            padding: "6px 12px",
                        },
                        "& td:first-child, & th:first-child": {
                            fontWeight: "bold",
                            paddingLeft: 0,
                        },
                        "& td:last-child, & th:last-child": {
                            fontWeight: "bold",
                            paddingRight: 0,
                        },
                    }}
                >
                    <thead>
                        <tr>
                            <th>Stat</th>
                            <th>Male Price (Avg.)</th>
                            <th>Female Price (Avg.)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(ivPricing).map(([stat, data]) => {
                            if (data.value === 0 || data.value == null) {
                                return <React.Fragment key={stat} />;
                            }

                            return (
                                <tr key={stat}>
                                    <th>
                                        <StatView
                                            stat={stat as Stat}
                                            points={data.value}
                                        />
                                    </th>
                                    <td>
                                        <FormInput
                                            type="number"
                                            beforeNode="¥"
                                            value={
                                                data.prices.male ?? averagePrice
                                            }
                                            onChange={(malePricing: number) => {
                                                onIVPricingChange({
                                                    ...ivPricing,
                                                    [stat]: {
                                                        ...data,
                                                        prices: {
                                                            ...data.prices,
                                                            [Gender.MALE]: malePricing,
                                                        },
                                                    },
                                                });
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <FormInput
                                            type="number"
                                            beforeNode="¥"
                                            value={
                                                data.prices.female ??
                                                averagePrice
                                            }
                                            onChange={(femalePricing: number) => {
                                                onIVPricingChange({
                                                    ...ivPricing,
                                                    [stat]: {
                                                        ...data,
                                                        prices: {
                                                            ...data.prices,
                                                            [Gender.FEMALE]: femalePricing,
                                                        },
                                                    },
                                                });
                                            }}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </FormRow>
        </>
    );
}
