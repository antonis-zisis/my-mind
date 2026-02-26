# My Mind

A personal infrastructure map — a living diagram of your projects, the services they depend on, and how everything connects.

Built with React Flow, Firebase, and Vite.

## Features

- **Interactive diagram** — drag nodes, draw connections, pan and zoom freely
- **Two node types** — _Projects_ (things you build) and _Services/Tools_ (things you use)
- **Per-node metadata** — name, description, and URL
- **Edit nodes** — click any node to select it and edit its details in the sidebar
- **Auth** — sign in with Google; each user owns their own private diagram
- **Auto-save** — changes are debounced and persisted to Firestore automatically
- **Dark theme**

## Tech stack

| Layer           | Choice                                                |
| --------------- | ----------------------------------------------------- |
| UI framework    | React 19 + TypeScript                                 |
| Styling         | Tailwind CSS v4                                       |
| Diagram engine  | [React Flow](https://reactflow.dev) (`@xyflow/react`) |
| Auth + database | Firebase (Google Auth + Firestore)                    |
| Routing         | React Router v7                                       |
| Build tool      | Vite                                                  |
| Hosting         | Netlify                                               |

## Getting started

### 1. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a new project
2. Enable **Authentication → Google** sign-in provider
3. Create a **Firestore** database (start in production mode)
4. Register a **Web app** and copy the config values

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in `.env` with the values from your Firebase project:

```text
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

### 3. Deploy Firestore security rules

```bash
# Install Firebase CLI if you haven't already
npm install -g firebase-tools
firebase login

firebase deploy --only firestore:rules
```

The rules in `firestore.rules` ensure each user can only read and write their own diagram.

### 4. Install and run

```bash
npm install
npm run dev
```

## Usage

| Action        | How                                                                            |
| ------------- | ------------------------------------------------------------------------------ |
| Add a node    | Fill in the sidebar form and click _+ Add node_                                |
| Edit a node   | Click the node to select it — its details appear in the sidebar                |
| Move a node   | Drag it freely on the canvas                                                   |
| Connect nodes | Drag from the right-side handle of one node to the left-side handle of another |
| Delete a node | Select it and press `Delete` or `Backspace`                                    |
| Pan           | Drag the canvas background                                                     |
| Zoom          | Scroll wheel, or use the controls in the bottom-left                           |

Changes are saved automatically after a short delay. A _Saved_ indicator appears in the bottom of the canvas.

## Data model

Each signed-in user has a single Firestore document at `diagrams/{uid}` containing their nodes and edges as JSON arrays.

## License

MIT
