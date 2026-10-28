import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { createContactMessageAxiosFunction, getApiErrorMessage } from "./Service/api.js";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(70, "Name must be at most 70 characters"),
  email: z.string().max(70, "Email must be at most 70 characters").email("Enter a valid email address"),
  subject: z.string().min(1, "Subject is required").max(70, "Subject must be at most 70 characters"),
  message: z.string().min(1, "Message is required").max(250, "Message must be at most 250 characters"),
});

function Contact() {
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  async function myFormSubmissionFunction(data) {
    setMessage("");
    setIsSubmitting(true);
    try {
      const result = await createContactMessageAxiosFunction(data);
      setMessage({ type: "success", text: result.message });
    } catch (error) {
      setMessage({ type: "error", text: getApiErrorMessage(error, "Unable to send your message.") });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="contact-page">
      <link rel="stylesheet" href="/contact.css" />
      <Link to="/" className="back-btn">← Back to Home</Link>
      <nav className="quicknav" aria-label="Marketplace pages">
        <Link to="/buy">Buy</Link><Link to="/sell">Sell</Link><Link to="/myproducts">My Products</Link><Link to="/complaints">Complaints</Link><Link to="/contact">Contact</Link>
      </nav>
      <h1>Contact Us</h1>
      <form className="standard-form" id="contactForm" onSubmit={handleSubmit(myFormSubmissionFunction)}>
        <label htmlFor="cname">Name:</label><input type="text" id="cname" maxLength="70" {...register("name")} />
        {errors.name && <span className="text-danger">{errors.name.message}</span>}
        <label htmlFor="cemail">Email:</label><input type="email" id="cemail" maxLength="70" {...register("email")} />
        {errors.email && <span className="text-danger">{errors.email.message}</span>}
        <label htmlFor="csubject">Subject:</label><input type="text" id="csubject" maxLength="70" {...register("subject")} />
        {errors.subject && <span className="text-danger">{errors.subject.message}</span>}
        <label htmlFor="cmessage">Message:</label><textarea id="cmessage" rows="5" maxLength="250" {...register("message")} />
        {errors.message && <span className="text-danger">{errors.message.message}</span>}
        <input type="submit" value={isSubmitting ? "Sending..." : "Send Message"} disabled={isSubmitting} />
      </form>
      {message && (
        <p className={message.type === "error" ? "text-danger" : "helper-link"} role={message.type === "error" ? "alert" : "status"}>
          {message.text}
        </p>
      )}
      <p className="helper-link">Have an issue instead of a question? <Link to="/complaints">File a complaint →</Link></p>
    </main>
  );
}

export default Contact;
