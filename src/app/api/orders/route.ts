import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderItems, totalAmount, paymentMethod } = body;

    // Validate required fields
    if (!orderItems || orderItems.length === 0) {
      return NextResponse.json(
        { error: "Order items are required" },
        { status: 400 }
      );
    }

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        { error: "Valid total amount is required" },
        { status: 400 }
      );
    }

    if (
      !paymentMethod ||
      !["cash", "card", "digital"].includes(paymentMethod)
    ) {
      return NextResponse.json(
        { error: "Valid payment method is required" },
        { status: 400 }
      );
    } // Prepare order data for backend in the correct format
    const orderData = {
      userId: 1, // For now, using default user ID since not logged in
      items: orderItems.map((item: { id?: number; quantity: number }) => ({
        productId: item.id || 1, // Map to actual product ID
        quantity: item.quantity,
      })),
      paymentInfo: {
        type: paymentMethod, // "cash", "card", "digital"
        transactionId: null,
        paymentMethod: paymentMethod,
      },
    };

    console.log("Sending order to backend:", orderData);

    // Send to Spring Boot backend
    const backendResponse = await fetch("http://localhost:8080/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error("Backend error:", errorText);
      throw new Error(`Backend error: ${backendResponse.status}`);
    }

    const savedOrder = await backendResponse.json();
    console.log("Order saved to backend:", savedOrder);

    return NextResponse.json({
      success: true,
      orderId: savedOrder.id,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Order creation error:", error);

    return NextResponse.json(
      {
        error: "Failed to create order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Forward request to Spring Boot backend
    const backendResponse = await fetch("http://localhost:8080/api/orders", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!backendResponse.ok) {
      throw new Error(`Backend error: ${backendResponse.status}`);
    }

    const orders = await backendResponse.json();

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Orders fetch error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch orders",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
