import { APIRequestContext } from '@playwright/test';

const API_URL = process.env.API_URL || 'https://api.demoblaze.com';

export async function loginApi(request: APIRequestContext, username: string, password: string) {
  const encoded = Buffer.from(password).toString('base64');
  const response = await request.post(`${API_URL}/login`, {
    data: { username, password: encoded },
  });
  const body = await response.json();
  return { status: response.status(), body };
}

export async function signupApi(request: APIRequestContext, username: string, password: string) {
  const encoded = Buffer.from(password).toString('base64');
  const response = await request.post(`${API_URL}/signup`, {
    data: { username, password: encoded },
  });
  const body = await response.json();
  return { status: response.status(), body };
}

export async function getProducts(request: APIRequestContext) {
  const response = await request.get(`${API_URL}/entries`);
  const body = await response.json();
  return { status: response.status(), body };
}

export async function getProductById(request: APIRequestContext, id: number) {
  const response = await request.post(`${API_URL}/view`, {
    data: { id: String(id) },
  });
  const body = await response.json();
  return { status: response.status(), body };
}

export async function addToCart(
    request: APIRequestContext,
    token: string,
    productId: number,
) {
  const response = await request.post(`${API_URL}/addtocart`, {
    data: {
      cookie: token,
      flag: false,
      id: String(Date.now()),
      prod_id: productId,
    },
  });
  return { status: response.status() };
}

export async function getCart(request: APIRequestContext, token: string) {
  const response = await request.post(`${API_URL}/viewcart`, {
    data: { cookie: token, flag: false },
  });
  const body = await response.json();
  return { status: response.status(), body };
}

export async function placeOrder(
    request: APIRequestContext,
    token: string,
    name: string,
    country: string,
    city: string,
    card: string,
    month: string,
    year: string,
) {
  const response = await request.post(`${API_URL}/order`, {
    data: {
      cookie: token,
      name,
      country,
      city,
      card,
      month,
      year,
    },
  });
  return { status: response.status() };
}