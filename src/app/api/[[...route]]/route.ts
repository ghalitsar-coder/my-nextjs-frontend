import { Hono } from "hono";
import { handle } from "hono/vercel";
import { cors } from "hono/cors";
import { auth } from "@/lib/auth";

// Configuration
const SPRING_BOOT_BASE_URL =
  process.env.SPRING_BOOT_URL || "http://localhost:8080";

// Create a new Hono app
const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

app.use(
  "/api/*",
  cors({
    origin: "http://localhost:3000",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }
  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

app.on(["POST", "GET"], "/api/auth/*", async (c) => {
  let body = null;
  if (c.req.raw.method === "POST") {
    try {
      body = await c.req.json();
    } catch (e) {
      console.error("Failed to parse JSON body:", e);
    }
  }

  console.log("Auth Handler:", c.req.raw.method, c.req.raw.url, body);

  try {
    const request = new Request(c.req.raw, {
      body: body ? JSON.stringify(body) : null,
      headers: c.req.raw.headers,
      method: c.req.raw.method,
    });

    const response = await auth.handler(request);
    // Baca body respons sekali
    const responseBody = await response.text();
    console.log("Auth Handler Response:", response.status, responseBody);
    // Buat respons baru dengan body yang sama
    return new Response(responseBody, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    console.error("Auth Handler Error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.get("/api/session", async (c) => {
  const session = c.get("session");
  const user = c.get("user");
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  
  // Fetch user role from Spring Boot
  try {
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/users/email/${user.email}`);
    if (response.ok) {
      const userData = await response.json();
      const userWithRole = {
        ...user,
        role: userData.role || 'customer'
      };
      return c.json({ session, user: userWithRole });
    }
  } catch (error) {
    console.error("Error fetching user role:", error);
  }
  
  // Fallback if we can't get role from Spring Boot
  return c.json({ session, user: { ...user, role: 'customer' } });
});

// Set role cookie endpoint (moved from /api/auth/set-role to avoid conflict)
app.post("/api/set-role", async (c) => {
  try {
    const { role } = await c.req.json();
    if (!role || !['admin', 'cashier', 'customer'].includes(role)) {
      return c.json({ error: "Invalid role" }, 400);
    }
    
    console.log(`[Set Role Cookie] Setting role cookie for role: ${role}`);
    
    // Set role cookie
    const response = c.json({ success: true });
    response.headers.set(
      'Set-Cookie',
      `user-role=${role}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}` // 7 days
    );
    
    return response;
  } catch (error) {
    console.error("Error setting role cookie:", error);
    return c.json({ error: "Failed to set role" }, 500);
  }
});

// Health check endpoint
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    message: "Hono API is running!",
    timestamp: new Date().toISOString(),
  });
});

// Proxy endpoints to Spring Boot
app.get("/api/users", async (c) => {
  try {
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/users`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error fetching users:", error);
    return c.json({ error: "Failed to fetch users" }, 500);
  }
});

// Get users by role
app.get("/api/users/role/:role", async (c) => {
  try {
    const role = c.req.param("role");
    const response = await fetch(
      `${SPRING_BOOT_BASE_URL}/users/role/${role}`
    );
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error fetching users by role:", error);
    return c.json({ error: "Failed to fetch users by role" }, 500);
  }
});

// Get user by ID
app.get("/api/users/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/users/${id}`);
    if (!response.ok) {
      return c.json({ error: "User not found" }, 404);
    }
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error fetching user:", error);
    return c.json({ error: "Failed to fetch user" }, 500);
  }
});

// Check user role
app.get("/api/users/:id/check-role", async (c) => {
  try {
    const id = c.req.param("id");
    const response = await fetch(
      `${SPRING_BOOT_BASE_URL}/users/${id}/check-role`
    );
    if (!response.ok) {
      return c.json({ error: "User not found" }, 404);
    }
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error checking user role:", error);
    return c.json({ error: "Failed to check user role" }, 500);
  }
});

// Update user role
app.put("/api/users/:id/role", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const response = await fetch(
      `${SPRING_BOOT_BASE_URL}/users/${id}/role`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    if (!response.ok) {
      const errorText = await response.text();      return c.json(
        { error: errorText || "Failed to update user role" },
        500
      );
    }
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error updating user role:", error);
    return c.json({ error: "Failed to update user role" }, 500);
  }
});

app.post("/api/users", async (c) => {
  try {
    const body = await c.req.json();
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error creating user:", error);
    return c.json({ error: "Failed to create user" }, 500);
  }
});

// Products API proxy
app.get("/api/products", async (c) => {
  try {
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/products`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error fetching products:", error);
    return c.json({ error: "Failed to fetch products" }, 500);
  }
});

// Get individual product by ID
app.get("/api/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/products/${id}`);
    if (!response.ok) {
      return c.json({ error: "Product not found" }, 404);
    }
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error fetching product:", error);
    return c.json({ error: "Failed to fetch product" }, 500);
  }
});

app.post("/api/products", async (c) => {
  try {
    const body = await c.req.json();
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error creating product:", error);
    return c.json({ error: "Failed to create product" }, 500);
  }
});

app.put("/api/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      return c.json({ error: "Product not found" }, 404);
    }
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error updating product:", error);
    return c.json({ error: "Failed to update product" }, 500);
  }
});

app.delete("/api/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    console.log(`Attempting to delete product with ID: ${id}`);
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/products/${id}`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Delete failed with status ${response.status}:`, errorText);
      return c.json({ error: "Failed to delete product" }, 500);
    }
    
    return c.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return c.json({ error: "Failed to delete product" }, 500);
  }
});

// Orders API proxy
app.get("/api/orders", async (c) => {
  try {
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/orders`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return c.json({ error: "Failed to fetch orders" }, 500);
  }
});

// Get orders by user ID
app.get("/api/orders/user/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/orders/user/${userId}`);
      if (!response.ok) {
      console.error(`Failed to fetch orders for user ${userId}, status: ${response.status}`);
      if (response.status === 404) {
        return c.json({ error: "User orders not found" }, 404);
      }
      return c.json({ error: "Failed to fetch user orders" }, 500);
    }
    
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return c.json({ error: "Failed to fetch user orders" }, 500);
  }
});

// Get payment summary
app.get("/api/orders/payment-summary", async (c) => {
  try {
    console.log(`[Proxy] Fetching payment summary from: ${SPRING_BOOT_BASE_URL}/orders/payment-summary`);
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/orders/payment-summary`);
    
    if (!response.ok) {
      console.error(`[Proxy] Payment summary fetch failed with status ${response.status}`);
      const errorText = await response.text();
      console.error(`[Proxy] Error details:`, errorText);
      return c.json({ error: "Failed to fetch payment summary from backend" }, 500);
    }
    
    const data = await response.json();
    console.log(`[Proxy] Payment summary fetched successfully, count:`, data?.length || 'N/A');
    return c.json(data);
  } catch (error) {
    console.error("Error fetching payment summary:", error);
    return c.json({ error: "Failed to fetch payment summary" }, 500);
  }
});

app.post("/api/orders", async (c) => {
  try {
    const body = await c.req.json();
    const { userId, items, paymentInfo } = body;

    console.log("Hono - Received order request:", JSON.stringify(body, null, 2));

    // Validate required fields
    if (!items || items.length === 0) {
      return c.json({ error: "Order items are required" }, 400);
    }

    if (!paymentInfo) {
      return c.json({ error: "Payment information is required" }, 400);
    }

    // Use the order data as-is since frontend now sends the correct format
    const orderData = {
      userId: userId || "1", // Use provided userId or default to "1"
      items: items,
      paymentInfo: paymentInfo,
    };

    console.log("Hono - Sending order to Spring Boot:", JSON.stringify(orderData, null, 2));

    const response = await fetch(`${SPRING_BOOT_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    console.log("Spring Boot response status:", response.status);    if (!response.ok) {
      const errorText = await response.text();
      console.error("Spring Boot error response:", errorText);
      return c.json({ 
        error: "Backend error",
        details: errorText
      }, 500); // Use a standard status code
    }

    const savedOrder = await response.json();
    console.log("Order saved successfully:", savedOrder);

    return c.json({
      success: true,
      orderId: savedOrder.id,
      message: "Order created successfully",
      order: savedOrder
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return c.json({ 
      error: "Failed to create order",
      details: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
});

// Statistics endpoint
app.get("/api/stats", async (c) => {
  try {
    const [usersRes, productsRes] = await Promise.all([
      fetch(`${SPRING_BOOT_BASE_URL}/users`),
      fetch(`${SPRING_BOOT_BASE_URL}/products`),
    ]);

    const users = await usersRes.json();
    const products = await productsRes.json();

    const stats = {
      totalUsers: Array.isArray(users) ? users.length : 0,
      totalProducts: Array.isArray(products) ? products.length : 0,
      availableProducts: Array.isArray(products)
        ? products.filter((p) => p.available).length
        : 0,
      totalCategories: Array.isArray(products)
        ? new Set(products.map((p) => p.category)).size
        : 0,
    };

    return c.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return c.json({ error: "Failed to fetch statistics" }, 500);
  }
});

// Cart management endpoints
app.get("/api/cart/:userId", async (c) => {
  const userId = c.req.param("userId");
  try {
    const cart = {
      userId: parseInt(userId),
      items: [],
      total: 0,
      subtotal: 0,
      tax: 0,
      shipping: 0,
    };
    return c.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return c.json({ error: "Failed to fetch cart" }, 500);
  }
});

app.post("/api/cart/:userId/add", async (c) => {
  const userId = c.req.param("userId");
  try {
    const body = await c.req.json();
    return c.json({
      success: true,
      message: "Item added to cart",
      userId: parseInt(userId),
      item: body,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return c.json({ error: "Failed to add item to cart" }, 500);
  }
});

// Search endpoint
app.get("/api/search", async (c) => {
  const query = c.req.query("q");
  const type = c.req.query("type") || "products";

  try {
    if (type === "products") {
      const response = await fetch(`${SPRING_BOOT_BASE_URL}/products`);
      const products = await response.json();

      if (query && Array.isArray(products)) {
        const filtered = products.filter(
          (product) =>
            product.name?.toLowerCase().includes(query.toLowerCase()) ||
            product.description?.toLowerCase().includes(query.toLowerCase())
        );
        return c.json(filtered);
      }

      return c.json(products);
    }

    return c.json([]);
  } catch (error) {
    console.error("Error searching:", error);
    return c.json({ error: "Search failed" }, 500);
  }
});

// Categories API proxy
app.get("/api/categories", async (c) => {
  try {
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/categories`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return c.json({ error: "Failed to fetch categories" }, 500);
  }
});

app.get("/api/categories/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/categories/${id}`);
    if (!response.ok) {
      return c.json({ error: "Category not found" }, 404);
    }
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error fetching category:", error);
    return c.json({ error: "Failed to fetch category" }, 500);
  }
});

app.post("/api/categories", async (c) => {
  try {
    const body = await c.req.json();
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error creating category:", error);
    return c.json({ error: "Failed to create category" }, 500);
  }
});

// Promotions API proxy
app.get("/api/promotions", async (c) => {
  try {
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/promotions`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error fetching promotions:", error);
    return c.json({ error: "Failed to fetch promotions" }, 500);
  }
});

app.get("/api/promotions/active", async (c) => {
  try {
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/promotions/active`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error fetching active promotions:", error);
    return c.json({ error: "Failed to fetch active promotions" }, 500);
  }
});

app.get("/api/promotions/eligible", async (c) => {
  try {
    const orderTotal = c.req.query("orderTotal");
    const url = orderTotal 
      ? `${SPRING_BOOT_BASE_URL}/promotions/eligible?orderTotal=${orderTotal}`
      : `${SPRING_BOOT_BASE_URL}/promotions/eligible`;
    
    const response = await fetch(url);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error fetching eligible promotions:", error);
    return c.json({ error: "Failed to fetch eligible promotions" }, 500);
  }
});

app.get("/api/promotions/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/promotions/${id}`);
    if (!response.ok) {
      return c.json({ error: "Promotion not found" }, 404);
    }
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error fetching promotion:", error);
    return c.json({ error: "Failed to fetch promotion" }, 500);
  }
});

app.post("/api/promotions", async (c) => {
  try {
    const body = await c.req.json();
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/promotions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return c.json(errorData, response.status);
    }
    
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error creating promotion:", error);
    return c.json({ error: "Failed to create promotion" }, 500);
  }
});

app.put("/api/promotions/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/promotions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return c.json(errorData, response.status);
    }
    
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error updating promotion:", error);
    return c.json({ error: "Failed to update promotion" }, 500);
  }
});

app.delete("/api/promotions/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/promotions/${id}`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return c.json(errorData, response.status);
    }
    
    return c.json({ message: "Promotion deleted successfully" });
  } catch (error) {
    console.error("Error deleting promotion:", error);
    return c.json({ error: "Failed to delete promotion" }, 500);
  }
});

app.patch("/api/promotions/:id/toggle", async (c) => {
  try {
    const id = c.req.param("id");
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/promotions/${id}/toggle`, {
      method: "PATCH",
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return c.json(errorData, response.status);
    }
    
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error toggling promotion status:", error);
    return c.json({ error: "Failed to toggle promotion status" }, 500);
  }
});

// Order-Promotions API proxy
app.get("/api/order-promotions", async (c) => {
  try {
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/order-promotions`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error fetching order promotions:", error);
    return c.json({ error: "Failed to fetch order promotions" }, 500);
  }
});

app.get("/api/order-promotions/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/order-promotions/${id}`);
    if (!response.ok) {
      return c.json({ error: "Order promotion not found" }, 404);
    }
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error fetching order promotion:", error);
    return c.json({ error: "Failed to fetch order promotion" }, 500);
  }
});

app.get("/api/order-promotions/order/:orderId", async (c) => {
  try {
    const orderId = c.req.param("orderId");
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/order-promotions/order/${orderId}`);
    if (!response.ok) {
      const errorData = await response.json();
      return c.json(errorData, response.status);
    }
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error fetching order promotions:", error);
    return c.json({ error: "Failed to fetch order promotions" }, 500);
  }
});

app.get("/api/order-promotions/promotion/:promotionId", async (c) => {
  try {
    const promotionId = c.req.param("promotionId");
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/order-promotions/promotion/${promotionId}`);
    if (!response.ok) {
      const errorData = await response.json();
      return c.json(errorData, response.status);
    }
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error fetching promotion orders:", error);
    return c.json({ error: "Failed to fetch promotion orders" }, 500);
  }
});

app.post("/api/order-promotions", async (c) => {
  try {
    const body = await c.req.json();
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/order-promotions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return c.json(errorData, response.status);
    }
    
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error applying promotion to order:", error);
    return c.json({ error: "Failed to apply promotion to order" }, 500);
  }
});

app.delete("/api/order-promotions/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/order-promotions/${id}`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return c.json(errorData, response.status);
    }
    
    return c.json({ message: "Promotion removed from order successfully" });
  } catch (error) {
    console.error("Error removing promotion from order:", error);
    return c.json({ error: "Failed to remove promotion from order" }, 500);
  }
});

// Update user profile
app.put("/api/users/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
      if (!response.ok) {
      const errorText = await response.text();
      console.error(`Update user failed with status ${response.status}:`, errorText);
      return c.json({ error: "Failed to update user" }, 400);
    }
    
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error updating user:", error);
    return c.json({ error: "Failed to update user" }, 500);
  }
});

// Change user password
app.put("/api/users/:id/password", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/users/${id}/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
      if (!response.ok) {
      const errorText = await response.text();
      console.error(`Password change failed with status ${response.status}:`, errorText);
      return c.json({ error: errorText || "Failed to change password" }, 400);
    }
    
    return c.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    return c.json({ error: "Failed to change password" }, 500);
  }
});

// Payment-related endpoints
app.get("/api/payments", async (c) => {
  try {
    console.log(`[Proxy] Fetching  SSS payments from: ${SPRING_BOOT_BASE_URL}/orders/payment-summary`);
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/orders/payment-summary`);
    
    if (!response.ok) {
      console.error(`[Proxy] Payment fetch failed with status ${response.status}`);
      const errorText = await response.text();
      console.error(`[Proxy] Error details:`, errorText);
      return c.json({ error: "Failed to fetch payment data from backend" }, 500);
    }
    
    const data = await response.json();
    console.log(`[Proxy] Payment data fetched successfully, count:`, data?.length || 'N/A');
    return c.json(data);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return c.json({ error: "Failed to fetch payments" }, 500);
  }
});

app.get("/api/payments/:id", async (c) => {
  const id = c.req.param("id");
  try {
    console.log(`[Proxy] Fetching payment for order ${id} from: ${SPRING_BOOT_BASE_URL}/api/orders/${id}/payment`);
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/api/orders/${id}/payment`);
    
    if (!response.ok) {
      console.error(`[Proxy] Payment fetch failed for order ${id} with status ${response.status}`);
      const errorText = await response.text();
      console.error(`[Proxy] Error details:`, errorText);
      return c.json({ error: "Payment not found" }, 404);
    }
    
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error fetching payment:", error);
    return c.json({ error: "Failed to fetch payment" }, 500);
  }
});

app.post("/api/payments/:orderId/update", async (c) => {
  const orderId = c.req.param("orderId");
  try {
    const body = await c.req.json();
    console.log(`[Proxy] Updating payment for order ${orderId}:`, body);
    
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/api/orders/${orderId}/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
      
    if (!response.ok) {
      console.error(`[Proxy] Payment update failed for order ${orderId} with status ${response.status}`);
      const errorData = await response.text();
      console.error(`[Proxy] Error details:`, errorData);
      return c.json({ error: errorData }, 500);
    }
    
    const data = await response.json();
    console.log(`[Proxy] Payment updated successfully for order ${orderId}:`, data);
    return c.json(data);
  } catch (error) {
    console.error("Error updating payment:", error);
    return c.json({ error: "Failed to update payment" }, 500);
  }
});

// Debug endpoint to check current user role
app.get("/api/debug/role", async (c) => {
  const session = c.get("session");
  const user = c.get("user");
  
  if (!user) {
    return c.json({ 
      authenticated: false, 
      user: null, 
      role: null,
      error: "Not authenticated" 
    });
  }

  // Try to get role from Spring Boot
  let backendRole = null;
  try {
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/users/email/${user.email}`);
    if (response.ok) {
      const userData = await response.json();
      backendRole = userData.role;
    }
  } catch (error) {
    console.error("Error fetching user role from backend:", error);
  }

  return c.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    },
    roleFromBackend: backendRole,
    sessionUser: user,
    hasSession: !!session
  });
});

// Catch-all for undefined routes
app.all("*", (c) => {
  return c.json({ error: "Route not found" }, 404);
});

// Export handlers for Next.js
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
