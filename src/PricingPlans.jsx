import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import './PricingPlans.css'

const stripePromise = loadStripe("pk_test_51QFipqC5WzPzDwzDLOfPksc6CMtGOSue0KsGRrrIO1hVaqUMghyIGG6q6qMZ2NvhgztGAUK71Ih0N4d5CxMKVK5y00dFmbS4cx"); // replace with your Stripe publishable key

const PricingPlans = () => {
  const handleCheckout = async (priceId) => {
    const stripe = await stripePromise;

    const response = await fetch("http://localhost:4000/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ priceId }),
    });

    const session = await response.json();
    if (session.url) {
      window.location.href = session.url; // Redirect to Stripe Checkout
    }
  };

  return (
    <div className="pricing-container">
      <h2 className="pricing-title">Choose Your Plan</h2>
      <div className="pricing-cards">
        <div className="card">
          <h3>Free Plan</h3>
          <p className="price">$0/month</p>
          <ul className="features">
            <li>Basic Access to Content</li>
            <li>Limited Customization</li>
            <li>Standard Support</li>
          </ul>
          <button className="select-plan-btn">Select Free Plan</button>
        </div>

        <div className="card premium">
          <h3>Premium Plan</h3>
          <p className="price">$9.99/month</p>
          <ul className="features">
            <li>Advanced Customization (Messages & Banners)</li>
            <li>Theme Options</li>
            <li>Content Controls</li>
            <li>Admin Analytics Dashboard</li>
            <li>Priority Support</li>
          </ul>
          <button
            className="select-plan-btn"
            onClick={() => handleCheckout("price_1QFjNRC5WzPzDwzDpwkbHYHt") /* Replace with your Stripe Price ID */}
          >
            Subscribe to Premium
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
