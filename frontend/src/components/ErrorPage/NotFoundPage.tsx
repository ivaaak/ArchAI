import { Link } from 'react-router-dom';

const NotFoundPage = () => (
    <div className="page status-page">
        <p className="status-code">404</p>
        <h1>This page does not exist</h1>
        <p className="muted">The link may be broken, or the page may have been moved.</p>
        <div className="status-page-actions">
            <Link className="btn btn-primary" to="/">Go home</Link>
            <Link className="btn" to="/generate">Generate an image</Link>
        </div>
    </div>
);

export default NotFoundPage;
