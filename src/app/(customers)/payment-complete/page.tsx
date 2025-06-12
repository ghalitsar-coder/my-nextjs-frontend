"use client";

import PaymentCompletePage from "@/app/components/order-flow/PaymentCompletePage";
import { CustomerOnly } from "@/components/role-guard";

export default function PaymentComplete() {
  return (
    <CustomerOnly>
      <PaymentCompletePage />
    </CustomerOnly>
  );
}
