import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  function myFormSubmissionFunction(event) {
    event.preventDefault();
    navigate("/customer");
  }

  return (
    <main className="login-page">
      <link rel="stylesheet" href="/login.css" />
      <Link to="/" className="back-btn">← Back to Home</Link>
      <h1>Login</h1>
      <form className="standard-form" noValidate onSubmit={myFormSubmissionFunction}>
        <label htmlFor="username"><span>Username/Email:</span></label>
        <input type="text" id="username" maxLength="70" />
        <label htmlFor="password"><span>Password:</span></label>
        <input type="password" id="password" maxLength="25" />
        <input type="submit" value="Login" />
        <footer>
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
          <p>Forgot your password? <Link to="/forgot-password">Reset it</Link></p>
          <p>Are you an admin? <Link to="/admin-login">Admin login</Link></p>
          <p>Are you a shareholder? <Link to="/shareholder-login">Shareholder login</Link></p>
        </footer>
      </form>
    </main>
  );
}

export default Login;
