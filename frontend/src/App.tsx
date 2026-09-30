import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { apiClient } from './lib/api';
import Navbar from './components/Navbar/Navbar';
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
import InpaintImage from './components/InpaintImage';
import UnauthorizedPage from './components/UnauthorizedPage';
import NotFoundPage from './components/ErrorPage/NotFoundPage';
import ErrorBoundary from './components/ErrorPage/ErrorBoundary';

// Renders the page only for signed-in users; waits for Auth0 instead of flashing the sign-in page
const RequireAuth = ({ children }: { children: JSX.Element }) => {
   const { isAuthenticated, isLoading } = useAuth0();
   if (isLoading) {
      return <div className="page gallery-loading"><span className="spinner spinner-large" aria-label="Loading" /></div>;
   }
   return isAuthenticated ? children : <UnauthorizedPage />;
};

// Creates / updates the user's record in the backend once per session
function useSyncUser() {
   const { isAuthenticated, user } = useAuth0();
   const synced = useRef(false);

   useEffect(() => {
      if (!isAuthenticated || !user?.sub || synced.current) return;
      synced.current = true;
      apiClient.post('/users', {
         auth0Id: user.sub,
         name: user.name,
         email: user.email,
         image: user.picture,
      }).catch((error) => console.warn('Could not sync the user profile:', error));
   }, [isAuthenticated, user]);
}

function App() {
   const [quickGenerateOpen, setQuickGenerateOpen] = useState(false);
   const location = useLocation();
   useSyncUser();

   const openQuickGenerate = useCallback(() => setQuickGenerateOpen(true), []);
   const closeQuickGenerate = useCallback(() => setQuickGenerateOpen(false), []);

   // Ctrl+K / Cmd+K opens the quick generator
   useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
         if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            setQuickGenerateOpen((open) => !open);
         }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, []);

   useEffect(() => {
      window.scrollTo(0, 0);
   }, [location.pathname]);

   return (
      <div className="app">
         <a className="skip-link" href="#main">Skip to content</a>
         <Navbar onOpenQuickGenerate={openQuickGenerate} />
         <GlobalSearchModal isOpen={quickGenerateOpen} onClose={closeQuickGenerate} />
         <main id="main">
            <ErrorBoundary resetKey={location.pathname}>
               <Routes>
                  <Route path="/" element={<Features />} />
                  <Route path="/browse" element={<Browse />} />
                  <Route path="/examples" element={<Examples />} />
                  <Route path="/pricing" element={<div className="page"><Pricing /></div>} />
                  <Route path="/details/:id" element={<ImageShowcase />} />
                  <Route path="/profile" element={<RequireAuth><UserProfile /></RequireAuth>} />
                  <Route path="/generate" element={<RequireAuth><GenerateImage /></RequireAuth>} />
                  <Route path="/upload" element={<RequireAuth><UploadImage /></RequireAuth>} />
                  <Route path="/sketch" element={<RequireAuth><SketchImage /></RequireAuth>} />
                  <Route path="/inpaint" element={<RequireAuth><InpaintImage /></RequireAuth>} />
                  <Route path="*" element={<NotFoundPage />} />
               </Routes>
            </ErrorBoundary>
         </main>
         <footer className="footer">
            <span>© {new Date().getFullYear()} ArchAI</span>
            <nav aria-label="Footer">
               <Link to="/examples">Examples</Link>
               <Link to="/pricing">Pricing</Link>
               <a href="https://github.com/ivaaak/ArchAI" target="_blank" rel="noreferrer">GitHub</a>
            </nav>
         </footer>
      </div>
   );
}

export default App;
