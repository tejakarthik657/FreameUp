import { redirect } from "next/navigation";

export const metadata = {
  title: "Workshop · DevFrames",
  description: "Pick and customize components for your site before publishing.",
};

export default function WorkshopPage() {
  redirect("/dashboard");
}