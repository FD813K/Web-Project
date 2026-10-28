import { Link, useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  function myFormSubmissionFunction(event) {
    event.preventDefault();
    navigate("/admin");
  }

  return (
    <main className="admin-login-page">
      <link rel="stylesheet" href="/login.css" />
      <Link to="/login" className="back-btn">← Back to Login</Link>
      <h1>Admin login</h1>
      <form className="standard-form" noValidate onSubmit={myFormSubmissionFunction}>
        <label htmlFor="admin-username">Username/Email:</label>
        <input id="admin-username" type="text" maxLength="70" autoComplete="username" />
        <label htmlFor="admin-password">Password:</label>
        <input id="admin-password" type="password" maxLength="25" autoComplete="current-password" />
        <input type="submit" value="Login" />
        <p>Need an account? <Link to="/signup">Sign up</Link></p>
      </form>
    </main>
  );
}