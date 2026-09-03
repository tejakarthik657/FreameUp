export interface MenuItem {
  name: string;
  price: string;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export interface MenuServicesVariantProps {
  heading: string;
  categories: MenuCategory[];
}