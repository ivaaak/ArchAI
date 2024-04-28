import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import GenerateImage from './components/GenerateImage';
import Features from './components/Features';
import Browse from './components/Browse';
import Examples from './components/Examples';
import UploadImage from './components/UploadImage';
import SketchImage from './components/SketchImage';
import './App.css';

function App() {
   return (
      <Router>
         <main>
            <nav>
               <div className='navTitle'><h1 className='title'>Arch</h1><h1 className='title2'>AI</h1></div>
               <ul>
                  <li>
                     <Link to="/">Home</Link>
                  </li>
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
                  <li >
                     <button>Sign Up</button>
                  </li>
               </ul>
            </nav>
            <Routes>
               <Route path="/" Component={Features} />
               <Route path="/browse" Component={Browse} />
               <Route path="/examples" Component={Examples} />
               <Route path="/generate" Component={GenerateImage} />
               <Route path="/upload" Component={UploadImage} />
               <Route path="/sketch" Component={SketchImage} />

               {/* Add routes for "Upload" and "Draw" components here */}
            </Routes>
         </main>
      </Router>
   );
}

export default App;
