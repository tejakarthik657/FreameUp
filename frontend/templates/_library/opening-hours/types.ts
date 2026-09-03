export interface HoursRow {
  label: string;
  value: string;
  highlighted?: boolean;
}

export interface OpeningHoursVariantProps {
  heading: string;
  rows: HoursRow[];
}