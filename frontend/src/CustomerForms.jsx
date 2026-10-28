import { Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect, useCallback } from "react";

import {
  createOrderAxiosFunction,
  getOrdersAxiosFunction,
  deleteOrderAxiosFunction,
  saveCustomerAccountAxiosFunction,
  createCustomerComplaintAxiosFunction,
  getApiErrorMessage,
} from "./Service/api.js";

// Order form validation
const orderSchema = z.object({
  product: z
    .string()
    .trim()
    .min(1, "Product name is required")
    .max(70, "Product name must be at most 70 characters"),

  quantity: z
    .number({ error: "Enter a quantity" })
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),

  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .max(70, "Address must be at most 70 characters"),
});

// Account form validation
const accountSchema = z.object({
  name: z.string().trim().max(70, "Name is too long"),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(70, "Email must be at most 70 characters"),

  address: z.string().trim().max(70, "Address is too long"),
});

// Complaint form validation
const complaintSchema = z.object({
  subject: z
    .string()
    .trim()
    .min(1, "Subject is required")
    .max(70, "Subject must be at most 70 characters"),

  details: z
    .string()
    .trim()
    .min(1, "Complaint details are required")
    .max(250, "Details must be at most 250 characters"),
});

// Delete order form validation
const deleteOrderSchema = z.object({
  orderNumber: z
    .number({ error: "Enter an order number" })
    .int("Order number must be a whole number")
    .min(1, "Enter a valid order number"),
});

export default function CustomerForms() {
  const location = useLocation();

  const formIds = [
    "customer-orders",
    "customer-account",
    "customer-review",
    "customer-complaint",
    "customer-delete",
  ];

  const selectedId = location.hash.slice(1);

  const activeForm = formIds.includes(selectedId)
    ? selectedId
    : formIds[0];

  const [orders, setOrders] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [orderMessage, setOrderMessage] = useState("");
  const [accountMessage, setAccountMessage] = useState("");
  const [complaintMessage, setComplaintMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");

  // Add order form
  const {
    register: registerOrder,
    handleSubmit: handleSubmitOrder,
    reset: resetOrder,
    formState: { errors: orderErrors },
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      product: "",
      quantity: 1,
      address: "",
    },
  });

  // Account form
  const {
    register: registerAccount,
    handleSubmit: handleSubmitAccount,
    reset: resetAccount,
    formState: { errors: accountErrors },
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
    },
  });

  // Complaint form
  const {
    register: registerComplaint,
    handleSubmit: handleSubmitComplaint,
    reset: resetComplaint,
    formState: { errors: complaintErrors },
  } = useForm({
    resolver: zodResolver(complaintSchema),
  });

  // Delete order form
  const {
    register: registerDeleteOrder,
    handleSubmit: handleSubmitDeleteOrder,
    reset: resetDeleteOrder,
    formState: { errors: deleteOrderErrors },
  } = useForm({
    resolver: zodResolver(deleteOrderSchema),
  });

  // Load orders from MongoDB through the backend
  const loadOrders = useCallback(async () => {
    try {
      const result = await getOrdersAxiosFunction();

      setOrders(Array.isArray(result) ? result : []);
      setReviewMessage("");
    } catch (error) {
      setReviewMessage(
        getApiErrorMessage(error, "Unable to load orders.")
      );
    }
  }, []);

  // Load orders when the Review Orders section is opened
  useEffect(() => {
    if (activeForm === "customer-review") {
      loadOrders();
    }
  }, [activeForm, loadOrders]);

  // Add order
  async function myOrderSubmissionFunction(data) {
    setOrderMessage("");
    setIsSubmitting(true);

    try {
      // Product is free text. It does not need to exist in the catalog.
      const result = await createOrderAxiosFunction(data);

      const orderNumber = result.order?.orderNumber;

      setOrderMessage(
        orderNumber
          ? `${result.message}. Your order number is ${orderNumber}.`
          : result.message || "Order submitted successfully."
      );

      resetOrder();
    } catch (error) {
      setOrderMessage(
        getApiErrorMessage(error, "Unable to place the order.")
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // Update customer account
  async function myAccountSubmissionFunction(data) {
    setAccountMessage("");
    setIsSubmitting(true);

    try {
      const result = await saveCustomerAccountAxiosFunction(data);

      setAccountMessage(
        result.message || "Account details saved successfully."
      );

      resetAccount();
    } catch (error) {
      setAccountMessage(
        getApiErrorMessage(error, "Unable to save account details.")
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // File a complaint
  async function myComplaintSubmissionFunction(data) {
    setComplaintMessage("");
    setIsSubmitting(true);

    try {
      const result = await createCustomerComplaintAxiosFunction(data);

      const complaintId = result.complaint?.complaintId;

      setComplaintMessage(
        complaintId
          ? `${result.message}. Complaint ID: ${complaintId}`
          : result.message || "Complaint submitted successfully."
      );

      resetComplaint();
    } catch (error) {
      setComplaintMessage(
        getApiErrorMessage(error, "Unable to submit the complaint.")
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // Delete or cancel order
  async function myDeleteOrderSubmissionFunction(data) {
    setDeleteMessage("");
    setIsSubmitting(true);

    try {
      const result = await deleteOrderAxiosFunction(
        data.orderNumber
      );

      setDeleteMessage(
        result.message || "Order cancelled successfully."
      );

      resetDeleteOrder();

      // Refresh the order list after cancellation
      await loadOrders();
    } catch (error) {
      setDeleteMessage(
        getApiErrorMessage(error, "Unable to cancel the order.")
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <link rel="stylesheet" href="/stakeholders.css" />

      <Link to="/" className="back-btn">
        ← Back to Home
      </Link>

      <main className="form-panel-page customer-form-page">
        <h1>Customer</h1>

        {/* Navigation between the five original sections */}
        <nav className="form-panel-nav" aria-label="Customer forms">
          <Link
            to="/customer#customer-orders"
            aria-current={
              activeForm === "customer-orders" ? "page" : undefined
            }
          >
            Add order
          </Link>

          <Link
            to="/customer#customer-account"
            aria-current={
              activeForm === "customer-account" ? "page" : undefined
            }
          >
            Update account
          </Link>

          <Link
            to="/customer#customer-review"
            aria-current={
              activeForm === "customer-review" ? "page" : undefined
            }
          >
            Review orders
          </Link>

          <Link
            to="/customer#customer-complaint"
            aria-current={
              activeForm === "customer-complaint" ? "page" : undefined
            }
          >
            File complaint
          </Link>

          <Link
            to="/customer#customer-delete"
            aria-current={
              activeForm === "customer-delete" ? "page" : undefined
            }
          >
            Delete order
          </Link>
        </nav>

        {/* 1. Add Order */}
        <section
          id="customer-orders"
          className={
            activeForm === "customer-orders"
              ? "form-panel active-panel"
              : "form-panel"
          }
        >
          <h2>Insert order</h2>

          <form
            className="simple-form"
            onSubmit={handleSubmitOrder(myOrderSubmissionFunction)}
          >
            <label htmlFor="customer-order-product">
              Product name
            </label>

            <input
              id="customer-order-product"
              type="text"
              placeholder="Enter any product name"
              maxLength="70"
              {...registerOrder("product")}
            />

            {orderErrors.product && (
              <span className="text-danger">
                {orderErrors.product.message}
              </span>
            )}

            <label htmlFor="customer-order-quantity">
              Quantity
            </label>

            <input
              id="customer-order-quantity"
              type="number"
              min="1"
              step="1"
              {...registerOrder("quantity", {
                valueAsNumber: true,
              })}
            />

            {orderErrors.quantity && (
              <span className="text-danger">
                {orderErrors.quantity.message}
              </span>
            )}

            <label htmlFor="customer-order-address">
              Shipping address
            </label>

            <input
              id="customer-order-address"
              type="text"
              placeholder="Enter your address"
              maxLength="70"
              {...registerOrder("address")}
            />

            {orderErrors.address && (
              <span className="text-danger">
                {orderErrors.address.message}
              </span>
            )}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Place order"}
            </button>
          </form>

          {orderMessage && (
            <p role="status">{orderMessage}</p>
          )}
        </section>

        {/* 2. Update Account */}
        <section
          id="customer-account"
          className={
            activeForm === "customer-account"
              ? "form-panel active-panel"
              : "form-panel"
          }
        >
          <h2>Update account</h2>

          <form
            className="simple-form"
            onSubmit={handleSubmitAccount(
              myAccountSubmissionFunction
            )}
          >
            <label htmlFor="customer-account-name">
              Name
            </label>

            <input
              id="customer-account-name"
              type="text"
              maxLength="70"
              {...registerAccount("name")}
            />

            {accountErrors.name && (
              <span className="text-danger">
                {accountErrors.name.message}
              </span>
            )}

            <label htmlFor="customer-account-email">
              Email
            </label>

            <input
              id="customer-account-email"
              type="email"
              maxLength="70"
              {...registerAccount("email")}
            />

            {accountErrors.email && (
              <span className="text-danger">
                {accountErrors.email.message}
              </span>
            )}

            <label htmlFor="customer-account-address">
              Address
            </label>

            <input
              id="customer-account-address"
              type="text"
              maxLength="70"
              {...registerAccount("address")}
            />

            {accountErrors.address && (
              <span className="text-danger">
                {accountErrors.address.message}
              </span>
            )}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save account"}
            </button>
          </form>

          {accountMessage && (
            <p role="status">{accountMessage}</p>
          )}
        </section>

        {/* 3. Review Orders */}
        <section
          id="customer-review"
          className={
            activeForm === "customer-review"
              ? "form-panel active-panel"
              : "form-panel"
          }
        >
          <h2>Review orders</h2>

          <button
            type="button"
            onClick={loadOrders}
          >
            Refresh orders
          </button>

          {reviewMessage && (
            <p role="alert">{reviewMessage}</p>
          )}

          {!reviewMessage && orders.length === 0 && (
            <p>No orders have been placed yet.</p>
          )}

          {orders.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order number</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order.orderNumber}>
                      <td>{order.orderNumber}</td>
                      <td>{order.product}</td>
                      <td>{order.quantity}</td>
                      <td>{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* 4. File Complaint */}
        <section
          id="customer-complaint"
          className={
            activeForm === "customer-complaint"
              ? "form-panel active-panel"
              : "form-panel"
          }
        >
          <h2>File a complaint</h2>

          <form
            className="simple-form"
            onSubmit={handleSubmitComplaint(
              myComplaintSubmissionFunction
            )}
          >
            <label htmlFor="customer-complaint-subject">
              Subject
            </label>

            <input
              id="customer-complaint-subject"
              type="text"
              maxLength="70"
              {...registerComplaint("subject")}
            />

            {complaintErrors.subject && (
              <span className="text-danger">
                {complaintErrors.subject.message}
              </span>
            )}

            <label htmlFor="customer-complaint-details">
              Complaint details
            </label>

            <textarea
              id="customer-complaint-details"
              rows="4"
              maxLength="250"
              {...registerComplaint("details")}
            />

            {complaintErrors.details && (
              <span className="text-danger">
                {complaintErrors.details.message}
              </span>
            )}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Submitting..."
                : "Submit complaint"}
            </button>
          </form>

          {complaintMessage && (
            <p role="status">{complaintMessage}</p>
          )}
        </section>

        {/* 5. Delete Order */}
        <section
          id="customer-delete"
          className={
            activeForm === "customer-delete"
              ? "form-panel active-panel"
              : "form-panel"
          }
        >
          <h2>Delete order</h2>

          <form
            className="simple-form"
            onSubmit={handleSubmitDeleteOrder(
              myDeleteOrderSubmissionFunction
            )}
          >
            <label htmlFor="customer-delete-order-number">
              Order number
            </label>

            <input
              id="customer-delete-order-number"
              type="number"
              min="1"
              step="1"
              {...registerDeleteOrder("orderNumber", {
                valueAsNumber: true,
              })}
            />

            {deleteOrderErrors.orderNumber && (
              <span className="text-danger">
                {deleteOrderErrors.orderNumber.message}
              </span>
            )}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Cancelling..." : "Cancel order"}
            </button>
          </form>

          {deleteMessage && (
            <p role="status">{deleteMessage}</p>
          )}
        </section>
      </main>
    </>
  );
}