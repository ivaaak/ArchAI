import { useAuth0 } from '@auth0/auth0-react';
import './UnauthorizedPage.css'

const UnauthorizedPage = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <div className="unauthorized-page">
            <h1>401</h1>
            <h2>Unauthorized</h2>
            <div>
                <h3>You are not authorized to view this page.</h3>
                <p>Please <button onClick={() => loginWithRedirect()}>Log in</button> to access this content.</p>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
