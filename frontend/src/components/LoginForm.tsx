import { useAuth0 } from '@auth0/auth0-react';

const LoginForm = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect();
  };

  const handleLogout = () => {
    logout();
  };
  return (
    <div className="form-container" style={{ backgroundImage: `url('/images/sketch-nobg.jpg')` }}>
      <h2>{isAuthenticated? 'Welcome!' : 'Please log in'}</h2>
      {!isAuthenticated? (
        <button onClick={handleLogin}>Log In</button>
      ) : (
        <button onClick={handleLogout}>Log Out</button>
      )}
    </div>
  );
};

export default LoginForm;
