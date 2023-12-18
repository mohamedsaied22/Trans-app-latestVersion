/**
 * @Project : sescoapp-API-main
 * @File : components/SignInButton.tsx
 * @Author : Eng. Mustafa Elkhiat
 * @Date : 12/14/2023
 * @Time : 2:27 PM
 */
import {signIn, signOut, useSession} from "next-auth/react";
import Link from "next/link";


export default function SignInButton(props) {
    const {data: session} = useSession()
    if(session && session.user)
    return (
        <div className="flex gap-4 ml-auto">
            <p className="text-sky-600">{session.user.name}</p>
            <button onClick={()=>signOut()}>Logout</button>
        </div>
    );
    return (
        <div className="flex gap-4 ml-auto items-center">
            <button onClick={() => signIn()}>Login</button>
        </div>
    )
}