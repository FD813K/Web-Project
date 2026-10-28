import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const resetSchema = z.object({
  email: z.string().max(70, "Email must be at most 70 characters").email("Enter a valid email address"),
});

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetSchema),
  });

  function myFormSubmissionFunction(data) {
    console.log("Form submitted.", data);
  }

  return (
    <main className="forgot-password-page">
      <link rel="stylesheet" href="/login.css" />
      <Link to="/login" className="back-btn">← Back to Login</Link>
      <h1>Reset Password</h1>
      <form className="standard-form" onSubmit={handleSubmit(myFormSubmissionFunction)}>
        <label htmlFor="reset-email">Email:</label>
        <input type="email" id="reset-email" maxLength="70" {...register("email")} />
        {errors.email && <span className="text-danger">{errors.email.message}</span>}
        <input type="submit" value="Request Reset" />
      </form>
    </main>
  );
}

export default ForgotPassword;
