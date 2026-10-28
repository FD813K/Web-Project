import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

const signupSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(70, "Name must be at most 70 characters"),
  email: z.string().max(70, "Email must be at most 70 characters").email("Enter a valid email address"),
  username: z.string().trim().min(1, "Username is required").max(25, "Username must be at most 25 characters"),
  password: z.string().min(8, "Password must be at least 8 characters").max(25, "Password must be at most 25 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password").max(25, "Password must be at most 25 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

function Signup() {
  const [submissionMessage, setSubmissionMessage] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  function myFormSubmissionFunction() {
    setSubmissionMessage(null);
    setSubmissionMessage({
      type: "success",
      text: "Registration is frontend-only right now. Your account was not saved.",
    });
  }

  return (
    <main className="signup-page">
      <link rel="stylesheet" href="/signup.css" />
      <Link to="/" className="back-btn">← Back to Home</Link>
      <h1>Sign Up</h1>
      <form className="standard-form" onSubmit={handleSubmit(myFormSubmissionFunction)}>
        <label htmlFor="fullname">Full Name:</label>
        <input type="text" id="fullname" maxLength="70" {...register("fullName")} />
        {errors.fullName && <span className="text-danger">{errors.fullName.message}</span>}
        <label htmlFor="signup-email">Email:</label>
        <input type="email" id="signup-email" maxLength="70" {...register("email")} />
        {errors.email && <span className="text-danger">{errors.email.message}</span>}
        <label htmlFor="signup-username">Username:</label>
        <input type="text" id="signup-username" maxLength="25" {...register("username")} />
        {errors.username && <span className="text-danger">{errors.username.message}</span>}
        <label htmlFor="signup-password">Password:</label>
        <input type="password" id="signup-password" minLength="8" maxLength="25" {...register("password")} />
        {errors.password && <span className="text-danger">{errors.password.message}</span>}
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input type="password" id="confirmPassword" minLength="8" maxLength="25" {...register("confirmPassword")} />
        {errors.confirmPassword && <span className="text-danger">{errors.confirmPassword.message}</span>}
        <input type="submit" value="Create Account" />
        {submissionMessage && (
          <p
            className={submissionMessage.type === "error" ? "text-danger" : "success-msg"}
            role={submissionMessage.type === "error" ? "alert" : "status"}
          >
            {submissionMessage.text}
          </p>
        )}
        <footer>Already have an account? <Link to="/login">Login</Link></footer>
      </form>
    </main>
  );
}

export default Signup;
