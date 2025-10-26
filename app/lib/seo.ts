// lib/seo.ts - SEO Configuration and Utilities

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
  twitterCard?: "summary" | "summary_large_image";
  noIndex?: boolean;
  structuredData?: any;
}

export const defaultSEO: SEOConfig = {
  title: "Meghkala - Handcrafted Art & Home Decor | Premium Indian Handicrafts",
  description:
    "Discover exquisite handcrafted art pieces, home decor, and traditional Indian handicrafts at Meghkala. Premium quality, authentic craftsmanship, and unique designs for your home.",
  keywords: [
    "handcrafted art",
    "Indian handicrafts",
    "home decor",
    "traditional art",
    "premium handicrafts",
    "art pieces",
    "decorative items",
    "handmade products",
    "Indian art",
    "cultural artifacts",
  ],
  ogType: "website",
  twitterCard: "summary_large_image",
  ogImage: "/og-image.jpg",
};

export function generateSEO(config: SEOConfig): SEOConfig {
  return {
    ...defaultSEO,
    ...config,
    title: config.title ? `${config.title} | Meghkala` : defaultSEO.title,
  };
}

// Product-specific SEO
export function generateProductSEO(product: any): SEOConfig {
  const title = `${product.title} - Handcrafted ${
    product.category?.name || "Art Piece"
  } | Meghkala`;
  const description = `${product.description.substring(
    0,
    155
  )}... Shop this unique handcrafted piece at Meghkala. Premium quality, authentic craftsmanship.`;

  return generateSEO({
    title,
    description,
    keywords: [
      product.title,
      product.category?.name,
      product.subcategory?.name,
      "handcrafted",
      "art piece",
      "home decor",
      "Indian handicrafts",
    ].filter(Boolean),
    ogType: "product",
    ogImage: product.images?.[0] || defaultSEO.ogImage,
    structuredData: generateProductStructuredData(product),
  });
}

// Category-specific SEO
export function generateCategorySEO(category: any): SEOConfig {
  const title = `${category.name} Collection - Handcrafted ${category.name} | Meghkala`;
  const description = `Explore our curated collection of ${category.name.toLowerCase()}. Premium handcrafted pieces with authentic Indian craftsmanship. Shop now at Meghkala.`;

  return generateSEO({
    title,
    description,
    keywords: [
      category.name,
      `${category.name} collection`,
      "handcrafted",
      "Indian handicrafts",
      "home decor",
      "art pieces",
    ],
    ogImage: category.image || defaultSEO.ogImage,
  });
}

// Generate JSON-LD structured data for products
export function generateProductStructuredData(product: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images || [],
    brand: {
      "@type": "Brand",
      name: "Meghkala",
    },
    category: product.category?.name,
    offers: {
      "@type": "Offer",
      price: product.finalPrice || product.price,
      priceCurrency: "INR",
      availability:
        product.availability === "in_stock"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Meghkala",
      },
    },
    aggregateRating: product.averageRating
      ? {
          "@type": "AggregateRating",
          ratingValue: product.averageRating,
          reviewCount: product.totalReviews || 0,
        }
      : undefined,
    sku: product.sku,
    weight: product.weight
      ? {
          "@type": "QuantitativeValue",
          value: product.weight,
          unitCode: "KGM",
        }
      : undefined,
  };
}

// Generate organization structured data
export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Meghkala",
    description:
      "Premium handcrafted art pieces and home decor from authentic Indian artisans",
    url: "https://meghkala.com",
    logo: "https://meghkala.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-XXXX-XXXXXX",
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
    sameAs: [
      "https://www.instagram.com/meghkala",
     
    ],
  };
}

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://meghkala.com${item.url}`,
    })),
  };
}

// Generate FAQ structured data
export function generateFAQStructuredData(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Generate collection structured data
export function generateCollectionStructuredData(
  products: any[],
  categoryName: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${categoryName} Collection`,
    description: `Handcrafted ${categoryName.toLowerCase()} collection at Meghkala`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product.title,
          url: `https://meghkala.com/products/${product._id}`,
          image: product.images?.[0],
          offers: {
            "@type": "Offer",
            price: product.finalPrice || product.price,
            priceCurrency: "INR",
          },
        },
      })),
    },
  };
}
