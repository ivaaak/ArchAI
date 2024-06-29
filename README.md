# ArchAI - React / Express / StableDiffusion - AI Image generation for architects:
A Web App built with React as a Frontend and Express as a Backend. It uses [StableDiffusionXL](https://replicate.com/stability-ai/sdxl) and [ControlNet](https://replicate.com/collections/control-net) for Image generation and modification. Data stores: MongoDB, Cloudinary (aswell as an on-server uploads folder*).


## Frontend: [ArchAI React Frontend](https://github.com/ivaaak/ArchAI/tree/main/frontend)
## Backend: [ArchAI Express Backend](https://github.com/ivaaak/ArchAI/tree/main/backend)

### Getting Started:
You need the following API keys to add to a .env file in the `backend` folder:
```cmd
ATLAS_URI= (mongoDB connection string)
REPLICATE_API_TOKEN= (StableDiffusion / Replicate API Key)
CLOUD_NAME= (cloudinary name / api key / secret)
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

You can run the below commands from the ArchAI directory and start the project:
```cmd
npm i
npm start
```
This installs and starts both the FE and BE using the npm tool 'concurrently'. Or you can run the commands separately in the frontend / backend folders to have them running in separate instances/terminals.

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
- `Text to Image`
- `Image to Image`
- `Sketch (canvas drawing) to Image`
- `Image Infill`
- Auth0 Auth and User Management
- Collections
- Sharing Prompts / Images generated
- 

#### Not implemented yet / In Progress:
- `Image In-Painting / Infill` (only re-generate part of an Image)
-  Support for `Midjourney` and a switch between it and StableDiffusion
- `Custom trained LLMs` for specific image modes - photorealistic / pencil sketch / 3d render
- `LLM Fine-Tuning`
- `3D Models` - generation and CAD integration
- `Discover` - Analytics and Feedback to provide users with analytics on their sketching habits and performance.
  
