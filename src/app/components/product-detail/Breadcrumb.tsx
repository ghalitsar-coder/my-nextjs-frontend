"use client";

import Link from "next/link";

interface BreadcrumbProps {
  productName: string;
}

export default function Breadcrumb({ productName }: BreadcrumbProps) {
  return (
    <div className="flex items-center text-sm text-gray-500 mb-8">
      <Link href="/" className="hover:text-[#9c7c5b] transition">
        Home
      </Link>
      <i className="fas fa-chevron-right mx-2 text-xs"></i>
      <Link href="/coffee-list" className="hover:text-[#9c7c5b] transition">
        Menu
      </Link>
      <i className="fas fa-chevron-right mx-2 text-xs"></i>
      <span className="text-[#9c7c5b]">{productName}</span>
    </div>
  );
}
