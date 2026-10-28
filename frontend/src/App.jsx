import Complaints from "./Complaints.jsx";
import MyProducts from "./MyProducts.jsx";
import { createBrowserRouter } from "react-router-dom";
import Home from "./Home.jsx";
import Buy from "./Buy.jsx";
import Sell from "./Sell.jsx";
import Login from "./Login.jsx";
import Contact from "./Contact.jsx";
import Stakeholders from "./Stakeholders.jsx";
import Signup from "./Signup.jsx";
import ForgotPassword from "./ForgotPassword.jsx";
import AdminLogin from "./AdminLogin.jsx";
import ShareholderLogin from "./ShareholderLogin.jsx";
import AdminForms from "./AdminForms.jsx";
import CustomerForms from "./CustomerForms.jsx";
import ShareholderForms from "./ShareholderForms.jsx";

export const router = createBrowserRouter([
  { path: "/complaints", element: <Complaints /> },
  { path: "/myproducts", element: <MyProducts /> },
  { path: "/", element: <Home /> },
  { path: "/buy", element: <Buy /> },
  { path: "/sell", element: <Sell /> },
  { path: "/login", element: <Login /> },
  { path: "/contact", element: <Contact /> },
  { path: "/stakeholders", element: <Stakeholders /> },
  { path: "/signup", element: <Signup /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/admin-login", element: <AdminLogin /> },
  { path: "/shareholder-login", element: <ShareholderLogin /> },
  { path: "/admin", element: <AdminForms /> },
  { path: "/customer", element: <CustomerForms /> },
  { path: "/shareholder", element: <ShareholderForms /> },
]);

