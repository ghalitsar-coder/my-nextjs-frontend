"use client";

import { ReactNode } from "react";
import CartSidebar from "./CartSidebar";

interface CartProviderProps {
  children: ReactNode;
}

export default function CartProvider({ children }: CartProviderProps) {
  return (
    <>
      {children}
      <CartSidebar />
    </>
  );
}
