# My Mind — Claude Instructions

## Project Overview

A living infrastructure diagram app built with React, TypeScript, and Firebase. Users can visually map their projects, the services they depend on, and how everything connects. Uses React Flow (`@xyflow/react`) for the canvas.

## Tech Stack

- **Frontend:** React 19, TypeScript 6, Vite 8
- **Styling:** Tailwind CSS 4
- **Canvas:** @xyflow/react
- **Backend:** Firebase (Firestore, Auth)
- **Routing:** React Router v7

## Code Conventions

- All source files live under `src/`
- Node types are in `src/components/nodes/`
- Pages in `src/pages/`, shared components in `src/components/`
- Custom hooks in `src/hooks/`, contexts in `src/contexts/`

## Tooling

- Commits must follow **Conventional Commits** format (`feat:`, `fix:`, `chore:`, etc.) — enforced by commitlint
- `pre-commit` runs lint-staged (Prettier) on staged files
- `commit-msg` validates the commit message format

## Rules

- **Never commit or push without the user explicitly asking.** Always show what you've changed and wait for instruction before running any `git commit` or `git push` command.
