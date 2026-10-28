import { Link, useNavigate } from "react-router-dom";

export default function CustomerLogin() {
  const navigate = useNavigate();

  function myFormSubmissionFunction(event) {
    event.preventDefault();
    navigate("/customer");
  }

  return (
    <main>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="/login.css" />
      <h1>Customer login</h1>
      <form noValidate onSubmit={myFormSubmissionFunction}>
        <label htmlFor="customer-username">Username/Email:</label>
        <input id="customer-username" type="text" maxLength="70" autoComplete="username" />
        <label htmlFor="customer-password">Password:</label>
        <input id="customer-password" type="password" maxLength="25" autoComplete="current-password" />
        <input type="submit" value="Login" />
        <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
      </form>
    </main>
  );
}