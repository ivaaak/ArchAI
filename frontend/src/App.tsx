import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSearch, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from './components/ThemeContext';
import { useContext, useState } from 'react';
import UserProfile from './components/UserProfile';
import ImageShowcase from './components/Showcase/ImageShowcase';
import Pricing from './components/Pricing/Pricing';
import GlobalSearchModal from './components/GlobalSearchModal';
import Browse from './components/Browse/Browse';
import Examples from './components/Browse/Examples';
import Features from './components/Features';
import GenerateImage from './components/GenerateImage/GenerateImage';
import SketchImage from './components/SketchImage';
import UploadImage from './components/UploadImage';
import UnauthorizedPage from './components/UnauthorizedPage';
import './App.css';

function App() {
   const { isAuthenticated, user, loginWithRedirect } = useAuth0();
   const { theme, toggleTheme } = useContext(ThemeContext);
   const [globalSearchModalOpen, setGlobalSearchModalOpen] = useState(false);

   const openModal = () => {
      setGlobalSearchModalOpen(true);
   };

   const closeModal = () => {
      setGlobalSearchModalOpen(false);
   };

   return (
      <div className={`App ${theme}`}> {/* Theme Class */}
         <Router>
            <main>
               <nav>
                  <Link to="/">
                     <div className='navTitle'><h1 className='title'>Arch</h1><h1 className='title2'>AI</h1></div>
                  </Link>

                  <ul>
                     <button className='globalSearchBtn' onClick={openModal}>
                        <FontAwesomeIcon icon={faSearch} />
                        Imagine...
                     </button>
                     <GlobalSearchModal isOpen={globalSearchModalOpen} onClose={closeModal}>
                     </GlobalSearchModal>
                     <li>
                        <Link to="/browse">Collections</Link>
                     </li>
                     <li>
                        <Link to="/generate">Generate</Link>
                     </li>
                     {isAuthenticated ? (<>
                        <li style={{ textAlign: 'center' }}>
                           <Link to="/profile">
                              {user?.name?.split('@')[0]}
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
                        <button onClick={toggleTheme}>
                           <FontAwesomeIcon icon={faMoon} />
                        </button>
                     </li>
                  </ul>
               </nav>
               <Routes>
                  <Route path="/" element={<Features />} />
                  <Route path="/browse" element={<Browse />} />
                  <Route path="/examples" element={<Examples />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/details/src/uploads/:id" element={<ImageShowcase />} />
                  <Route path="/generate" element={isAuthenticated ? <GenerateImage /> : <UnauthorizedPage />} />
                  <Route path="/upload" element={isAuthenticated ? <UploadImage /> : <UnauthorizedPage />} />
                  <Route path="/sketch" element={isAuthenticated ? <SketchImage /> : <UnauthorizedPage />} />
                  <Route path="*" element={<UnauthorizedPage />} /> {/* Catch-all route for unauthorized access */}
               </Routes>
            </main>
         </Router>
      </div>
   );
}

export default App;
