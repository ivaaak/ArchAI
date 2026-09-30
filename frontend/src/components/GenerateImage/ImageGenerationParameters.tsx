import { PromptParameters } from '../../types';
import './ImageGenerationParameters.css'

type Option = [value: string, label: string];

const SELECTS: { key: keyof PromptParameters; label: string; options: Option[] }[] = [
  {
    key: 'sketchType', label: 'Sketch type', options: [
      ['city plan', 'City Plan'],
      ['single building sketch', 'Single Building Sketch'],
      ['site plan', 'Site Plan'],
      ['floor plan', 'Floor Plan'],
      ['cross section', 'Cross Section'],
      ['landscape', 'Landscape'],
      ['interior', 'Interior'],
    ]
  },
  {
    key: 'artStyle', label: 'Art style', options: [
      ['wireframe', 'Wireframe'],
      ['pencil sketch', 'Pencil Sketch'],
      ['hough line map', 'Hough Line Map'],
      ['outline', 'Outline'],
      ['realistic', 'Realistic'],
      ['stylized', 'Stylized'],
      ['cinematic', 'Cinematic'],
      ['photographic', 'Photographic'],
      ['3d model', '3D Model'],
      ['simplified', 'Simplified'],
      ['abstract', 'Abstract'],
    ]
  },
  {
    key: 'perspective', label: 'Perspective', options: [
      ['aerial view', 'Aerial View'],
      ['topdown view', 'Top-Down View'],
      ['front view', 'Front View'],
      ['side view', 'Side View'],
      ['rear view', 'Rear View'],
      ['ground plan', 'Ground Plan'],
      ['elevation', 'Elevation'],
      ['section', 'Section'],
      ['perspective', 'Perspective'],
      ['birds eye view', "Bird's Eye View"],
      ['oblique view', 'Oblique View'],
      ['detail view', 'Detail View'],
      ['walkthrough', 'Walkthrough'],
      ['interior view', 'Interior View'],
      ['exterior view', 'Exterior View'],
      ['night view', 'Night View'],
      ['day view', 'Day View'],
      ['sunrise view', 'Sunrise View'],
      ['sunset view', 'Sunset View'],
    ]
  },
  {
    key: 'dimension', label: 'Projection', options: [
      ['2D', '2D'],
      ['3D', '3D'],
      ['One-Point Perspective', 'One-Point Perspective'],
      ['Two-Point Perspective', 'Two-Point Perspective'],
      ['Multi-Point Perspective', 'Multi-Point Perspective'],
      ['Isometric Projection', 'Isometric Projection'],
      ['Trimetric', 'Trimetric'],
      ['Dimetric', 'Dimetric'],
      ['Cabinet Projection', 'Cabinet Projection'],
      ['Multiview (elevation)', 'Multiview (Elevation)'],
    ]
  },
  {
    key: 'color', label: 'Color', options: [
      ['black and white', 'Black and White'],
      ['monochrome', 'Monochrome'],
      ['colored', 'Colored'],
      ['contrasting', 'Contrasting'],
      ['watercolor', 'Watercolor'],
      ['warm', 'Warm'],
      ['vibrant', 'Vibrant'],
      ['triadic color palette', 'Triadic Color Palette'],
    ]
  },
];

const INPUTS: { key: keyof PromptParameters; label: string; placeholder: string }[] = [
  { key: 'structure', label: 'Structure type', placeholder: 'e.g. timber cabin, museum' },
  { key: 'location', label: 'Location', placeholder: 'e.g. Attersee, Austria' },
];

interface ImageGenerationParametersProps {
  value: PromptParameters;
  onChange: (parameters: PromptParameters) => void;
}

const ImageGenerationParameters: React.FC<ImageGenerationParametersProps> = ({ value, onChange }) => {
  const set = (key: keyof PromptParameters, newValue: string) => onChange({ ...value, [key]: newValue });

  return (
    <div className="parameters-grid">
      {SELECTS.map(({ key, label, options }) => (
        <label className="field" key={key}>
          <span className="field-label">{label}</span>
          <select value={value[key]} onChange={(e) => set(key, e.target.value)}>
            <option value="">Any</option>
            {options.map(([optionValue, optionLabel]) => (
              <option key={optionValue} value={optionValue}>{optionLabel}</option>
            ))}
          </select>
        </label>
      ))}
      {INPUTS.map(({ key, label, placeholder }) => (
        <label className="field" key={key}>
          <span className="field-label">{label}</span>
          <input type="text" value={value[key]} placeholder={placeholder} maxLength={80} onChange={(e) => set(key, e.target.value)} />
        </label>
      ))}
    </div>
  );
};

export default ImageGenerationParameters;
