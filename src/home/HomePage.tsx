import { PageLayout } from "@pokemmo/layout/PageLayout";
import { DecoratedCard } from "@pokemmo/styles/Card";
import { ButtonType, FormButton } from "@pokemmo/form/FormButton";
import IconPokeball from "@pokemmo/icons/IconPokeball.svg";
import React from "react";
import { useHistory } from "react-router-dom";

export function HomePage() {
    const history = useHistory();
    return (
        <PageLayout
            content={
                <div
                    css={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        padding: "40px 0",
                    }}
                >
                    <IconPokeball css={{ height: 120, width: 120, marginBottom: 32 }} />
                    <DecoratedCard css={{ maxWidth: 600 }}>
                        <h2>Welcome to PokeMMO Daycare Mastermind</h2>
                        <p>Manage your breeding projects and Pokémon in one place.</p>
                        <div css={{ marginTop: 24 }}>
                            <FormButton
                                buttonType={ButtonType.PRIMARY}
                                onClick={() => history.push("/projects")}
                            >
                                View Projects
                            </FormButton>
                            <FormButton
                                css={{ marginLeft: 12 }}
                                buttonType={ButtonType.STANDARD}
                                onClick={() => history.push("/pokemon")}
                            >
                                View Pokémon
                            </FormButton>
                        </div>
                    </DecoratedCard>
                </div>
            }
        />
    );
}
