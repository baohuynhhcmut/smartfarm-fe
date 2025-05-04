import { del,getWithToken,post } from "@/utils/api"

export const getAllUser =  async (token: string) => {
    try {
        const response = await getWithToken('user', token)
        return response
    } catch (error) {
        console.log(error)
    }
}