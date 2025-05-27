"use client";

export default function PromotionalBanner() {
  return (
    <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl p-6 text-white mb-8 flex flex-col md:flex-row justify-between items-center">
      <div className="mb-4 md:mb-0">
        <h3 className="text-xl md:text-2xl font-bold mb-2">
          Happy Hour Special!
        </h3>
        <p className="text-amber-100">
          2-5PM Weekdays • 25% off all iced beverages
        </p>
      </div>
      <div className="flex items-center">
        <div className="bg-white text-amber-700 px-4 py-1 rounded-full text-sm font-bold mr-3">
          PROMO: HAPPYHOUR25
        </div>
        <button className="bg-white text-amber-700 hover:bg-amber-50 px-4 py-2 rounded-full font-medium transition">
          View Details
        </button>
      </div>
    </div>
  );
}
