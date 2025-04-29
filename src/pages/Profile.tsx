import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import bg from "../assets/Profile image.png"
import { ProfileForm } from "@/form/user-profile-form";
import { PasswordForm } from "@/form/change-password-from";
import { useEffect, useState } from "react";

const Profile =() => {

    const [loading,setLoading] = useState(false)

    useEffect(() => {
        const fetchAPI = async() => {
            const respone = await fetch("...linkAPI")
            
        }
    },[])

    const handleSubmit =  async () => {
        setLoading(true)
        const res = await fetch("...linkAPI")
    }

    return(
        <>
            <div className="max-w-7xl mx-auto max-h-full py-[10px]! h-full">
                <div className="bg-white w-full rounded-2xl h-full shadow-xl grid grid-cols-[350px_1fr]  p-10! gap-x-10">
                    <div className="flex flex-col gap-y-3 items-center">
                        <div className="flex gap-x-4">
                            <div className="relative w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="email" className="absolute top-1 left-2 font-bold  text-xs text-gray-400">Account Creation Date</Label>
                                <Input type="email" id="email" className="text-xl  font-bold w-full h-12 pt-4! text-center outline-none border border-black  focus:border-black! focus:outline-none! focus:ring-0!" value={"September 24, 2022"}/>
                            </div>
                            
                            <div className="relative w-3/5 max-w-sm items-center gap-1.5">
                                <Label htmlFor="email" className="absolute top-1 left-2 font-bold  text-xs text-gray-400">Count of gardens</Label>
                                <Input type="email" id="email"  className="text-xl pl-3! font-bold w-full h-12 pt-4! text-left outline-none border border-black  focus:border-black! focus:outline-none! focus:ring-0! cursor-default" value={"4"}/>
                            </div>
                        </div>
                        
                        <div className="w-[300px] mx-auto max-h-[300px] h-full flex items-center justify-center">
                            <img src={bg} className="w--full h-full object-cover" />
                        </div>
                        <div className="flex gap-x-2 items-center border-b border-black pb-2!">
                            <Label htmlFor="file" className=" px-3! py-2! text-nowrap border border-black rounded-md font-bold">Choose file</Label>
                            <Input className="w-full hidden" type="file" id="file"  />
                            <span className="font-semibold italic">No file chosen</span>
                        </div>
                        <Button className="bg-pink-500 w-32 h-12 rounded-3xl cursor-pointer font-bold">Change avatar</Button>
                    </div>


                    <div className="flex flex-col gap-y-2 h-full max-h-full">
                        <ProfileForm />
                        <PasswordForm />
                    </div>
                </div>
            </div>
        </>
    )
};

export default Profile;
