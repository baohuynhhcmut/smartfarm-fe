
import { AUTH_URL } from "./Endpoint";
import { post } from "@/utils/api";

export const login = async (body: any) => {
    try {
        
    } catch (error) {
        console.error("Login error:", error);
    }
}

// export const logout = async () => {
//     try {
//         const response = await post(AUTH_URL.LOGOUT, {});
//         return response;
//     } catch (error) {
//         console.error("Logout error:", error);
//     }
// }

export const getUserByToken = async (token: string) => {
    try {
        const response = await post(AUTH_URL.GET_USER_BY_TOKEN, { token });
        return response;
    } catch (error) {
        console.error("Get user by token error:", error);
    }
}
