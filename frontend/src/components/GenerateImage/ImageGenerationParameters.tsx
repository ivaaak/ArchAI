import { ChangeEvent, SetStateAction, useState } from 'react';
import './ImageGenerationParameters.css'

interface ImageGenerationParametersProps {
  onParametersChange: (parameters: {
    sketchType: string;
    color: string;
    artStyle: string;
    perspective: string;
    dimension: string;
    structure: string;
    location: string;
  }) => void;
}

const ImageGenerationParameters: React.FC<ImageGenerationParametersProps> = ({ onParametersChange }) => {
  const [sketchType, setSketchType] = useState('');
  const [color, setColor] = useState('');
  const [artStyle, setArtStyle] = useState('');
  const [perspective, setPerspective] = useState('');
  const [dimension, setDimension] = useState('');
  const [structure, setStructure] = useState('');
  const [location, setLocation] = useState('');

  const handleChange = (
    event: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>,
    setter: {
      (value: SetStateAction<string>): void;
      (value: SetStateAction<string>): void;
      (value: SetStateAction<string>): void;
      (value: SetStateAction<string>): void;
      (value: SetStateAction<string>): void;
      (value: SetStateAction<string>): void;
      (value: SetStateAction<string>): void;
      (arg0: any): void;
    }) => {
    setter(event.target.value);
    onParametersChange({
      sketchType,
      color,
      artStyle,
      perspective,
      dimension,
      structure,
      location,
    });
  };

  return (
    <div className="image-generation-parameters">
      <div className="parameter">
        <select id="sketchType" value={sketchType} onChange={(event) => handleChange(event, setSketchType)}>
          <option value="" disabled hidden>General Sketch Type:</option>
          <option value="city plan">City Plan</option>
          <option value="single building sketch">Single Building Sketch</option>
          <option value="site plan">Site Plan</option>
          <option value="floor plan">Floor Plan</option>
          <option value="cross section">Cross Section</option>
          <option value="landscape">Landscape</option>
        </select>
      </div>
      <div className="parameter">
        <select id="color" value={color} onChange={(event) => handleChange(event, setColor)}>
          <option value="" disabled hidden> Color Options: </option>
          <option value="black and white">Black and White</option>
          <option value="monochrome">Monochrome</option>
          <option value="colored">Colored</option>
          <option value="contrasting">Contrasting</option>
          <option value="watercolor">Watercolor</option>
          <option value="warm">Warm</option>
          <option value="vibrant">Vibrant</option>
          <option value="triadic color palette">Triadic Color Palette</option>

        </select>
      </div>
      <div className="parameter">
        <select id="artStyle" value={artStyle} onChange={(event) => handleChange(event, setArtStyle)}>
          <option value="" disabled hidden> Art style: </option>
          <option value="wireframe">Wireframe</option>
          <option value="pencil sketch">Pencil Sketch</option>
          <option value="hough line map">Hough Line Map</option>
          <option value="outline">Outline</option>
          <option value="realistic">Realistic</option>
          <option value="stylized">Stylized</option>
          <option value="cinematic">Cinematic</option>
          <option value="photographic">Photographic</option>
          <option value="3d model">3D Model</option>
          <option value="simplified">Simplified</option>
          <option value="abstract">Abstract</option>
        </select>
      </div>
      <div className="parameter">
        <select id="perspective" value={perspective} onChange={(event) => handleChange(event, setPerspective)}>
          <option value="" disabled hidden> Perspective:</option>
          <option value="aerial view">Aerial View</option>
          <option value="topdown view">Top-Down View</option>
          <option value="front view">Front View</option>
          <option value="side view">Side View</option>
          <option value="rear view">Rear View</option>
          <option value="ground plan">Ground Plan</option>
          <option value="elevation">Elevation</option>
          <option value="section">Section</option>
          <option value="perspective">Perspective</option>
          <option value="birds eye view">Bird's Eye View</option>
          <option value="oblique view">Oblique View</option>
          <option value="detail view">Detail View</option>
          <option value="walkthrough">Walkthrough</option>
          <option value="interior view">Interior View</option>
          <option value="exterior view">Exterior View</option>
          <option value="night view">Night View</option>
          <option value="day view">Day View</option>
          <option value="sunrise view">Sunrise View</option>
          <option value="sunset view">Sunset View</option>
        </select>
      </div>
      <div className="parameter">
        <select id="dimension" value={dimension} onChange={(event) => handleChange(event, setDimension)}>
          <option value="" disabled hidden> Dimension</option>
          <option value="2D">2D</option>
          <option value="3D">3D</option>
          <option value="One-Point Perspective">One-Point Perspective</option>
          <option value="Two-Point Perspective">Two-Point Perspective</option>
          <option value="Multi-Point Perspective">Multi-Point Perspective</option>
          <option value="Isometric Projection">Isometric Projection</option>
          <option value="Trimetric">Trimetric</option>
          <option value="Dimetric">Dimetric</option>
          <option value="Cabinet Projection">Cabinet Projection</option>
          <option value="Multiview (elevation)">Multiview (Elevation)</option>
        </select>
      </div>
      <div className="parameter">
        <input type="text" id="structure" placeholder='Structure Type:' value={structure} onChange={(event) => handleChange(event, setStructure)} />
      </div>
      <div className="parameter">
        <input type="text" id="location" placeholder='Location' value={location} onChange={(event) => handleChange(event, setLocation)} />
      </div>
    </div>
  );
};

export default ImageGenerationParameters;
