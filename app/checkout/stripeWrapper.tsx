"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckOut from "./checkout";

const stripePromise = loadStripe(
  "pk_test_51SqA2y3NAWtBTsaZuzZ82d2xZLJwbZMstzONsFeif7NDX6PKoIezckFDmjHPJB9COh1sWFNHqTE4ixKio8fpirjz00aoRmPNnA",
);

export default function StripeWrapper() {
  return (
    <Elements stripe={stripePromise}>
      <CheckOut />
    </Elements>
  );
}
