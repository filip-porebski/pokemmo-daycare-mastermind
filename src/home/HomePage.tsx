import { PageLayout } from "@pokemmo/layout/PageLayout";
import { DecoratedCard } from "@pokemmo/styles/Card";
import { ButtonType, FormButton } from "@pokemmo/form/FormButton";
import IconPokeball from "@pokemmo/icons/IconPokeball.svg";
import IconProjects from "@pokemmo/icons/IconProjects.svg";
import IconPokedex from "@pokemmo/icons/IconPokedex.svg";
import IconQuestion from "@pokemmo/icons/IconQuestion.svg";
import IconFeatureBreeding from "@pokemmo/icons/IconFeatureBreeding.svg";
import IconFeatureCost from "@pokemmo/icons/IconFeatureCost.svg";
import IconFeatureIV from "@pokemmo/icons/IconFeatureIV.svg";
import IconFeatureTracking from "@pokemmo/icons/IconFeatureTracking.svg";
import { Footer } from "@pokemmo/layout/Footer";
import React from "react";
import { useHistory } from "react-router-dom";
import { useAllProjects } from "@pokemmo/projects/projectHooks";
import { useAllPokemon } from "@pokemmo/pokemon/pokemonHooks";
import { colorPrimary, colorSecondary, fontSizeTitle, fontSizeTitleSmall } from "@pokemmo/styles/variables";
import "./HomePage.scss";

export function HomePage() {
    const history = useHistory();
    const projects = useAllProjects();
    const pokemon = useAllPokemon();
    
    const projectCount = Object.keys(projects).length;
    const pokemonCount = Object.keys(pokemon).length;
    
    return (
        <PageLayout
            content={
                <div css={{ padding: "40px 20px", maxWidth: 1200, margin: "0 auto" }}>
                    {/* Hero Section */}
                    <div className="home-hero">
                        <div css={{ 
                            display: "flex", 
                            flexDirection: "column", 
                            alignItems: "center", 
                            textAlign: "center" 
                        }}>
                            <div css={{ 
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "linear-gradient(135deg, rgba(74, 79, 115, 0.1) 0%, rgba(176, 123, 123, 0.1) 100%)",
                                borderRadius: "50%",
                                padding: 20,
                                marginBottom: 24
                            }}>
                                <IconPokeball css={{ height: 100, width: 100 }} />
                            </div>
                            
                            <h1 css={{ 
                                fontSize: 32, 
                                fontWeight: 800,
                                marginBottom: 16, 
                                background: "linear-gradient(90deg, #4A4F73 0%, #B07B7B 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                letterSpacing: "-0.5px"
                            }}>
                                PokeMMO Daycare Mastermind
                            </h1>
                            
                            <p css={{ 
                                fontSize: 18, 
                                marginBottom: 32, 
                                maxWidth: 700, 
                                lineHeight: 1.7,
                                color: "#4A4F73",
                                opacity: 0.9
                            }}>
                                The ultimate breeding companion for PokeMMO players. Plan your breeding projects, 
                                optimize IV inheritance, calculate costs, and manage your Pokémon collection with ease.
                            </p>
                            
                            <div className="button-group">
                                <FormButton
                                    buttonType={ButtonType.PRIMARY}
                                    onClick={() => history.push("/projects")}
                                    css={{ 
                                        minWidth: 160,
                                        padding: "12px 24px",
                                        fontSize: 16,
                                        fontWeight: 600,
                                        borderRadius: 8
                                    }}
                                >
                                    View Projects
                                </FormButton>
                                <FormButton
                                    buttonType={ButtonType.STANDARD}
                                    onClick={() => history.push("/pokemon")}
                                    css={{ 
                                        minWidth: 160,
                                        padding: "12px 24px",
                                        fontSize: 16,
                                        fontWeight: 600,
                                        borderRadius: 8
                                    }}
                                >
                                    Manage Pokémon
                                </FormButton>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="home-section">
                        <div css={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: 24
                        }}>
                            <DecoratedCard 
                                className="stats-card"
                                decorationColor={colorPrimary}
                                hoverable
                                onClick={() => history.push("/projects")}
                                css={{ cursor: "pointer" }}
                            >
                                <div css={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    marginBottom: 20,
                                    gap: 12
                                }}>
                                    <div css={{
                                        background: "linear-gradient(135deg, rgba(74, 79, 115, 0.1) 0%, rgba(74, 79, 115, 0.15) 100%)",
                                        borderRadius: 12,
                                        width: 52,
                                        height: 52,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        transition: "all 0.3s ease"
                                    }}>
                                        <IconProjects css={{ 
                                            height: 28, 
                                            width: 28, 
                                            color: colorPrimary.string(),
                                            transition: "all 0.3s ease"
                                        }} />
                                    </div>
                                    <h3 css={{ fontSize: 20, margin: 0, fontWeight: 700 }}>Breeding Projects</h3>
                                </div>
                                <div className="stats-value">
                                    {projectCount}
                                </div>
                                <p css={{ margin: 0, lineHeight: 1.6, color: "#4A4F73", opacity: 0.8 }}>
                                    {projectCount === 0 
                                        ? "Start your first breeding project to optimize IV inheritance and track progress."
                                        : "Active breeding projects with detailed planning and cost calculations."
                                    }
                                </p>
                            </DecoratedCard>

                            <DecoratedCard 
                                className="stats-card"
                                decorationColor={colorSecondary}
                                hoverable
                                onClick={() => history.push("/pokemon")}
                                css={{ cursor: "pointer" }}
                            >
                                <div css={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    marginBottom: 20,
                                    gap: 12
                                }}>
                                    <div css={{
                                        background: "linear-gradient(135deg, rgba(176, 123, 123, 0.1) 0%, rgba(176, 123, 123, 0.15) 100%)",
                                        borderRadius: 12,
                                        width: 52,
                                        height: 52,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        transition: "all 0.3s ease"
                                    }}>
                                        <IconPokedex css={{ 
                                            height: 28, 
                                            width: 28, 
                                            color: colorSecondary.string(),
                                            transition: "all 0.3s ease"
                                        }} />
                                    </div>
                                    <h3 css={{ fontSize: 20, margin: 0, fontWeight: 700 }}>Pokémon Collection</h3>
                                </div>
                                <div className="stats-value">
                                    {pokemonCount}
                                </div>
                                <p css={{ margin: 0, lineHeight: 1.6, color: "#4A4F73", opacity: 0.8 }}>
                                    {pokemonCount === 0 
                                        ? "Add your Pokémon with IVs, natures, and breeding status to get started."
                                        : "Pokémon in your collection with detailed IV tracking and breeding information."
                                    }
                                </p>
                            </DecoratedCard>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="home-section">
                        <h2 className="home-section-title" css={{ fontSize: 24, color: colorPrimary.string() }}>
                            Key Features
                        </h2>
                        <div css={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: 24
                        }}>
                            <DecoratedCard className="feature-card">
                                <div className="feature-icon">
                                    <IconFeatureBreeding css={{ width: 28, height: 28, color: colorPrimary.string() }} />
                                </div>
                                <h4 css={{ fontSize: 18, marginTop: 0, marginBottom: 12, fontWeight: 600 }}>
                                    Breeding Optimization
                                </h4>
                                <p css={{ margin: 0, lineHeight: 1.6, color: "#4A4F73", opacity: 0.8 }}>
                                    Plan optimal breeding paths with IV inheritance tracking, nature planning, 
                                    and automatic parent suggestions for your target Pokémon.
                                </p>
                            </DecoratedCard>

                            <DecoratedCard className="feature-card">
                                <div className="feature-icon">
                                    <IconFeatureCost css={{ width: 28, height: 28, color: colorPrimary.string() }} />
                                </div>
                                <h4 css={{ fontSize: 18, marginTop: 0, marginBottom: 12, fontWeight: 600 }}>
                                    Cost Calculator
                                </h4>
                                <p css={{ margin: 0, lineHeight: 1.6, color: "#4A4F73", opacity: 0.8 }}>
                                    Calculate daycare costs, breeding expenses, and item requirements 
                                    to budget your breeding projects effectively.
                                </p>
                            </DecoratedCard>

                            <DecoratedCard className="feature-card">
                                <div className="feature-icon">
                                    <IconFeatureIV css={{ width: 28, height: 28, color: colorPrimary.string() }} />
                                </div>
                                <h4 css={{ fontSize: 18, marginTop: 0, marginBottom: 12, fontWeight: 600 }}>
                                    IV Management
                                </h4>
                                <p css={{ margin: 0, lineHeight: 1.6, color: "#4A4F73", opacity: 0.8 }}>
                                    Track Individual Values (IVs) for all your Pokémon with visual indicators 
                                    and filtering to find the perfect breeding candidates.
                                </p>
                            </DecoratedCard>

                            <DecoratedCard className="feature-card">
                                <div className="feature-icon">
                                    <IconFeatureTracking css={{ width: 28, height: 28, color: colorPrimary.string() }} />
                                </div>
                                <h4 css={{ fontSize: 18, marginTop: 0, marginBottom: 12, fontWeight: 600 }}>
                                    Project Tracking
                                </h4>
                                <p css={{ margin: 0, lineHeight: 1.6, color: "#4A4F73", opacity: 0.8 }}>
                                    Organize multiple breeding projects with progress tracking, 
                                    shopping lists, and breeding guides for each target Pokémon.
                                </p>
                            </DecoratedCard>
                        </div>
                    </div>

                    {/* Getting Started Section */}
                    <DecoratedCard 
                        className="getting-started-card" 
                        css={{ 
                            textAlign: "center", 
                            padding: "40px 30px",
                            borderRadius: 12
                        }}
                    >
                        <div css={{ 
                            display: "inline-flex", 
                            alignItems: "center", 
                            justifyContent: "center", 
                            marginBottom: 20,
                            background: "linear-gradient(135deg, rgba(74, 79, 115, 0.08) 0%, rgba(176, 123, 123, 0.08) 100%)",
                            borderRadius: "50%",
                            width: 64,
                            height: 64
                        }}>
                            <IconQuestion css={{ 
                                height: 32, 
                                width: 32,
                                color: "#4A4F73" 
                            }} />
                        </div>
                        <h3 css={{ fontSize: 22, margin: "0 0 16px", fontWeight: 700 }}>
                            Getting Started
                        </h3>
                        <p css={{ 
                            marginBottom: 30, 
                            lineHeight: 1.7, 
                            maxWidth: 700, 
                            margin: "0 auto 30px",
                            color: "#4A4F73",
                            opacity: 0.9
                        }}>
                            New to breeding optimization? Start by adding your Pokémon collection, 
                            then create your first breeding project to see the power of automated planning.
                        </p>
                        <div className="button-group">
                            <FormButton
                                buttonType={ButtonType.PRIMARY}
                                onClick={() => history.push("/pokemon")}
                                css={{ 
                                    minWidth: 140,
                                    padding: "10px 20px",
                                    fontSize: 15,
                                    fontWeight: 600,
                                    borderRadius: 8
                                }}
                            >
                                Add Pokémon
                            </FormButton>
                            <FormButton
                                buttonType={ButtonType.STANDARD}
                                onClick={() => history.push("/help")}
                                css={{ 
                                    minWidth: 140,
                                    padding: "10px 20px",
                                    fontSize: 15,
                                    fontWeight: 600,
                                    borderRadius: 8
                                }}
                            >
                                Get Help
                            </FormButton>
                        </div>
                    </DecoratedCard>
                    
                    {/* Footer */}
                    <Footer />
                </div>
            }
        />
    );
}
