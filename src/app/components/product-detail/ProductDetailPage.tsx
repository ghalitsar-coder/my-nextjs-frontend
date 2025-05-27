"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductTabs from "./ProductTabs";
import RelatedProducts from "./RelatedProducts";
import Breadcrumb from "./Breadcrumb";
import { Product, RelatedProduct } from "./types";

interface ProductDetailPageProps {
  productId?: string; // Optional: can be passed from route or fetched based on context
}

export default function ProductDetailPage({
  productId,
}: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Fetch product details
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would be an API call
        // For now, mock the data
        setTimeout(() => {
          setProduct({
            id: productId || "1",
            name: "Ethiopian Yirgacheffe",
            price: 14.5,
            sizes: [
              { id: 1, name: "8oz", price: 12.5 },
              { id: 2, name: "12oz", price: 14.5, default: true },
              { id: 3, name: "16oz", price: 16.5 },
            ],
            grindOptions: [
              { id: 1, name: "Whole Bean" },
              { id: 2, name: "Coarse Grind" },
              { id: 3, name: "Medium Grind" },
              { id: 4, name: "Fine Grind", default: true },
            ],
            description:
              "A delicate and floral single-origin coffee from the birthplace of coffee. Our Yirgacheffe features bright citrus notes, subtle jasmine aroma, and a clean, tea-like body. Grown at high altitude by smallholder farmers in Ethiopia's Sidamo region.",
            rating: 4.7,
            reviewCount: 48,
            images: [
              {
                id: 1,
                url: "https://images.unsplash.com/photo-1517705008128-361805f42e86?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
                alt: "Ethiopian Yirgacheffe Coffee",
              },
              {
                id: 2,
                url: "https://images.unsplash.com/photo-1524350876685-274059332603?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
                alt: "Coffee Beans",
              },
              {
                id: 3,
                url: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
                alt: "Coffee Farm",
              },
              {
                id: 4,
                url: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
                alt: "Coffee Preparation",
              },
            ],
            stockCount: 23,
            attributes: {
              region: "Yirgacheffe, Ethiopia",
              altitude: "1,800-2,200m",
              process: "Washed",
              varietal: "Heirloom",
              roastLevel: "Light",
              bestFor: "Pour Over, Chemex, Aeropress",
            },
            detailedDescription: [
              "Our Ethiopian Yirgacheffe is a quintessential representation of the floral, citrusy coffees that Ethiopia is famous for. Grown by smallholder farmers in the Yirgacheffe region, this coffee undergoes careful wet-processing to accentuate its delicate fruit characteristics while maintaining clarity and balance.",
              "When brewed, expect a cup bursting with bright notes of bergamot and lemon zest, complemented by a fragrant jasmine-like aroma and a clean, tea-like body. The finish is crisp with a lingering, honeyed sweetness.",
              "Roasted lighter to preserve its delicate floral notes and vibrant acidity, this coffee is perfect for those who enjoy nuanced, tea-like specialty coffees.",
            ],
            sustainability:
              "This coffee comes from our direct trade partnership with a women's cooperative in Yirgacheffe. We pay 45% above fair trade minimum prices and support community education initiatives.",
            tastingNotes: [
              "Citrus",
              "Jasmine",
              "Bergamot",
              "Tea-like",
              "Bright",
            ],
          });

          setRelatedProducts([
            {
              id: "2",
              name: "Espresso Blend",
              description: "Dark & Chocolatey",
              price: 16.0,
              image:
                "https://images.unsplash.com/photo-1495474477027-9001d6c9f890?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
              badge: "Best Seller",
            },
            {
              id: "3",
              name: "Colombian Huila",
              description: "Sweet & Balanced",
              price: 15.5,
              image:
                "https://images.unsplash.com/photo-1511920170033-f8396924c348?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            },
            {
              id: "4",
              name: "Guatemalan Antigua",
              description: "Rich & Complex",
              price: 17.0,
              image:
                "https://images.unsplash.com/photo-1580996877935-e5989a61044e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
              badge: "New Arrival",
            },
            {
              id: "5",
              name: "Costa Rican Tarrazu",
              description: "Bright & Juicy",
              price: 16.25,
              image:
                "https://images.unsplash.com/photo-1580596446198-7ec96685b0a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            },
          ]);
          setLoading(false);
        }, 500); // Simulate API delay
      } catch (err) {
        setError("Failed to load product. Please try again.");
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9c7c5b]"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] flex-col">
        <p className="text-xl text-gray-800 mb-4">
          {error || "Product not found"}
        </p>
        <button
          onClick={() => router.back()}
          className="bg-[#9c7c5b] hover:bg-[#8a6b4d] text-white px-6 py-2 rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <main className="pt-28 pb-16 max-w-7xl mx-auto px-6 lg:px-8">
      {/* Breadcrumb */}
      <Breadcrumb productName={product.name} />

      {/* Product Detail Section */}
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Product Images */}
        <div className="lg:w-1/2">
          <ProductGallery images={product.images} />
        </div>

        {/* Product Information */}
        <div className="lg:w-1/2">
          <ProductInfo product={product} />
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-16">
        <ProductTabs product={product} />
      </div>

      {/* Related Products */}
      <div className="mt-20">
        <RelatedProducts products={relatedProducts} />
      </div>
    </main>
  );
}
