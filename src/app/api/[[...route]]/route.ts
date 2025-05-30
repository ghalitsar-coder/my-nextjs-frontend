import { auth } from "@/auth";
import { Hono } from "hono";
import { handle } from "hono/vercel";
// Create a new Hono app
const app = new Hono().basePath("/api");

// CORS middleware for handling cross-origin requests
app.use("*", async (c, next) => {
  // Handle CORS
  c.header("Access-Control-Allow-Origin", "*");
  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (c.req.method === "OPTIONS") {
    return c.text("", 200);
  }

  await next();
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
const SPRING_BOOT_BASE_URL = "http://localhost:8080";

// Users API proxy
app.get("/users", async (c) => {
  try {
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/api/users`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error fetching users:", error);
    return c.json({ error: "Failed to fetch users" }, 500);
  }
});

// Get users by role
app.get("/users/role/:role", async (c) => {
  try {
    const role = c.req.param("role");
    const response = await fetch(
      `${SPRING_BOOT_BASE_URL}/api/users/role/${role}`
    );
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error fetching users by role:", error);
    return c.json({ error: "Failed to fetch users by role" }, 500);
  }
});

// Get user by ID
app.get("/users/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/api/users/${id}`);
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
app.get("/users/:id/check-role", async (c) => {
  try {
    const id = c.req.param("id");
    const response = await fetch(
      `${SPRING_BOOT_BASE_URL}/api/users/${id}/check-role`
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
app.put("/users/:id/role", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const response = await fetch(
      `${SPRING_BOOT_BASE_URL}/api/users/${id}/role`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      return c.json(
        { error: errorText || "Failed to update user role" },
        response.status
      );
    }
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error updating user role:", error);
    return c.json({ error: "Failed to update user role" }, 500);
  }
});

app.post("/users", async (c) => {
  try {
    const body = await c.req.json();
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/api/users`, {
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
app.get("/products", async (c) => {
  try {
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/api/products`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error fetching products:", error);
    return c.json({ error: "Failed to fetch products" }, 500);
  }
});

app.post("/products", async (c) => {
  try {
    const body = await c.req.json();
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/api/products`, {
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

// Orders API proxy
app.get("/orders", async (c) => {
  try {
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/api/orders`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return c.json({ error: "Failed to fetch orders" }, 500);
  }
});

app.post("/orders", async (c) => {
  try {
    const body = await c.req.json();
    const response = await fetch(`${SPRING_BOOT_BASE_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error creating order:", error);
    return c.json({ error: "Failed to create order" }, 500);
  }
});

// Statistics endpoint
app.get("/stats", async (c) => {
  try {
    const [usersRes, productsRes] = await Promise.all([
      fetch(`${SPRING_BOOT_BASE_URL}/api/users`),
      fetch(`${SPRING_BOOT_BASE_URL}/api/products`),
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
app.get("/cart/:userId", async (c) => {
  const userId = c.req.param("userId");
  try {
    // For now, return mock cart data
    // In a real app, you'd fetch from database or session
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

app.post("/cart/:userId/add", async (c) => {
  const userId = c.req.param("userId");
  try {
    const body = await c.req.json();
    // Here you would add item to cart
    // For now, return success response
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
app.get("/search", async (c) => {
  const query = c.req.query("q");
  const type = c.req.query("type") || "products";

  try {
    if (type === "products") {
      const response = await fetch(`${SPRING_BOOT_BASE_URL}/api/products`);
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

// Hello endpoint for testing
app.get("/hello", (c) => {
  return c.text("Hello from Hono API! 🔥");
});

app.post("/auth/sign-up", async (c) => {
  const body = await c.req.json();
  try {
    const result = await auth.api.signUp({
      email: body.email,
      password: body.password,
      full_name: body.full_name,
      username: body.username,
      phone_number: body.phone_number || null,
      address: body.address || null,
    });
    return c.json(result, 200);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
});

app.post("/auth/sign-in", async (c) => {
  const body = await c.req.json();
  try {
    const result = await auth.api.signIn({
      email: body.email,
      password: body.password,
    });
    return c.json(result, 200);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
});

app.get("/auth/google", async (c) => {
  const redirectUrl = await auth.api.getOAuthUrl("google", {
    redirectUri: `${c.req.url}/callback`,
  });
  return c.redirect(redirectUrl);
});

app.get("/auth/google/callback", async (c) => {
  try {
    const result = await auth.api.handleOAuthCallback(c.req.url, "google");
    // Redirect ke dashboard dengan token atau session
    return c.redirect("/dashboard");
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
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
