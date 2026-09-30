import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashCan, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import { resolveImageUrl } from "../config";
import { apiClient } from "../lib/api";
import { displayPrompt } from "../lib/labels";
import { Preferences, getPreferences, getSavedPrompts, setPreferences, setSavedPrompts } from "../lib/storage";
import { StoredImage } from "../types";
import Pricing from "./Pricing/Pricing";
import './Tabs.css';
import './UserProfile.css';

type Tab = 'images' | 'prompts' | 'preferences' | 'plans';

const TABS: { id: Tab; label: string }[] = [
  { id: 'images', label: 'My images' },
  { id: 'prompts', label: 'Saved prompts' },
  { id: 'preferences', label: 'Preferences' },
  { id: 'plans', label: 'Plans' },
];

const RecentImages = ({ ownerId }: { ownerId: string }) => {
  const [images, setImages] = useState<StoredImage[] | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    apiClient.get<{ images: StoredImage[]; total: number }>('/image', { params: { ownerId, limit: 12 } })
      .then((response) => {
        setImages(response.data.images);
        setTotal(response.data.total);
      })
      .catch(() => setImages([]));
  }, [ownerId]);

  if (!images) return <div className="gallery-loading"><span className="spinner spinner-large" aria-label="Loading" /></div>;

  if (!images.length) {
    return (
      <div className="empty-state">
        <p className="muted">You have not generated any images yet.</p>
        <Link className="btn btn-primary" to="/generate">Generate your first image</Link>
      </div>
    );
  }

  return (
    <>
      <div className="profile-images">
        {images.map((image) => (
          <Link key={image._id} to={`/details/${image._id}`} className="profile-image" title={displayPrompt(image)}>
            <img src={resolveImageUrl(image)} alt={displayPrompt(image) || 'Generated image'} loading="lazy" />
          </Link>
        ))}
      </div>
      {total > images.length && (
        <p className="profile-more"><Link to="/browse">See all {total} images in Collections</Link></p>
      )}
    </>
  );
};

const SavedPrompts = () => {
  const [prompts, setPrompts] = useState(getSavedPrompts);
  const [newPrompt, setNewPrompt] = useState('');

  const update = (updated: string[]) => {
    setPrompts(updated);
    setSavedPrompts(updated);
  };

  const addPrompt = (event: React.FormEvent) => {
    event.preventDefault();
    const prompt = newPrompt.trim();
    if (prompt && !prompts.includes(prompt)) update([prompt, ...prompts]);
    setNewPrompt('');
  };

  return (
    <div className="stack">
      <form className="inline-form" onSubmit={addPrompt}>
        <input type="text" placeholder="Add a prompt you use often" value={newPrompt} onChange={(e) => setNewPrompt(e.target.value)} maxLength={1000} />
        <button className="btn btn-primary" type="submit" disabled={!newPrompt.trim()}>
          <FontAwesomeIcon icon={faPlus} /> Add
        </button>
      </form>
      {prompts.length === 0 ? (
        <p className="muted">No saved prompts yet. Use the Save button next to the prompt box when generating.</p>
      ) : (
        <ul className="prompt-list">
          {prompts.map((prompt) => (
            <li key={prompt}>
              <span>{prompt}</span>
              <Link className="icon-btn" to={`/generate?prompt=${encodeURIComponent(prompt)}`} title="Use this prompt" aria-label="Use this prompt">
                <FontAwesomeIcon icon={faWandMagicSparkles} />
              </Link>
              <button className="icon-btn icon-btn-danger" onClick={() => update(prompts.filter((p) => p !== prompt))} title="Remove" aria-label="Remove prompt">
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const PreferencesForm = () => {
  const [preferences, setLocalPreferences] = useState<Preferences>(getPreferences);
  const [saved, setSaved] = useState(false);

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    setPreferences(preferences);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form className="stack preferences-form" onSubmit={save}>
      <label className="field">
        <span className="field-label">Default negative prompt</span>
        <input
          type="text"
          value={preferences.negativePrompt}
          placeholder="e.g. people, cars, text, watermark"
          onChange={(e) => setLocalPreferences({ ...preferences, negativePrompt: e.target.value })}
        />
        <span className="muted small">Pre-filled in the Advanced section of every generator.</span>
      </label>
      <label className="field">
        <span className="field-label">Default number of images</span>
        <select
          value={preferences.imageCount}
          onChange={(e) => setLocalPreferences({ ...preferences, imageCount: Number(e.target.value) })}
        >
          {[1, 2, 3, 4].map((count) => <option key={count} value={count}>{count}</option>)}
        </select>
      </label>
      <div>
        <button className="btn btn-primary" type="submit">{saved ? 'Saved' : 'Save preferences'}</button>
      </div>
    </form>
  );
};

const Profile = () => {
  const { user, isLoading } = useAuth0();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState<Tab>('images');

  if (isLoading || !user) {
    return <div className="page gallery-loading"><span className="spinner spinner-large" aria-label="Loading" /></div>;
  }

  const displayName = user.name?.split('@')[0] || user.nickname || 'Architect';

  return (
    <div className="page profile">
      {searchParams.get('checkout') === 'success' && (
        <p className="alert alert-success">Checkout complete. Thank you for subscribing!</p>
      )}

      <header className="profile-header panel">
        {user.picture
          ? <img className="avatar avatar-large" src={user.picture} alt="" referrerPolicy="no-referrer" />
          : <span className="avatar avatar-large">{displayName[0]?.toUpperCase()}</span>}
        <div>
          <h1>{displayName}</h1>
          <p className="muted">{user.email}</p>
        </div>
      </header>

      <div className="tabs" role="tablist" aria-label="Profile sections">
        {TABS.map(({ id, label }) => (
          <button key={id} role="tab" aria-selected={tab === id} className={`tab ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>

      <div className="panel profile-content" role="tabpanel">
        {tab === 'images' && user.sub && <RecentImages ownerId={user.sub} />}
        {tab === 'prompts' && <SavedPrompts />}
        {tab === 'preferences' && <PreferencesForm />}
        {tab === 'plans' && <Pricing />}
      </div>
    </div>
  );
};

export default Profile;
