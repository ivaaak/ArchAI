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
import './App.css';

function App() {
   const { isAuthenticated, user, loginWithRedirect } = useAuth0();

   return (
      <Router>
         <main>
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
                  <li className='actionBtn'>
                     <Link to="/generate">Generate</Link>
                  </li>
                  <li className='actionBtn'>
                     <Link to="/upload">Upload</Link>
                  </li>
                  <li className='actionBtn'>
                     <Link to="/sketch">Sketch</Link>
                  </li>
                  {isAuthenticated ? (
                     <div>
                        <p>Welcome, {user?.name}!</p>
                        <button onClick={() => loginWithRedirect()}>Log Out</button>
                     </div>
                  ) : (
                     <div>
                        <p>Please log in.</p>
                        <button onClick={() => loginWithRedirect()}>Log In</button>
                     </div>
                  )}
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
            </Routes>
         </main>
      </Router>
   );
}

export default App;
