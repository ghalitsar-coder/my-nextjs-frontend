import ProductDetailPage from "@/app/components/product-detail/ProductDetailPage";

interface ProductPageParams {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailById({ params }: ProductPageParams) {
  const { id } = await params;
  return <ProductDetailPage productId={id} />;
}
