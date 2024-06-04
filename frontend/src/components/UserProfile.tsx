import { useAuth0 } from "@auth0/auth0-react";
import { SetStateAction, useState } from "react";
import Pricing from "./Pricing/Pricing";
import './UserProfile.css';

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [mode, setMode] = useState('stablediffusion'); // Default to stablediffusion
  const [apiKey, setApiKey] = useState('');
  const [useOwnApiKey, setUseOwnApiKey] = useState(false); // Default to not using own API key
  const [prompts, setPrompts] = useState<string[]>([]);
  const [tab, setTab] = useState<string>('general');
  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [subscribe, setSubscribe] = useState<boolean>(false);

  const addPrompt = (newPrompt: string) => {
    setPrompts([...prompts, newPrompt]);
  };

  const toggleMode = () => {
    setMode(mode === 'stablediffusion' ? 'midjourney' : 'stablediffusion');
  };

  const handleApiKeyChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setApiKey(e.target.value);
  };

  const handleUseOwnApiKeyChange = (e: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
    setUseOwnApiKey(e.target.checked);
  };

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'age':
        setAge(value);
        break;
      case 'subscribe':
        setSubscribe(value === 'true');
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    isAuthenticated && (
      <div>
        <div className="container">
          {isAuthenticated && (
            <div>
              <h2>Welcome, {user?.name?.split('@')[0]}</h2>
              <p>{user?.email}</p>
            </div>
          )}
          <nav>
            <ul>
              <li>
                <button onClick={() => handleTabChange('general')}>Image Generation Mode</button>
              </li>
              <li>
                <button onClick={() => handleTabChange('profile')}>Profile Settings</button>
              </li>
              <li>
                <button onClick={() => handleTabChange('notifications')}>Notifications</button>
              </li>
              <li>
                <button onClick={() => handleTabChange('prompts')}>Prompt Collection</button>
              </li>
              <li>
                <button onClick={() => handleTabChange('plans')}>Pricing Plans</button>
              </li>
            </ul>
          </nav>
          <div className="content">
            {tab === 'general' && (
              <div>
                <h2>General Settings</h2>
                {/* <input type="text" name="name" value={name} onChange={handleInputChange} placeholder="Name" />
                <input type="number" name="age" value={age} onChange={handleInputChange} placeholder="Age" /> */}
                <div>
                  <button onClick={toggleMode}>
                    Toggle Mode: {mode === 'stablediffusion' ? 'Stablediffusion' : 'Midjourney'}
                  </button>
                </div>
                <div>
                  <label>
                    <input type="checkbox" checked={useOwnApiKey} onChange={handleUseOwnApiKeyChange} />
                    Use Own API Key
                  </label>
                </div>
                <div>
                  <label>
                    API Key:
                    <input type="text" value={apiKey} onChange={handleApiKeyChange} />
                  </label>
                </div>
              </div>
            )}
            {tab === 'profile' && (
              <div>
                <h2>Profile Settings</h2>
                <input type="text" name="profileName" placeholder="Profile Name" />
                <br />
                <input type="email" name="profileEmail" placeholder="Profile Email" />
              </div>
            )}
            {tab === 'notifications' && (
              <div>
                <h2>Notifications Settings</h2>
                <input type="checkbox" name="subscribe" checked={subscribe} onChange={handleInputChange} />
                <label>Subscribe to newsletter</label>
              </div>
            )}
            {tab === 'prompts' && (
              <div className="container">
                <h3 className="title">Prompt Collection</h3>
                <input type="text" className="input-field" placeholder="Add a new prompt" onChange={(e) => addPrompt(e.target.value)} />
                <ul>
                  {prompts.map((prompt, index) => (
                    <li key={index} className="list-item">{prompt}</li>
                  ))}
                </ul>
              </div>
            )}
            {tab === 'plans' && (
              <div className="container">
                <h3 className="title">Pricing Plans</h3>
                <Pricing></Pricing>
              </div>)}
          </div>
        </div>
      </div>
    )
  );
};

export default Profile;