import { Link, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

// Shown instead of pages that need an account
const UnauthorizedPage = () => {
    const { loginWithRedirect } = useAuth0();
    const location = useLocation();

    return (
        <div className="page status-page">
            <img src="/assetImages/Software-integration-01.svg" alt="" />
            <h1>Sign in to start sketching</h1>
            <p className="muted">Create a free account to generate, refine and save architectural drawings.</p>
            <div className="status-page-actions">
                <button className="btn btn-primary" onClick={() => loginWithRedirect({ appState: { returnTo: location.pathname + location.search } })}>
                    Log in or sign up
                </button>
                <Link className="btn" to="/examples">Browse examples</Link>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
