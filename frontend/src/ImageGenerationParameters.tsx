import { ChangeEvent, SetStateAction, useState } from 'react';
import './ImageGenerationParameters.css'

const ImageGenerationParameters = () => {
 const [sketchType, setSketchType] = useState('');
 const [color, setColor] = useState('');
 const [artStyle, setArtStyle] = useState('');
 const [perspective, setPerspective] = useState('');
 const [dimension, setDimension] = useState('');
 const [structure, setStructure] = useState('');
 const [location, setLocation] = useState('');

 const handleChange = (event: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>, setter: { (value: SetStateAction<string>): void; (value: SetStateAction<string>): void; (value: SetStateAction<string>): void; (value: SetStateAction<string>): void; (value: SetStateAction<string>): void; (value: SetStateAction<string>): void; (value: SetStateAction<string>): void; (arg0: any): void; }) => {
    setter(event.target.value);
 };

 return (
    <div className="image-generation-parameters">
      <div className="parameter">
        <select id="sketchType" value={sketchType} onChange={(event) => handleChange(event, setSketchType)}>
          <option value=""> Main Type of Sketch:</option>
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
          <option value=""> Select a color:</option>
          <option value="black and white">Black and White</option>
          <option value="monochrome">Monochrome</option>
          <option value="colored">Colored</option>
        </select>
      </div>
      <div className="parameter">
        <select id="artStyle" value={artStyle} onChange={(event) => handleChange(event, setArtStyle)}>
          <option value=""> Art style: </option>
          <option value="wireframe">Wireframe</option>
          <option value="sketch">Sketch</option>
          <option value="hough line map">Hough Line Map</option>
          <option value="outline">Outline</option>
        </select>
      </div>
      <div className="parameter">
        <select id="perspective" value={perspective} onChange={(event) => handleChange(event, setPerspective)}>
          <option value=""> Perspective:</option>
          <option value="aerial view">Aerial View</option>
          <option value="topdown view">Top-Down View</option>
        </select>
      </div>
      <div className="parameter">
        <select id="dimension" value={dimension} onChange={(event) => handleChange(event, setDimension)}>
          <option value=""> Dimension</option>
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
