"use client";

interface CategoryTabsProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  categories: string[];
}

export default function CategoryTabs({
  activeCategory,
  setActiveCategory,
  categories,
}: CategoryTabsProps) {
  return (
    <div className="flex overflow-x-auto pb-4 mb-8 space-x-2 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category}
          className={`category-tab whitespace-nowrap px-6 py-2 font-medium rounded-full transition ${
            activeCategory === category
              ? "active bg-purple-700 text-white"
              : "bg-white"
          }`}
          onClick={() => setActiveCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
