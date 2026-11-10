import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryContent from "@/components/category-content";
import { lookupCategory } from "@/lib/catalog";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const lookup = await lookupCategory(slug);
  const title =
    lookup.status === "found"
      ? lookup.category.name
      : decoded === "chal"
        ? "চাল"
        : decoded;
  return { title: `${title} ক্যাটাগরি` };
}
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const lookup = await lookupCategory(slug);
  if (lookup.status === "not-found") notFound();
  const targetSlug =
    lookup.status === "found" ? lookup.category.slug : decoded;
  return <CategoryContent slug={targetSlug} />;
}
