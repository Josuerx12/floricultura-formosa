import { getAllCategoriesWithoutPagination } from "@/lib/actions/category";
import { getAllProducts } from "@/lib/actions/products";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const nextUrl = request.nextUrl;
  const baseUrl = nextUrl.origin;

  const products = await getAllProducts();

  const categories = await getAllCategoriesWithoutPagination();

  const staticUrls = [
    "",
    "/termos-de-uso",
    "/politica-de-privacidade",
    "/politica-de-reembolso",
    "/rastreio",
  ];

  const productsUrl = products.map((p) => `/produto/${p.slug}`);

  const categoriesUrl = categories.map((c) => `/produtos/${c.slug}`);

  const allUrls = [...staticUrls, ...productsUrl, ...categoriesUrl];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
    .map(
      (url) => `
    <url>
      <loc>${baseUrl}${url}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  `
    )
    .join("")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
