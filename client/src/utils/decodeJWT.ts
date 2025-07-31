import { jwtDecode } from 'jwt-decode';
import { DecodedJWT, Role } from "~/types/authTypes";



export const decodeJWT = (token: string): Role | null => {
  if (!token) return null;

  try {
    const decoded: DecodedJWT = jwtDecode(token);
    console.log("Decoded JWT:", decoded);
    return decoded.role;
  } catch (error) {
    console.error("Invalid JWT:", error);
    return null;
  }
};
