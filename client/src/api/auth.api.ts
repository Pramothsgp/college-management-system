import axios from "axios"
import { Role } from "~/types/authTypes";
import { decodeJWT } from "~/utils/decodeJWT";
const API_URL = process.env.API_URL;
export const loginUser = async (email : string, password : string) : Promise<{role : Role | null , token : string}> => {
    try {
        console.log(API_URL);
        const response = await axios.post(`${API_URL}/api/auth/login`, {
            email,
            password
        });
        return  {role : decodeJWT(response.data.token) , token :response.data.token };
    } catch (error) {
        console.error('Login failed:', error);
        throw new Error('Login failed');
    }
}