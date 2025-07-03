const API_URL = 'https://ton-backend-url.com/api';

export async function loginUser(name, phone) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phone }),
  });
  return response.json();
}

export async function registerUser(firstname, lastname, phone, plan, vehicleCount) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstname, lastname, phone, plan, vehicleCount }),
  });
  return response.json();
}
