import React from "react"
import { AdminLayout } from "@/components/layout/admin-sidebar";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
