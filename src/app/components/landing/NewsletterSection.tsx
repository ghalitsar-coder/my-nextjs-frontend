"use client";

import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setMessage("Thank you for subscribing!");
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center rounded-2xl p-12 shadow-inner bg-[#f9f5f0]">
        <h2 className="display-font text-3xl font-bold mb-4">
          Join Our Coffee Club
        </h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Sign up for exclusive offers, new product announcements, and coffee
          education delivered to your inbox.
        </p>

        {message && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
        >
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c08450] focus:border-transparent"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-cta text-white font-semibold px-8 py-3 rounded-full disabled:opacity-50"
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}
