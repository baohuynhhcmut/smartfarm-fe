import { getToken } from "@/utils/token"
import { useEffect, useState } from "react"
import { useNavigate, Outlet } from "react-router-dom"
import { getUserByToken } from "@/api/Auth"

const ProtecteRoute = () => {
    const navigate = useNavigate()
    const [load, setLoad] = useState(false)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const fetchAPI = async () => {
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2QxOTk1M2ZkNWQ5NzAyODBhMGIwOTAiLCJlbWFpbCI6InVzZXIyIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3NDU5MTQxMDgsImV4cCI6MTc0NjAwMDUwOH0.z24XR-3r57pnqQeu8H3SlaY-h5A-J554j6pbN4MR3Xc"
            const response = await getUserByToken(token)
            setUser(response.user)
        }
        fetchAPI()
    }, [])

    console.log(user)
    
    if(load) {
        return <div className="flex items-center justify-center text-xl">Loading...</div>
    }
    
    return <Outlet />
}
   
export default ProtecteRoute