import { getToken } from "@/utils/token"
import {useEffect,useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate,Outlet } from "react-router-dom"
import { login,logout } from "@/store/UserSlice"
import { getUserByToken } from "@/api/Auth"
// import { getUserByToken } from "@/api/Auth"


const ProtecteRoute = () => {

    // const token = getToken()
    const navigate = useNavigate()
    // const dispatch = useDispatch()
    const [load,setLoad] = useState(false)

    const [user,setUser] = useState(null)

    // if(!token){
    //     navigate('/login')
    //     dispatch(logout())
    //     return;
    // }

    useEffect(() => {
        // const fetchUser = async () => {
        //     const response = await getUserByToken(token)
        //     if(response.code == 200){
        //         dispatch(login(response.data))
        //         if (response.data.role === 'admin') {
        //             navigate('/admin');
        //         } 
        //         else if (response.data.role === 'user') {
        //             navigate('/user');
        //         } 
        //         else {
        //             navigate('/login'); 
        //         }
        //     }
        //     else{
        //         navigate('/login')
        //         dispatch(logout())
        //     }
        // }
        // fetchUser()
        // const dispatch = useDispatch()
        const fetchAPI = async () => {
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2QxOTk1M2ZkNWQ5NzAyODBhMGIwOTAiLCJlbWFpbCI6InVzZXIyIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3NDU5MTQxMDgsImV4cCI6MTc0NjAwMDUwOH0.z24XR-3r57pnqQeu8H3SlaY-h5A-J554j6pbN4MR3Xc"
            const response = await getUserByToken(token)
            setUser(response.user)
        }
        fetchAPI()
    },[])

    console.log(user)
    
    if(load){
        return <div className="flex items-center justify-center text-xl">Loading...</div>
    }
    
    return <Outlet />
}
   
export default ProtecteRoute