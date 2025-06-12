"use client";

interface HeroSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function HeroSection({
  searchTerm,
  setSearchTerm,
}: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-br from-purple-900 to-amber-800 text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Our Coffee Selection</h1>
        <p className="text-xl mb-8">
          Artfully crafted beverages made with premium beans
        </p>

        <div className="max-w-2xl mx-auto relative">
          <input
            type="text"
            placeholder="Search your favorite drink..."
            className="w-full py-3 px-6 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="absolute right-2 top-2 bg-purple-700 hover:bg-purple-800 text-white py-1 px-4 rounded-full transition">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>
    </section>
  );
}
