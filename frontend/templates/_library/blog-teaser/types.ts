export interface BlogTeaserPost {
  title: string;
  date?: string;
  imageUrl?: string;
  eyebrow?: string;
}

export interface BlogTeaserVariantProps {
  heading: string;
  posts: BlogTeaserPost[];
  description?: string;
}