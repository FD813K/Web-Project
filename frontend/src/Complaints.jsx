import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import {
  createComplaintAxiosFunction,
  getApiErrorMessage,
  getComplaintStatusAxiosFunction,
} from "./Service/api.js";

const complaintSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(70, "Subject must be at most 70 characters"),
  message: z.string().min(1, "Details are required").max(250, "Details must be at most 250 characters"),
});

export default function Complaints() {
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [complaintId, setComplaintId] = useState("");
  const [trackedComplaint, setTrackedComplaint] = useState(null);
  const [trackingMessage, setTrackingMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(complaintSchema),
  });

  async function myFormSubmissionFunction(data) {
    setMessage("");
    setIsSubmitting(true);
    try {
      const result = await createComplaintAxiosFunction(data);
      setMessage({ type: "success", text: `${result.message}. Complaint ID: ${result.complaint.complaintId}` });
      setComplaintId(String(result.complaint.complaintId));
    } catch (error) {
      setMessage({ type: "error", text: getApiErrorMessage(error, "Unable to save the complaint.") });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function trackComplaint(event) {
    event.preventDefault();
    setTrackingMessage("");
    setTrackedComplaint(null);
    try {
      setTrackedComplaint(await getComplaintStatusAxiosFunction(complaintId));
    } catch (error) {
      setTrackingMessage(getApiErrorMessage(error, "Unable to load complaint status."));
    }
  }

  return <main><link rel="stylesheet" href="/complaints.css" />

    <Link to="/" className="back-btn">← Back to Home</Link>

    <nav className="quicknav">
        <Link to="/buy">Buy</Link>
        <Link to="/sell">Sell</Link>
        <Link to="/myproducts">My Products</Link>
        <Link to="/complaints">Complaints</Link>
        <Link to="/contact">Contact</Link>
    </nav>

    <h1>Complaints</h1>

    <form onSubmit={handleSubmit(myFormSubmissionFunction)} id="complaintForm">

        <label htmlFor="subject">
            Subject:
        </label>
        <input type="text" id="subject" maxLength="70" {...register("subject")} />
        {errors.subject && <span className="text-danger">{errors.subject.message}</span>}

        <label htmlFor="message">
            Details:
        </label>
        <textarea id="message" rows="4" maxLength="250" {...register("message")}></textarea>
        {errors.message && <span className="text-danger">{errors.message.message}</span>}

        <input type="submit" value={isSubmitting ? "Submitting..." : "Submit Complaint"} disabled={isSubmitting} />

        {message && (
          <p
            id="complaintMsg"
            className={message.type === "error" ? "text-danger" : "success-msg"}
            role={message.type === "error" ? "alert" : "status"}
          >
            {message.text}
          </p>
        )}

    </form>

    <h2 className="list-heading">Track & Manage Complaints</h2>

    <div id="complaintList" className="product-grid">
      <form onSubmit={trackComplaint}>
        <label htmlFor="complaint-tracking-id">Complaint ID:</label>
        <input
          id="complaint-tracking-id"
          type="number"
          min="1"
          value={complaintId}
          onChange={(event) => setComplaintId(event.target.value)}
          required
        />
        <button type="submit">Check status</button>
      </form>
      {trackingMessage && <p className="text-danger" role="alert">{trackingMessage}</p>}
      {trackedComplaint && (
        <p role="status">
          Complaint {trackedComplaint.complaintId}: {trackedComplaint.status}
          {trackedComplaint.reply ? ` — ${trackedComplaint.reply}` : ""}
        </p>
      )}
    </div>

    
</main>;
}
