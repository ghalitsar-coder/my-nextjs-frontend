"use client";

import { useState } from "react";
import { Product } from "./types";

interface ProductTabsProps {
  product: Product;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<string>("description");

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div id="description-tab" className="tab-content active">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-[#3a3226] mb-4">
                  Coffee Details
                </h3>
                <ul className="space-y-3 text-gray-700">
                  {Object.entries(product.attributes).map(([key, value]) => (
                    <li key={key} className="flex">
                      <span className="w-[120px] font-medium text-[#3a3226] capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}:
                      </span>
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#3a3226] mb-4">
                  Detailed Description
                </h3>
                {product.detailedDescription.map((paragraph, index) => (
                  <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Sustainability Info */}
            <div className="bg-[#f1ece4] rounded-xl p-6 mt-8">
              <div className="flex items-start">
                <i className="fas fa-leaf text-2xl text-[#9c7c5b] mr-4 mt-1"></i>
                <div>
                  <h3 className="font-bold text-lg text-[#3a3226] mb-2">
                    Direct Trade & Sustainability
                  </h3>
                  <p className="text-gray-700">
                    {product.sustainability}
                    <a
                      href="#"
                      className="text-[#9c7c5b] font-medium hover:underline ml-1"
                    >
                      Learn more
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "brewing":
        return (
          <div id="brewing-tab" className="tab-content">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-[#3a3226] mb-4">
                  Brewing Recommendations
                </h3>
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-coffee text-[#9c7c5b] mr-3"></i>
                      <h4 className="font-medium">Pour Over</h4>
                    </div>
                    <ul className="text-sm text-gray-700 space-y-1 ml-8">
                      <li>• Ratio: 1:16 (coffee to water)</li>
                      <li>• Grind: Medium-fine</li>
                      <li>• Water temperature: 200-205°F</li>
                      <li>• Brew time: 2:30-3:00 minutes</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-filter text-[#9c7c5b] mr-3"></i>
                      <h4 className="font-medium">Chemex</h4>
                    </div>
                    <ul className="text-sm text-gray-700 space-y-1 ml-8">
                      <li>• Ratio: 1:15 (coffee to water)</li>
                      <li>• Grind: Medium-coarse</li>
                      <li>• Water temperature: 200°F</li>
                      <li>• Brew time: 3:30-4:00 minutes</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-glass-whiskey text-[#9c7c5b] mr-3"></i>
                      <h4 className="font-medium">AeroPress</h4>
                    </div>
                    <ul className="text-sm text-gray-700 space-y-1 ml-8">
                      <li>• Ratio: 1:12 (coffee to water)</li>
                      <li>• Grind: Fine to medium</li>
                      <li>• Water temperature: 195-200°F</li>
                      <li>• Brew time: 1:30 minutes</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#3a3226] mb-4">
                  Pro Tips
                </h3>
                <div className="bg-white rounded-lg p-5 shadow-sm">
                  <p className="text-gray-700 mb-4">
                    For this delicate Ethiopian coffee, we recommend brewing
                    methods that highlight its floral notes and bright acidity.
                    The lighter the roast, the more these characteristics shine
                    through.
                  </p>
                  <ul className="text-gray-700 space-y-3">
                    <li className="flex">
                      <i className="fas fa-check-circle text-[#9c7c5b] mr-3 mt-1"></i>
                      <span>Use filtered water for a cleaner taste</span>
                    </li>
                    <li className="flex">
                      <i className="fas fa-check-circle text-[#9c7c5b] mr-3 mt-1"></i>
                      <span>
                        Grind just before brewing for maximum freshness
                      </span>
                    </li>
                    <li className="flex">
                      <i className="fas fa-check-circle text-[#9c7c5b] mr-3 mt-1"></i>
                      <span>
                        Let coffee rest 1-2 minutes after brewing to develop
                        flavors
                      </span>
                    </li>
                    <li className="flex">
                      <i className="fas fa-check-circle text-[#9c7c5b] mr-3 mt-1"></i>
                      <span>
                        Store beans in an airtight container away from light
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6">
                  <a
                    href="#"
                    className="block bg-[#f1ece4] rounded-lg p-5 hover:bg-[#e9e1d4] transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <i className="fas fa-play-circle text-2xl text-[#9c7c5b] mr-3"></i>
                        <div>
                          <h4 className="font-medium text-[#3a3226]">
                            Brewing Tutorial
                          </h4>
                          <p className="text-sm text-gray-600">
                            Watch our step-by-step guide
                          </p>
                        </div>
                      </div>
                      <i className="fas fa-chevron-right text-[#9c7c5b]"></i>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        );

      case "origin":
        return (
          <div id="origin-tab" className="tab-content">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-[#3a3226] mb-4">
                  The Birthplace of Coffee
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Ethiopia is widely recognized as the birthplace of coffee,
                  with the coffee plant (Coffea arabica) originating in the
                  forests of the southwestern highlands. Legend has it that
                  coffee was discovered by a goat herder named Kaldi who noticed
                  his goats becoming energetic after eating the berries.
                </p>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Yirgacheffe, located within the Sidamo region, has gained
                  international acclaim for producing some of the world's most
                  distinctive coffees, characterized by their floral,
                  fruit-forward profiles and bright acidity.
                </p>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  The coffee from this particular lot is grown at elevations
                  between 1,800 and 2,200 meters above sea level, where the high
                  altitude and cool temperatures contribute to the slow
                  development of the coffee cherry, allowing for more complex
                  flavors to develop.
                </p>

                <div className="flex items-center space-x-1 text-[#9c7c5b]">
                  <i className="fas fa-map-marker-alt"></i>
                  <span className="text-sm">View on map</span>
                </div>
              </div>

              <div>
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1523271023581-241bb7e92f8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                    alt="Coffee farm in Ethiopia"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Coffee farm in the highlands of Ethiopia
                    </p>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#3a3226] mb-3">
                  Meet the Farmers
                </h3>
                <p className="text-gray-700 mb-4">
                  This coffee is produced by a cooperative of over 650
                  small-scale farmers, primarily women, who cultivate coffee on
                  plots averaging just 1-2 hectares each. Traditional methods
                  are used for cultivation, with coffee growing under native
                  shade trees alongside other crops.
                </p>
                <div className="flex items-center">
                  <img
                    src="https://images.unsplash.com/photo-1577590835286-1cdd24c08fd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                    alt="Ethiopian coffee farmer"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1520333789090-1afc82db536a?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                    alt="Ethiopian coffee farmer"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow -ml-4"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                    alt="Ethiopian coffee farmer"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow -ml-4"
                  />
                  <div className="bg-[#f1ece4] w-12 h-12 rounded-full flex items-center justify-center -ml-4 border-2 border-white shadow">
                    <span className="text-xs text-[#9c7c5b]">+647</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "reviews":
        return (
          <div id="reviews-tab" className="tab-content">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <h3 className="text-lg font-bold text-[#3a3226] mb-4">
                  Customer Ratings
                </h3>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-center flex-col text-center">
                    <div className="text-4xl font-bold text-[#3a3226]">
                      {product.rating}
                    </div>
                    <div className="flex text-[#f8c324] my-2">
                      {Array.from({ length: 5 }).map((_, index) => {
                        const starValue = index + 1;
                        // Full star
                        if (starValue <= product.rating) {
                          return <i key={index} className="fas fa-star"></i>;
                        }
                        // Half star
                        else if (starValue - 0.5 <= product.rating) {
                          return (
                            <i key={index} className="fas fa-star-half-alt"></i>
                          );
                        }
                        // Empty star
                        else {
                          return <i key={index} className="far fa-star"></i>;
                        }
                      })}
                    </div>
                    <p className="text-gray-500 text-sm">
                      Based on {product.reviewCount} reviews
                    </p>
                  </div>

                  <div className="mt-6 space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      // Simulated percentage based on overall rating
                      const percentage = Math.round(
                        100 / (1 + Math.abs(product.rating - rating) * 2)
                      );

                      return (
                        <div key={rating} className="flex items-center">
                          <span className="text-sm text-gray-600 w-8">
                            {rating}
                          </span>
                          <div className="flex items-center ml-2 text-[#f8c324]">
                            <i className="fas fa-star text-xs"></i>
                          </div>
                          <div className="flex-1 mx-3 h-2 rounded-full bg-gray-200 overflow-hidden">
                            <div
                              className="h-full bg-[#9c7c5b]"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {percentage}%
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <button className="w-full mt-6 border border-[#9c7c5b] text-[#9c7c5b] hover:bg-[#f1ece4] font-medium py-2 rounded-lg transition">
                    Write a Review
                  </button>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-[#3a3226]">
                    Customer Reviews
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <select className="text-sm border rounded-lg px-2 py-1 focus:ring-1 focus:ring-[#9c7c5b] focus:border-[#9c7c5b]">
                      <option>Most Recent</option>
                      <option>Highest Rating</option>
                      <option>Lowest Rating</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Review 1 */}
                  <div className="bg-white rounded-lg shadow-sm p-5">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-[#f1ece4] flex items-center justify-center text-[#9c7c5b] font-medium">
                          JS
                        </div>
                        <div className="ml-3">
                          <h4 className="font-medium">Jane Smith</h4>
                          <p className="text-xs text-gray-500">July 15, 2023</p>
                        </div>
                      </div>
                      <div className="flex text-[#f8c324]">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>
                    </div>
                    <h5 className="font-medium mt-3">
                      Exceptional coffee with amazing floral notes
                    </h5>
                    <p className="text-gray-700 mt-2 text-sm">
                      This Ethiopian Yirgacheffe is hands down one of the best
                      coffees I&apos;ve ever brewed at home. The jasmine and
                      citrus notes are incredible in a pour over. Perfectly
                      balanced acidity that isn&apos;t overwhelming. I&apos;ve
                      already ordered it twice!
                    </p>
                  </div>

                  {/* Review 2 */}
                  <div className="bg-white rounded-lg shadow-sm p-5">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-[#f1ece4] flex items-center justify-center text-[#9c7c5b] font-medium">
                          MK
                        </div>
                        <div className="ml-3">
                          <h4 className="font-medium">Michael Kim</h4>
                          <p className="text-xs text-gray-500">June 28, 2023</p>
                        </div>
                      </div>
                      <div className="flex text-[#f8c324]">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="far fa-star"></i>
                      </div>
                    </div>
                    <h5 className="font-medium mt-3">
                      Great coffee, but arrived a bit stale
                    </h5>
                    <p className="text-gray-700 mt-2 text-sm">
                      The flavor profile of this coffee is excellent - bright
                      and aromatic with a nice tea-like quality. Unfortunately,
                      my bag seemed a bit past its prime. I&apos;d recommend
                      ordering when they announce fresh roasts. Still very good
                      quality, just not as vibrant as it could be.
                    </p>
                  </div>

                  {/* Review 3 */}
                  <div className="bg-white rounded-lg shadow-sm p-5">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-[#f1ece4] flex items-center justify-center text-[#9c7c5b] font-medium">
                          AL
                        </div>
                        <div className="ml-3">
                          <h4 className="font-medium">Alex Lee</h4>
                          <p className="text-xs text-gray-500">May 12, 2023</p>
                        </div>
                      </div>
                      <div className="flex text-[#f8c324]">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star-half-alt"></i>
                      </div>
                    </div>
                    <h5 className="font-medium mt-3">
                      Perfect for light roast lovers
                    </h5>
                    <p className="text-gray-700 mt-2 text-sm">
                      If you&apos;re looking for a coffee that exemplifies what
                      Ethiopian beans have to offer, this is it. The floral
                      aromatics hit you as soon as you open the bag. I use it
                      exclusively in my Chemex and it&apos;s always delightful.
                      The bergamot note is especially pronounced.
                    </p>
                  </div>

                  {/* Load More Button */}
                  <div className="text-center">
                    <button className="text-[#9c7c5b] hover:text-[#8a6b4d] font-medium transition">
                      Load More Reviews
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "nutrition":
        return (
          <div id="nutrition-tab" className="tab-content">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-lg font-bold text-[#3a3226] mb-6 text-center">
                Nutrition Information
              </h3>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="border-b pb-4 mb-4">
                  <p className="text-center text-sm text-gray-600 mb-6">
                    Values are based on a standard 8oz (240ml) cup of black
                    coffee.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#f9f7f2] p-4 rounded-lg text-center">
                      <h4 className="text-[#9c7c5b] font-medium mb-1">
                        Calories
                      </h4>
                      <p className="font-bold text-lg">2</p>
                    </div>

                    <div className="bg-[#f9f7f2] p-4 rounded-lg text-center">
                      <h4 className="text-[#9c7c5b] font-medium mb-1">
                        Caffeine
                      </h4>
                      <p className="font-bold text-lg">95mg</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between pb-1 border-b border-gray-100">
                    <span className="text-sm">Total Fat</span>
                    <span className="text-sm font-medium">0g</span>
                  </div>

                  <div className="flex justify-between pb-1 border-b border-gray-100">
                    <span className="text-sm">Sodium</span>
                    <span className="text-sm font-medium">5mg</span>
                  </div>

                  <div className="flex justify-between pb-1 border-b border-gray-100">
                    <span className="text-sm">Total Carbohydrates</span>
                    <span className="text-sm font-medium">0g</span>
                  </div>

                  <div className="flex justify-between pb-1 border-b border-gray-100">
                    <span className="text-sm">Protein</span>
                    <span className="text-sm font-medium">0.3g</span>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-gray-600">
                    * Coffee is primarily water with trace amounts of nutrients.
                    It contains antioxidants and other bioactive compounds that
                    may have health benefits. Caffeine content can vary based on
                    brewing method.
                  </p>
                </div>
              </div>

              <div className="mt-8 bg-[#f1ece4] rounded-lg p-5">
                <div className="flex items-start">
                  <i className="fas fa-info-circle text-xl text-[#9c7c5b] mr-4 mt-1"></i>
                  <div>
                    <h4 className="font-medium mb-2">
                      Note About Coffee and Health
                    </h4>
                    <p className="text-sm text-gray-700">
                      Our Ethiopian Yirgacheffe is free from additives and
                      preservatives. The caffeine content may vary slightly
                      depending on brewing method. If you have health concerns
                      or questions, we recommend consulting with a healthcare
                      professional regarding your coffee consumption.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 md:space-x-10 overflow-x-auto scrollbar-custom">
          <button
            className={`tab-button py-4 px-1 font-medium text-sm focus:outline-none whitespace-nowrap ${
              activeTab === "description" ? "active" : ""
            }`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button
            className={`tab-button py-4 px-1 font-medium text-sm focus:outline-none whitespace-nowrap ${
              activeTab === "brewing" ? "active" : ""
            }`}
            onClick={() => setActiveTab("brewing")}
          >
            Brewing Guide
          </button>
          <button
            className={`tab-button py-4 px-1 font-medium text-sm focus:outline-none whitespace-nowrap ${
              activeTab === "origin" ? "active" : ""
            }`}
            onClick={() => setActiveTab("origin")}
          >
            Origin Story
          </button>
          <button
            className={`tab-button py-4 px-1 font-medium text-sm focus:outline-none whitespace-nowrap ${
              activeTab === "reviews" ? "active" : ""
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews ({product.reviewCount})
          </button>
          <button
            className={`tab-button py-4 px-1 font-medium text-sm focus:outline-none whitespace-nowrap ${
              activeTab === "nutrition" ? "active" : ""
            }`}
            onClick={() => setActiveTab("nutrition")}
          >
            Nutrition
          </button>
        </nav>
      </div>

      <div className="mt-8">{renderTabContent()}</div>
    </>
  );
}
