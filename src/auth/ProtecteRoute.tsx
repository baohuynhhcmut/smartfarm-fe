import { getToken } from "@/utils/token"
import {useEffect,useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate,Outlet } from "react-router-dom"
import { login,logout } from "@/store/UserSlice"
import { getUserByToken } from "@/api/Auth"

const ProtecteRoute = () => {

    const token = getToken()
    const navigate = useNavigate()
    const dispatch = useDispatch()


    if(!token){
        navigate('/login')
        dispatch(logout())
        return;
    }

    useEffect(() => {
        const fetchUser = async () => {
            const response = await getUserByToken(token)
            if(response.code == 200){
                dispatch(login(response.data))
                if (response.data.role === 'admin') {
                    navigate('/admin');
                } 
                else if (response.data.role === 'user') {
                    navigate('/user');
                } 
                else {
                    navigate('/login'); 
                }
            }
            else{
                navigate('/login')
                dispatch(logout())
            }
        }
        // fetchUser()
    },[])
    return (
        <Outlet />
    )
}
   
export default ProtecteRoute