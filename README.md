# ArchAI - React / Express / StableDiffusion - AI Image generation for architects:
A Web App built with React as a Frontend and Express as a Backend. It uses [StableDiffusionXL](https://replicate.com/stability-ai/sdxl) and [ControlNet](https://replicate.com/collections/control-net) for Image generation and modification. Data stores: MongoDB, Cloudinary (aswell as an on-server uploads folder*).


## Frontend: [ArchAI React Frontend](https://github.com/ivaaak/ArchAI/tree/main/frontend)
## Backend: [ArchAI Express Backend](https://github.com/ivaaak/ArchAI/tree/main/backend)

**Screenshots:**
<img src="https://raw.githubusercontent.com/ivaaak/ArchAI/main/frontend/public/screenshots/1.png"></img>
<img src="https://raw.githubusercontent.com/ivaaak/ArchAI/main/frontend/public/screenshots/2.png"></img>
<img src="https://raw.githubusercontent.com/ivaaak/ArchAI/main/frontend/public/screenshots/3.png"></img>
<img src="https://raw.githubusercontent.com/ivaaak/ArchAI/main/frontend/public/screenshots/4.png"></img>

### Getting Started:
Copy `backend/.env.example` to `backend/.env` and fill in at least:
```cmd
ATLAS_URI= (mongoDB connection string)
REPLICATE_API_TOKEN= (StableDiffusion / Replicate API Key)
```
Optional keys:
- `CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` - store images in Cloudinary (otherwise they are saved in `backend/src/uploads`)
- `STRIPE_SECRET_KEY` and `STRIPE_PRICE_FREELANCE` / `_BUSINESS` / `_ENTERPRISE` - enable checkout on the pricing page
- `PORT` (default 3000), `FRONTEND_URL` (default http://localhost:5173)

The frontend works without configuration: the Vite dev server proxies `/api` and `/uploads` to the backend.
Set `VITE_API_PROXY_TARGET` if the backend is not on http://localhost:3000, `VITE_API_URL` for production builds
where the API is on another host, and `VITE_AUTH0_DOMAIN` / `VITE_AUTH0_CLIENT_ID` to use your own Auth0 application.

You can run the below commands from the ArchAI directory and start the project:
```cmd
npm i
npm start
```
This installs and starts both the FE and BE using the npm tool 'concurrently'. Or you can run the commands separately in the frontend / backend folders to have them running in separate instances/terminals.

`npm test` type-checks and lints both projects.

### Built With:
-  [**✔**]  `React (Vite, Typescript)`
-  [**✔**]  `Express API`
- [**✔**]  `StableDiffusion`
-  [**✔**]  `ControlNet`
-  [**✔**]  `Auth0`
-  [**✔**]  `Axios`
-  [**✔**]  `Cloudinary`
-  [**✔**]  `MongoDB`
-  [**✔**]  `Stripe`

### Features / `Image generation modes`:
- `Text to Image` - prompt + drawing type, style, perspective, projection and color parameters, 1-4 images in 5 formats
- `Image to Image` - restyle an uploaded image with adjustable transformation strength and a before/after slider
- `Sketch (canvas drawing) to Image` - ControlNet scribble; pen/eraser, undo/redo and tracing over a reference image
- `Image In-Painting` - paint a mask over part of an image and regenerate only that area
- Collections - every generation is saved with its prompt and parameters; search, filter by mode, download, share, delete
- Image details - parameters, remix prompt, refine / edit region, compare with the source image
- Quick generate from anywhere (`Ctrl+K`), saved prompts, custom style keywords and default preferences
- Auth0 Auth and User Management, Stripe checkout, dark / light theme

#### Not implemented yet / In Progress:
- Support for `Midjourney` and a switch between it and StableDiffusion
- `Custom trained LLMs` for specific image modes - photorealistic / pencil sketch / 3d render
- `LLM Fine-Tuning`
- `3D Models` - generation and CAD integration
- `Discover` - Analytics and Feedback to provide users with analytics on their sketching habits and performance.
