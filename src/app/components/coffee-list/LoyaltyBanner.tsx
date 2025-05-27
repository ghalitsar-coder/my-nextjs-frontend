"use client";

export default function LoyaltyBanner() {
  return (
    <section className="bg-gradient-to-r from-amber-800 to-amber-900 text-white py-8 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">Brew Rewards</h3>
            <p className="text-amber-200">
              Earn points with every purchase and get free drinks!
            </p>
          </div>
          <button className="bg-white text-amber-800 hover:bg-amber-100 px-6 py-2 rounded-full font-bold transition">
            Join Now
          </button>
        </div>
      </div>
    </section>
  );
}
