# My Mind

[![Netlify Status](https://api.netlify.com/api/v1/badges/e688c661-6513-4a02-94c7-be1ace10646d/deploy-status)](https://app.netlify.com/projects/az-my-mind/deploys)

A personal infrastructure map. A living diagram of your projects, the services they depend on, and how everything connects.

Built with React Flow, Firebase, and Vite.

Self-hostable: bring your own Firebase project and deploy anywhere that serves a static site.

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

## Self-hosting

The app stores all data in **your own Firebase project** — nothing is shared with anyone else.

Each Google-authenticated user gets their own private diagram document in Firestore.

### 1. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a new project
2. Enable **Authentication → Sign-in method → Google**
3. Add your deployment domain (e.g. `yourapp.netlify.app`) to **Authentication → Settings → Authorized domains**
4. Create a **Firestore** database (start in production mode)
5. Register a **Web app** under **Project settings** and copy the config snippet

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

> **Never commit `.env`** — it is gitignored by default.

### 3. Deploy Firestore security rules

The rules in `firestore.rules` ensure each user can only read and write their own diagram. Deploy them with the Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
firebase use --add   # select your project
firebase deploy --only firestore:rules
```

> The repo ships with a `.firebaserc` pointing to the original author's project. Running `firebase use --add` replaces this with your own.

### 4. Install and run locally

```bash
npm install
npm run dev
```

### 5. Deploy

The app is a standard static build (`npm run build` → `dist/`). Deploy it to any static host:

| Platform                   | Notes                                                                                                                                                             |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Netlify**                | `netlify.toml` is included. Connect your repo, it will pick up the build settings automatically. Set env vars under _Site configuration → Environment variables_. |
| **Vercel**                 | Import the repo and set the same env vars in the Vercel dashboard. No extra config needed.                                                                        |
| **Firebase Hosting**       | Run `firebase init hosting` and `firebase deploy --only hosting`.                                                                                                 |
| **GitHub Pages / any CDN** | Run `npm run build` and serve the `dist/` folder. Make sure 404s redirect to `index.html` for client-side routing to work.                                        |

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

## Development

```bash
npm run dev        # start dev server
npm run build      # type-check + production build
npm run typecheck  # type-check only
npm run lint       # ESLint
npm run format     # Prettier
```

## License

MIT
