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

    const { 
      transaction_details, 
      customer_details, 
      item_details, 
      payment_method, 
      card_info 
    } = body;

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

    // Calculate the sum of item_details to ensure it matches gross_amount
    const itemsTotal = item_details.reduce((sum: number, item: {price: number, quantity: number}) => {
      return sum + (Math.round(item.price) * item.quantity);
    }, 0);

    // Use the items total to ensure consistency between gross_amount and sum of items
    const grossAmount = itemsTotal;
      // Create transaction parameter
    const parameter: any = {
      transaction_details: {
        order_id: transaction_details.order_id,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: customer_details?.first_name || "Customer",
        email: customer_details?.email || "customer@example.com",
        phone: customer_details?.phone || "08123456789",
      },
      item_details: item_details.map((item: {id: string, price: number, quantity: number, name: string}) => ({
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
