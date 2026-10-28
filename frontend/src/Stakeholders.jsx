import { Link } from "react-router-dom";

function Stakeholders() {
  return (
    <div className="stakeholders-page">
      <link rel="stylesheet" href="/stakeholders.css" />
      <Link className="back-btn" to="/">← Back to Home</Link>
      <Link className="sign-out" to="/login">Sign out</Link>
      <main className="page-shell">
        <section className="page-heading">
          <p className="eyebrow">Marketplace workspace</p>
          <h1>Choose a stakeholder</h1>
          <p>Each role has its own page and set of example forms.</p>
        </section>
        <p className="notice"><strong>Static class demo:</strong> these pages show form layouts only. They do not authenticate users or save changes.</p>
        <section className="role-directory" aria-label="Stakeholder pages">
          <a className="role-link admin-role" to="/admin">
            <span className="role-number">01 / ADMIN</span>
            <h2>Marketplace management</h2>
            <p>Manage product listings and review customer complaints.</p>
            <span className="role-cta">Open admin page</span>
          </a>
          <a className="role-link customer-role" to="/customer">
            <span className="role-number">02 / CUSTOMER</span>
            <h2>Orders and account</h2>
            <p>Place an order, update account details, and review example orders.</p>
            <span className="role-cta">Open customer page</span>
          </a>
          <a className="role-link shareholder-role" to="/shareholder">
            <span className="role-number">03 / SHAREHOLDER</span>
            <h2>Investment records</h2>
            <p>Review an example investment and request a dividend statement.</p>
            <span className="role-cta">Open shareholder page</span>
          </a>
        </section>
      </main>
    </div>
  );
}

export default Stakeholders;
