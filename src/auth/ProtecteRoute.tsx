import { getToken } from "@/utils/token"
import {useEffect,useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate,Outlet } from "react-router-dom"
import { UseDispatch } from "react-redux"
import { login,logout } from "@/store/UserSlice"

const ProtecteRoute = () => {

    const token = getToken()
    const user = useSelector((state:any) => state.user.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()


    if(!token){
        navigate('/login')
        dispatch(logout())
    }

    useEffect(() => {
        const fetchUser = async () => {
            
        }
    },[])

    
    return (
        <Outlet />
    )
}
   
export default ProtecteRoute