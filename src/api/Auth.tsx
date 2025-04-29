
import { AUTH_URL } from "./Endpoint";
import { getWithToken} from "@/utils/api";


export const getUserByToken = async (token: string) => {
    try {
        const response = await getWithToken(AUTH_URL.GET_USER_BY_TOKEN,token);
        return response;
    } catch (error) {
        console.error("Get user by token error:", error);
    }
}

