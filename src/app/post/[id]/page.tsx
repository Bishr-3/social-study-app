import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import PostDetailClient from "@/components/PostDetailClient";
import { notFound } from "next/navigation";

interface PostPageProps {
  params: { id: string };
}

// 1. Dynamic SEO Metadata
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!post) return { title: "المشاركة غير موجودة" };

  const description = post.content.substring(0, 160) + "...";
  const url = `https://socialstudyncs.space/post/${post.id}`;

  return {
    title: `${post.title} | فخورون بالإمارات 🇦🇪`,
    description: description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: description,
      url: url,
      siteName: "فخورون بالإمارات",
      images: post.image_url ? [{ url: post.image_url }] : [],
      type: "article",
      locale: "ar_AE",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: description,
      images: post.image_url ? [post.image_url] : [],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!post) {
    notFound();
  }

  // 2. Structured Data (JSON-LD) for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "image": post.image_url ? [post.image_url] : [],
    "datePublished": post.created_at,
    "author": [{
      "@type": "Person",
      "name": post.student_name,
    }],
    "description": post.content.substring(0, 200),
  };

  // 3. Breadcrumb Schema
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "الرئيسية",
        "item": "https://socialstudyncs.space/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": post.title,
        "item": `https://socialstudyncs.space/post/${post.id}`
      }
    ]
  };

  // 4. Video Schema (Conditional)
  const videoLd = post.video_url ? {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": post.title,
    "description": post.content.substring(0, 150),
    "thumbnailUrl": [post.image_url || "https://socialstudyncs.space/logo.png"],
    "uploadDate": post.created_at,
    "contentUrl": post.video_url,
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {videoLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoLd) }}
        />
      )}
      <PostDetailClient initialPost={post} />
    </>
  );
}
