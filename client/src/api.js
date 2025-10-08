const API_BASE = process.env.REACT_APP_BACKEND_URI;

// Generic GET request
export const getRequest = async (endpoint) => {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (!res.ok) throw new Error("Network response was not ok");
    return await res.json();
  } catch (err) {
    console.error("GET request error:", err);
    return null;
  }
};

// Generic POST request
export const postRequest = async (endpoint, body) => {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
  } catch (err) {
    console.error("POST request error:", err);
    throw err;
  }
};
