const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("cm_token");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("cm_user");
  return raw ? JSON.parse(raw) : null;
}

export function storeAuth(token: string, user: User) {
  localStorage.setItem("cm_token", token);
  localStorage.setItem("cm_user", JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem("cm_token");
  localStorage.removeItem("cm_user");
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
    ...(options?.headers as Record<string, string>),
  };
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "API error");
  }
  return res.json();
}

// ─── Auth ──────────────────────────────────────────────
export const login = (email: string, password: string) =>
  request<{ token: string; user: User }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const register = (data: {
  name: string;
  accountName: string;
  email: string;
  password: string;
}) =>
  request<{ token: string; user: User }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

// ─── Users ─────────────────────────────────────────────
export const getUser = (id: string) => request<User>(`/api/users/${id}`);

export const updateUser = (id: string, data: Partial<User>) =>
  request<User>(`/api/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

// ─── Featured / Trending ────────────────────────────────
export const getFeaturedProducts = () =>
  getProducts({ sort: "score_desc", page: 1 }).then((res) => res.data.slice(0, 3));

// ─── Products ──────────────────────────────────────────
export const getProducts = (params?: {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
}) => {
  const qs = new URLSearchParams(
    Object.entries(params || {})
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString();
  return request<{ data: Product[]; total: number; page: number }>(`/api/products${qs ? `?${qs}` : ""}`);
};

export const getProduct = (id: string) =>
  request<Product & { user: User; feedbacks: Feedback[]; tags: Tag[] }>(`/api/products/${id}`);

// ─── Categories ────────────────────────────────────────
export const getCategories = () => request<Category[]>("/api/categories");

// ─── Feedback ──────────────────────────────────────────
export const getProductFeedbacks = (productId: string) =>
  request<Feedback[]>(`/api/products/${productId}/feedback`);

export const submitFeedback = (
  productId: string,
  data: { score: number; text: string; type: string }
) =>
  request<Feedback>(`/api/products/${productId}/feedback`, {
    method: "POST",
    body: JSON.stringify(data),
  });

// ─── Transactions ──────────────────────────────────────
export const getMyTransactions = () =>
  request<Transaction[]>("/api/transactions/me");

export const createTransaction = (data: {
  productId: string;
  paymentMethodId: string;
}) =>
  request<Transaction>("/api/transactions", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getTransaction = (id: string) =>
  request<Transaction & { product: Product }>(`/api/transactions/${id}`);

// ─── Types ─────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  accountName: string;
  accountDescription?: string;
  accountImage?: string;
  type: string;
  email: string;
  phone?: string;
  githubHandle?: string;
  status: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  score: number;
  price: string;
  status: string;
  isPublished: boolean;
  createdAt: string;
  userId: string;
  user?: User;
  tags?: Tag[];
  feedbacks?: Feedback[];
}

export interface Category {
  id: string;
  name: string;
  level: number;
  status: string;
}

export interface Tag {
  categoryId: string;
  category: Category;
}

export interface Feedback {
  id: string;
  productId: string;
  userId: string;
  type: string;
  score: number;
  text: string;
  images: string[];
  createdAt: string;
  status: string;
  user?: User;
}

export interface Transaction {
  id: string;
  productId: string;
  userId: string;
  createdAt: string;
  description: string;
  amount: string;
  status: string;
  product?: Product;
}
