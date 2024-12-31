import {jwtDecode} from "jwt-decode";

export const authMiddleware = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return false; // Token not found
  }

  try {
    const decoded: { user_id: string; exp: number } = jwtDecode(token);

    // Check token expiration
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token"); // Remove expired token
      return false;
    }
    return true; // Token is valid
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
};
