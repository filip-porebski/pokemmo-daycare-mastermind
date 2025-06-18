# Guidelines for AI Contributors

This repository contains a React + TypeScript web app for managing Pokémon breeding in **PokeMMO**. It uses Redux for state management and Emotion for styling. The project is organized as follows:

## Key Directories

- **src/** – Application source code
  - **projects/** – Components and Redux slice for breeding projects
  - **pokemon/** – Pokémon forms, utilities and Redux slice
  - **layout/** – Shared UI layout components
  - **form/** – Reusable form controls
  - **state/** – Redux store setup and root reducers
  - **styles/** – Global styles and style utilities
  - **data/** – Pokedex data used across the app
- **public/** – Static assets served with the app
- **scripts/** – Custom build, start and test scripts
- **config/** – Webpack/Jest configuration files

## General Workflow

1. Install dependencies with `npm install` if needed.
2. Run **tests** with `npm test` before committing changes. Tests use Jest.
3. When adding features or fixing bugs, keep TypeScript types accurate and follow existing code style.
4. New components and utilities should live in the appropriate folder under `src/` as demonstrated by existing files.
5. For styling, prefer Emotion styled components found under `src/styles`.

These guidelines should help maintainers quickly understand the structure and expected workflow for this codebase.
