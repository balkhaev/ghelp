import { redirect } from "next/navigation";

export default function AdminIndexPage() {
  redirect("/admin/builds");
  return null;
} 