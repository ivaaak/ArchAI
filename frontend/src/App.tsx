import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import GenerateImage from './GenerateImage';
import Features from './Features';
import './App.css';
import Browse from './Browse';
import Examples from './Examples';

function App() {
   return (
      <Router>
         <main>
            <nav>
               <ul>
                  <li>
                     <Link to="/">Home</Link>
                  </li>
                  <li>
                     <Link to="/browse">Browse</Link>
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
                     <Link to="/draw">Draw</Link>
                  </li>
                  <li>
                     <button>Sign Up</button>
                  </li>
               </ul>
            </nav>
            <Routes>
               <Route path="/" Component={Features} />
               <Route path="/browse" Component={Browse} />
               <Route path="/examples" Component={Examples} />
               <Route path="/generate" Component={GenerateImage} />
               {/* Add routes for "Upload" and "Draw" components here */}
            </Routes>
         </main>
      </Router>
   );
}

export default App;
