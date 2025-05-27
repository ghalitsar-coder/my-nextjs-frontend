import ProductDetailPage from "@/app/components/product-detail/ProductDetailPage";

interface ProductPageParams {
  params: {
    id: string;
  };
}

export default function ProductDetailById({ params }: ProductPageParams) {
  return <ProductDetailPage productId={params.id} />;
}
