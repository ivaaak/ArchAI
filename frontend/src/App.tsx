import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Updated import
import Browse from './components/Browse';
import Examples from './components/Examples';
import Features from './components/Features';
import GenerateImage from './components/GenerateImage';
import LoginForm from './components/LoginForm';
import SketchImage from './components/SketchImage';
import UploadImage from './components/UploadImage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import UserProfile from './UserProfile';
import ImageShowcase from './components/ImageShowcase';

function App() {
   const { isAuthenticated, user, loginWithRedirect } = useAuth0();

   return (
      <Router>
         <main style={{ backgroundImage: `url('/../../public/assetImages/bg.png')` }}>
            <nav>
               <Link to="/">
                  <div className='navTitle'><h1 className='title'>Arch</h1><h1 className='title2'>AI</h1></div>
               </Link>

               <ul>
                  <li>
                     <Link to="/browse">Gallery</Link>
                  </li>
                  <li>
                     <Link to="/examples">Examples</Link>
                  </li>
                  <li>
                     <Link to="/generate">Generate</Link>
                  </li>
                  <li>
                     <Link to="/upload">Upload</Link>
                  </li>
                  <li>
                     <Link to="/sketch">Sketch</Link>
                  </li>
                  {isAuthenticated ? (<>
                     <li style={{ textAlign: 'center' }}>
                        <Link to="/profile">
                           <p>{user?.name?.split('@')[0]}</p>
                           Profile
                        </Link>
                     </li>
                     <button onClick={() => loginWithRedirect()}>
                        <FontAwesomeIcon icon={faSignOutAlt} />
                     </button>
                  </>
                  ) : (
                     <button onClick={() => loginWithRedirect()}>Log In</button>
                  )}
                  <li>
                     <FontAwesomeIcon icon={faSignOutAlt} />
                  </li>
               </ul>
            </nav>
            <Routes>
               <Route path="/" element={<Features />} />
               <Route path="/browse" element={<Browse />} />
               <Route path="/examples" element={<Examples />} />
               <Route path="/generate" element={<GenerateImage />} />
               <Route path="/upload" element={<UploadImage />} />
               <Route path="/sketch" element={<SketchImage />} />
               <Route path="/login" element={<LoginForm />} />
               <Route path="/profile" element={<UserProfile />} />
               <Route path="/details/src/uploads/:id" element={<ImageShowcase />} />
            </Routes>
         </main>
      </Router>
   );
}

export default App;
