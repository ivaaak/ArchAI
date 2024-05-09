import { Link } from "react-router-dom";
import './Tabs.css'

interface Route {
  route: string;
  label: string;
}

interface TabsProps {
  routes: Route[];
}

const Tabs: React.FC<TabsProps> = ({ routes }) => {
  return (
    <ul className="tabsContainer">
      {routes.map((route, index) => (
        <li className="tab" key={index}>
          <Link to={route.route}>{route.label}</Link>
        </li>
      ))}
    </ul>
  );
};

export default Tabs;
