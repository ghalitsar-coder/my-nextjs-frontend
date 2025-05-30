"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductTabs from "./ProductTabs";
import RelatedProducts from "./RelatedProducts";
import Breadcrumb from "./Breadcrumb";
import { Product, RelatedProduct, BackendProduct } from "./types";

interface ProductDetailPageProps {
  productId?: string;
}

// Helper functions moved outside component to avoid useEffect dependency issues
const generateDefaultSizes = (basePrice: number) => [
  { id: 1, name: "8oz", price: basePrice * 0.85 },
  { id: 2, name: "12oz", price: basePrice, default: true },
  { id: 3, name: "16oz", price: basePrice * 1.15 },
];

const generateDefaultGrindOptions = () => [
  { id: 1, name: "Whole Bean" },
  { id: 2, name: "Coarse Grind" },
  { id: 3, name: "Medium Grind", default: true },
  { id: 4, name: "Fine Grind" },
];

const generateDefaultImages = (categoryName: string, productName: string) => [
  {
    id: 1,
    url: getDefaultImage(categoryName),
    alt: productName,
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
];

const generateDefaultAttributes = (categoryName: string) => {
  const attributeMap: { [key: string]: { [key: string]: string } } = {
    Coffee: {
      origin: "Single Origin",
      roastLevel: "Medium",
      process: "Washed",
      altitude: "1,200-1,800m",
      varietal: "Arabica",
      bestFor: "Pour Over, French Press, Espresso",
    },
    Tea: {
      type: "Premium Tea",
      origin: "High Altitude",
      process: "Traditional",
      caffeine: "Moderate",
      bestFor: "Hot or Iced",
      steepTime: "3-5 minutes",
    },
    Pastry: {
      type: "Fresh Baked",
      ingredients: "Premium Quality",
      texture: "Light & Fluffy",
      sweetness: "Balanced",
      bestWith: "Coffee or Tea",
      freshness: "Daily Baked",
    },
  };

  return (
    attributeMap[categoryName] || {
      quality: "Premium",
      origin: "Carefully Selected",
      preparation: "Artisan Made",
      bestFor: "Any Time",
    }
  );
};

const generateTastingNotes = (categoryName: string) => {
  const notesMap: { [key: string]: string[] } = {
    Coffee: ["Rich", "Smooth", "Aromatic", "Balanced", "Full-bodied"],
    Tea: ["Delicate", "Refreshing", "Floral", "Crisp", "Soothing"],
    Pastry: ["Sweet", "Buttery", "Fresh", "Light", "Indulgent"],
    Sandwich: ["Savory", "Fresh", "Hearty", "Satisfying", "Balanced"],
    Merchandise: ["Quality", "Durable", "Stylish", "Functional", "Premium"],
  };

  return (
    notesMap[categoryName] || ["Quality", "Premium", "Crafted", "Excellence"]
  );
};

// Get default image based on category
const getDefaultImage = (categoryName: string): string => {
  const imageMap: { [key: string]: string } = {
    Coffee:
      "https://images.unsplash.com/photo-1522992319-0365e5f11656?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    Tea: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    Pastry:
      "https://images.unsplash.com/photo-1555507036-ab794f4afe5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    Sandwich:
      "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    Merchandise:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
  };
  return imageMap[categoryName] || imageMap.Coffee;
};

// Helper function to convert backend product to frontend format
const convertBackendToFrontend = (backendProduct: BackendProduct): Product => {
  return {
    id: backendProduct.productId.toString(),
    name: backendProduct.name,
    price: backendProduct.price,
    sizes: generateDefaultSizes(backendProduct.price),
    grindOptions: generateDefaultGrindOptions(),
    description:
      backendProduct.description || "Delicious coffee crafted with care",
    rating: 4.5 + Math.random() * 0.5, // Random rating for demo
    reviewCount: Math.floor(Math.random() * 50) + 10, // Random review count
    images: generateDefaultImages(
      backendProduct.category.name,
      backendProduct.name
    ),
    stockCount: backendProduct.stock,
    attributes: generateDefaultAttributes(backendProduct.category.name),
    detailedDescription: [
      backendProduct.description ||
        "Our carefully selected coffee beans are roasted to perfection.",
      "Each cup delivers a rich, aromatic experience that coffee enthusiasts will appreciate.",
      "Perfect for any time of day, whether you're starting your morning or enjoying an afternoon break.",
    ],
    sustainability:
      "This coffee comes from our direct trade partnerships with local farmers. We pay fair prices and support community development initiatives.",
    tastingNotes: generateTastingNotes(backendProduct.category.name),
    category: backendProduct.category,
    isAvailable: backendProduct.isAvailable,
  };
};

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
      if (!productId) {
        setError("Product ID is required");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch product from backend
        const response = await fetch(
          `http://localhost:8080/api/products/${productId}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            setError("Product not found");
          } else {
            setError("Failed to load product details");
          }
          setLoading(false);
          return;
        }

        const backendProduct: BackendProduct = await response.json();

        // Convert backend product to frontend format
        const convertedProduct: Product =
          convertBackendToFrontend(backendProduct);
        setProduct(convertedProduct); // Fetch related products (same category, excluding current product)
        const relatedResponse = await fetch(
          "http://localhost:8080/api/products/available"
        );
        if (relatedResponse.ok) {
          const allProducts: BackendProduct[] = await relatedResponse.json();
          const related = allProducts
            .filter(
              (p) =>
                p.category.name === backendProduct.category.name &&
                p.productId !== backendProduct.productId
            )
            .slice(0, 4) // Limit to 4 related products
            .map((p) => ({
              id: p.productId.toString(),
              name: p.name,
              description:
                p.description || "Delicious coffee crafted with care",
              price: p.price,
              image: getDefaultImage(p.category.name),
            }));
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  // Helper function to convert backend product to frontend format
  const convertBackendToFrontend = (
    backendProduct: BackendProduct
  ): Product => {
    return {
      id: backendProduct.productId.toString(),
      name: backendProduct.name,
      price: backendProduct.price,
      sizes: generateDefaultSizes(backendProduct.price),
      grindOptions: generateDefaultGrindOptions(),
      description:
        backendProduct.description || "Delicious coffee crafted with care",
      rating: 4.5 + Math.random() * 0.5, // Random rating for demo
      reviewCount: Math.floor(Math.random() * 50) + 10, // Random review count
      images: generateDefaultImages(
        backendProduct.category.name,
        backendProduct.name
      ),
      stockCount: backendProduct.stock,
      attributes: generateDefaultAttributes(backendProduct.category.name),
      detailedDescription: [
        backendProduct.description ||
          "Our carefully selected coffee beans are roasted to perfection.",
        "Each cup delivers a rich, aromatic experience that coffee enthusiasts will appreciate.",
        "Perfect for any time of day, whether you're starting your morning or enjoying an afternoon break.",
      ],
      sustainability:
        "This coffee comes from our direct trade partnerships with local farmers. We pay fair prices and support community development initiatives.",
      tastingNotes: generateTastingNotes(backendProduct.category.name),
      category: backendProduct.category,
      isAvailable: backendProduct.isAvailable,
    };
  };

  // Helper functions to generate default values
  const generateDefaultSizes = (basePrice: number) => [
    { id: 1, name: "8oz", price: basePrice * 0.85 },
    { id: 2, name: "12oz", price: basePrice, default: true },
    { id: 3, name: "16oz", price: basePrice * 1.15 },
  ];

  const generateDefaultGrindOptions = () => [
    { id: 1, name: "Whole Bean" },
    { id: 2, name: "Coarse Grind" },
    { id: 3, name: "Medium Grind", default: true },
    { id: 4, name: "Fine Grind" },
  ];

  const generateDefaultImages = (categoryName: string, productName: string) => [
    {
      id: 1,
      url: getDefaultImage(categoryName),
      alt: productName,
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
  ];

  const generateDefaultAttributes = (categoryName: string) => {
    const attributeMap: { [key: string]: any } = {
      Coffee: {
        origin: "Single Origin",
        roastLevel: "Medium",
        process: "Washed",
        altitude: "1,200-1,800m",
        varietal: "Arabica",
        bestFor: "Pour Over, French Press, Espresso",
      },
      Tea: {
        type: "Premium Tea",
        origin: "High Altitude",
        process: "Traditional",
        caffeine: "Moderate",
        bestFor: "Hot or Iced",
        steepTime: "3-5 minutes",
      },
      Pastry: {
        type: "Fresh Baked",
        ingredients: "Premium Quality",
        texture: "Light & Fluffy",
        sweetness: "Balanced",
        bestWith: "Coffee or Tea",
        freshness: "Daily Baked",
      },
    };

    return (
      attributeMap[categoryName] || {
        quality: "Premium",
        origin: "Carefully Selected",
        preparation: "Artisan Made",
        bestFor: "Any Time",
      }
    );
  };

  const generateTastingNotes = (categoryName: string) => {
    const notesMap: { [key: string]: string[] } = {
      Coffee: ["Rich", "Smooth", "Aromatic", "Balanced", "Full-bodied"],
      Tea: ["Delicate", "Refreshing", "Floral", "Crisp", "Soothing"],
      Pastry: ["Sweet", "Buttery", "Fresh", "Light", "Indulgent"],
      Sandwich: ["Savory", "Fresh", "Hearty", "Satisfying", "Balanced"],
      Merchandise: ["Quality", "Durable", "Stylish", "Functional", "Premium"],
    };

    return (
      notesMap[categoryName] || ["Quality", "Premium", "Crafted", "Excellence"]
    );
  };

  // Get default image based on category
  const getDefaultImage = (categoryName: string): string => {
    const imageMap: { [key: string]: string } = {
      Coffee:
        "https://images.unsplash.com/photo-1522992319-0365e5f11656?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      Tea: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      Pastry:
        "https://images.unsplash.com/photo-1555507036-ab794f4afe5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      Sandwich:
        "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      Merchandise:
        "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    };
    return imageMap[categoryName] || imageMap.Coffee;
  };
  // Format price based on the currency (same as MenuSection)
  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      return `Rp ${price.toLocaleString("id-ID")}`;
    } else {
      return `$${price.toFixed(2)}`;
    }
  };

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
