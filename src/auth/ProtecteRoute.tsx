import { getToken } from "@/utils/token"
import { useEffect, useState } from "react"
import { useNavigate, Outlet } from "react-router-dom"
import { getUserByToken } from "@/api/Auth"
import { useAppContext } from "@/context/AppContext"

const ProtecteRoute = () => {
    const navigate = useNavigate()
    const [load, setLoad] = useState(true)
    const { dispatch } = useAppContext()

    useEffect(() => {
        const fetchAPI = async () => {
            try {
                // Get token from localStorage
                const token = localStorage.getItem("token")
                
                if (!token) {
                    console.error("No token found in localStorage")
                    navigate("/")
                    return
                }
                
                // Fetch user data with the token
                const response = await fetch("http://localhost:8081/api/v1/user/getByToken", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                
                if (!response.ok) {
                    console.error("Failed to authenticate user")
                    navigate("/")
                    return
                }
                
                const data = await response.json()
                const user = data.user
                
                // Save user in context
                dispatch({ type: 'SET_USER', payload: user })
                
                // Check user role and redirect if needed
                if (user.role === "ADMIN" && window.location.pathname.includes("/user")) {
                    navigate("/admin")
                } else if (user.role === "USER" && window.location.pathname.includes("/admin")) {
                    navigate("/user")
                }
                
                setLoad(false)
            } catch (error) {
                console.error("Authentication error:", error)
                navigate("/")
            }
        }
        
        fetchAPI()
    }, [navigate, dispatch])
    
    if(load) {
        return <div className="flex items-center justify-center text-xl h-screen">Đang tải...</div>
    }
    
    return <Outlet />
}
   
export default ProtecteRoute