import { NextRequest, NextResponse } from "next/server";

const midtransClient = require("midtrans-client");

// Initialize Midtrans Snap
const snap = new midtransClient.Snap({
  isProduction: false, // Set to true for production
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { transaction_details, customer_details, item_details } = body;

    // Validate required fields
    if (!transaction_details?.order_id || !transaction_details?.gross_amount) {
      return NextResponse.json(
        { error: "Missing required transaction details" },
        { status: 400 }
      );
    }

    if (!item_details || item_details.length === 0) {
      return NextResponse.json(
        { error: "Missing item details" },
        { status: 400 }
      );
    }

    // Create transaction parameter
    const parameter = {
      transaction_details: {
        order_id: transaction_details.order_id,
        gross_amount: Math.round(transaction_details.gross_amount),
      },
      customer_details: {
        first_name: customer_details?.first_name || "Customer",
        email: customer_details?.email || "customer@example.com",
        phone: customer_details?.phone || "08123456789",
      },
      item_details: item_details.map((item: any) => ({
        id: item.id,
        price: Math.round(item.price),
        quantity: item.quantity,
        name: item.name,
      })),
      credit_card: {
        secure: true,
      },
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-complete`,
      },
    };

    console.log("Creating Midtrans transaction with parameter:", parameter);

    // Create transaction
    const transaction = await snap.createTransaction(parameter);

    console.log("Midtrans transaction created:", transaction);

    return NextResponse.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });
  } catch (error) {
    console.error("Midtrans transaction creation error:", error);

    return NextResponse.json(
      {
        error: "Failed to create transaction",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
