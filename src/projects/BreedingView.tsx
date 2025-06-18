/**
 * @copyright 2020 Adam (charrondev) Charron
// Changes 2024 onwards filip-porebski
 * @license GPL-3.0-only
 */

import { Breadcrumbs } from "@pokemmo/layout/Breadcrumbs";
import { BreedingGuide } from "@pokemmo/projects/BreedingGuide";
import { BreedingShoppingList } from "@pokemmo/projects/BreedingShoppingList";
import { BreedingHeldItemList } from "@pokemmo/projects/BreedingHeldItemList";
import { useProject, useProjectPokemon } from "@pokemmo/projects/projectHooks";
import React from "react";
import { useParams } from "react-router-dom";

interface IProps {}

export function BreedingView(props: IProps) {
    const { projectID } = useParams<{ projectID: string }>();
    const project = useProject(projectID);
    const projectPokemon = useProjectPokemon(projectID);
    if (!project || !projectPokemon) {
        return <>Not Found</>;
    }

    return (
        <div>
            <Breadcrumbs
                crumbs={[
                    {
                        name: "Projects",
                        href: "/projects",
                    },
                    {
                        name: project.projectName,
                        href: `/projects/${project.projectID}`,
                    },
                    {
                        name: "Breeding View",
                        href: `/projects/${project.projectID}/breeding`,
                    },
                ]}
            />
            <BreedingShoppingList project={project} />
            <BreedingHeldItemList projectID={project.projectID} />
            <BreedingGuide projectID={project.projectID} />
        </div>
    );
}
