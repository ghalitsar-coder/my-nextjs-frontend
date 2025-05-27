"use client";

import { useState } from "react";

interface MenuItem {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
  rating: number;
  category: string;
}

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState("Hot Coffee");

  const categories = ["Hot Coffee", "Cold Brew", "Espresso", "Tea", "Pastries"];

  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: "Classic Espresso",
      price: "$3.75",
      description: "Bold, concentrated coffee shot with rich crema",
      image:
        "https://images.unsplash.com/photo-1522992319-0365e5f11656?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      rating: 4.5,
      category: "Hot Coffee",
    },
    {
      id: 2,
      name: "Caramel Macchiato",
      price: "$4.95",
      description: "Espresso with vanilla, steamed milk & caramel drizzle",
      image:
        "https://images.unsplash.com/photo-1534778101976-6fa2976c6ae1?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      rating: 5.0,
      category: "Hot Coffee",
    },
    {
      id: 3,
      name: "Iced Mocha",
      price: "$5.25",
      description: "Chocolate, espresso & milk over ice, topped with cream",
      image:
        "https://images.unsplash.com/photo-1596079890744-c1a0462d1605?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      rating: 4.5,
      category: "Cold Brew",
    },
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }

    return stars;
  };

  const filteredItems = menuItems.filter((item) =>
    activeCategory === "Hot Coffee" ? true : item.category === activeCategory
  );

  return (
    <section id="menu" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="display-font text-4xl font-bold mb-4">
            Our Signature Creations
          </h2>
          <div className="w-24 h-1 gradient-bg rounded-full mx-auto animate-gradient"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            Each cup is meticulously prepared by our trained baristas using the
            finest ingredients.
          </p>
        </div>

        {/* Menu Categories */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-lg bg-gray-100 p-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                  activeCategory === category
                    ? "bg-white shadow-sm text-gray-900"
                    : "hover:bg-gray-200 text-gray-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="menu-item bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-gray-100 p-5"
            >
              <div className="h-56 rounded-xl overflow-hidden flex items-center justify-center bg-gray-50">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="pt-5">
                <div className="flex justify-between">
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <span className="text-[#c08450] font-bold">{item.price}</span>
                </div>
                <p className="text-gray-600 mt-2 text-sm">{item.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex space-x-1 text-amber-400">
                    {renderStars(item.rating)}
                  </div>
                  <button className="text-[#c08450] hover:text-[#9a6c3e]">
                    <i className="fas fa-plus-circle text-xl"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#"
            className="inline-flex items-center text-[#c08450] hover:text-[#9a6c3e] font-medium transition"
          >
            View Full Menu
            <i className="fas fa-chevron-right ml-2"></i>
          </a>
        </div>
      </div>
    </section>
  );
}
