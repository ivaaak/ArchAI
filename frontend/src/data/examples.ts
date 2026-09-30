export interface Example {
  src: string;
  name: string;
  prompt: string;
  tags: string[];
}

// Images generated with ArchAI, with the prompts that produce similar results
export const EXAMPLES: Example[] = [
  {
    src: '/sketchTypePreviews/single building 3d sketch.jpeg',
    name: 'Single Building 3D Sketch',
    prompt: 'a modern house Attersee, Austria, 3d paper sketch angular black and white outlines style',
    tags: ['Single building', 'Paper', 'Black and white'],
  },
  {
    src: '/sketchTypePreviews/combined.jpeg',
    name: 'Presentation Board',
    prompt: 'architecture presentation board of a timber mountain house, elevation, floor plan and cross section, pine forest and lake, black and white',
    tags: ['Elevation', 'Floor plan', 'Cross section'],
  },
  {
    src: '/sketchTypePreviews/out-0.png',
    name: 'Interior Pencil Sketch',
    prompt: 'pencil sketch of a bright open plan office interior, floor to ceiling windows overlooking a city skyline, glass roof, plants',
    tags: ['Interior view', 'Pencil sketch'],
  },
  {
    src: '/sketchTypePreviews/city plan.jpeg',
    name: 'City Plan',
    prompt: 'topdown view 2d black and white vanrick style architecture sketch city plan',
    tags: ['City plan', 'Top-down view', '2D'],
  },
  {
    src: '/sketchTypePreviews/sketch aerial isomorphic view.jpeg',
    name: 'Aerial Isometric View',
    prompt: 'aerial isometric sketch of a modern timber house on a forested hillside, black and white line drawing, detailed',
    tags: ['Aerial view', 'Isometric projection'],
  },
  {
    src: '/sketchTypePreviews/site plan.jpeg',
    name: 'Site Plan',
    prompt: 'site plan of a house on a wooded plot, access road, trees drawn from above, black and white architectural drawing',
    tags: ['Site plan', 'Top-down view'],
  },
];
