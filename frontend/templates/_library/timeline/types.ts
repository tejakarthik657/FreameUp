export interface TimelineEvent {
  year: string;
  label: string;
}

export interface TimelineVariantProps {
  heading?: string;
  events: TimelineEvent[];
}