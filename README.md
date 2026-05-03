# Formula Student Risk Predictor — Frontend

Vue.js 3 single-page application that consumes the FastAPI backend.

## Requirements

- Node.js 20 or higher
- npm

## Setup

```bash
npm install
```

## Configuration

Create a `.env.local` file in this folder if you want to point at
a non-default backend URL:
VITE_API_URL=http://127.0.0.1:3333

If no `.env.local` is present, the app defaults to
`http://127.0.0.1:3333`.

## Run

```bash
npm run dev
```

The app will be available at `http://127.0.0.1:5173`.

## Build for Production

```bash
npm run build
```

Output goes to the `dist/` folder.

## Project Layout
src/
main.js                  - Vue app entry
App.vue                  - Root component (router outlet)
router/
index.js               - Vue Router configuration
services/
api.js                 - Axios client + auth header injection
components/
TopNav.vue             - Persistent navigation bar
ComponentForm.vue      - Reusable telemetry input form
RiskCard.vue           - Risk score bar with colour coding
views/
Home.vue               - Landing page
Login.vue              - Login form
Register.vue           - Registration form
Dashboard.vue          - Main prediction interface
History.vue            - Saved prediction history
Profile.vue            - Team profile view/edit
NotFound.vue           - 404 page
assets/
main.css               - Global styles

## Routing

| Path        | View       | Auth   |
|-------------|------------|--------|
| /           | Home       | No     |
| /login      | Login      | No     |
| /register   | Register   | No     |
| /dashboard  | Dashboard  | Yes    |
| /history    | History    | Yes    |
| /profile    | Profile    | Yes    |

The Axios client in `services/api.js` automatically attaches the
session token from `localStorage` to every request as the
`X-Authorization` header.

## Deployment

Deployed on Netlify at:
https://coruscating-narwhal-93dc71.netlify.app/

Netlify configuration:
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_URL` set to the Render backend URL
