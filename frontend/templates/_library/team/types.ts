export interface TeamMember {
  name: string;
  role?: string;
  imageUrl?: string;
}

export interface TeamVariantProps {
  heading?: string;
  members: TeamMember[];
}