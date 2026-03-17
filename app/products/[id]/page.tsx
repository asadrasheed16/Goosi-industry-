// app/products/[id]/page.tsx
import { notFound } from 'next/navigation';
import { getProductById, getProducts } from '@/lib/actions';
import ProductDetailClient from './ProductDetailClient';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: [product.images?.[0]] },
  };
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, related] = await Promise.all([
    getProductById(params.id),
    getProducts({ category: 'cricket' }).then(p => p.slice(0, 4)).catch(() => []),
  ]);
  if (!product) notFound();
  return <ProductDetailClient product={product} relatedProducts={related} />;
}
