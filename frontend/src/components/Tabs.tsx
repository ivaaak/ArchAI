import { NavLink } from "react-router-dom";
import './Tabs.css'

interface Route {
  route: string;
  label: string;
}

interface TabsProps {
  routes: Route[];
  label?: string;
}

const Tabs: React.FC<TabsProps> = ({ routes, label = 'Sections' }) => {
  return (
    <nav className="tabs" aria-label={label}>
      {routes.map((route) => (
        <NavLink key={route.route} to={route.route} className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}>
          {route.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default Tabs;
