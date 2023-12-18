/**
 * @Project : Internal Transportation Tracking
 * @File : app/login/LoginForm.tsx
 * @Author : Eng. Mustafa Elkhiat
 * @Date : 10/1/2023
 * @Time : 1:30 AM
 */
'use client'


import {useState} from "react";
import {signIn, useSession} from "next-auth/react";
import {useRouter} from "next/navigation";


interface Credentials {
    email: string,
    password: string
}

export default function LoginForm() {
    const {status, data: session} = useSession()
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [credentials, setCredentials] = useState<Credentials>({
        email: '',
        password: ''
    })
    const router = useRouter()


    const onSubmit = async (event) => {
        event.preventDefault()
        setErrorMessage("")
        try {
            const res = await signIn('credentials', {
                email: credentials.email,
                password: credentials.password,
                redirect: false
            })

            if (res?.error) {
                setErrorMessage("Invalid Credentials")
                return
            }
            //router.push("/dashboard")
        } catch (error) {
            console.log(error)
        }
    }
    const handleInputChange = (e) => {

        const {name, value} = e.target;
        setCredentials((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    if (status === "loading") return <h1>...Loading</h1>
    else if (status === "unauthenticated")

        return (

            <form onSubmit={onSubmit}
                  className="flex flex-col gap-4 w-[400px] border-2 items-center rounded-2xl p-5">

                <p className="text-3xl text-center">Login</p>
                <div className="flex justify-between items-center mb-4 shadow-md px-2 w-full">
                <span className="text-sm font-semibold mb-1 mr-2">
                  Email
                </span>
                    <input
                        className="px-2 py-1 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                        type="email"
                        name="email"
                        value={credentials.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        required
                    />
                </div>
                <div className="flex justify-between items-center mb-4 shadow-md px-2 w-full">
                <span className="text-sm font-semibold mb-1 mr-2">
                  Password
                </span>
                    <input
                        className="px-2 py-1 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleInputChange}
                        placeholder="Password"
                        required
                    />
                </div>

                <div className="flex gap-4 justify-center">
                    <button type="submit">
                        Login
                    </button>
                </div>
                {errorMessage}
            </form>
        );
    else router.push("/dashboard")

}