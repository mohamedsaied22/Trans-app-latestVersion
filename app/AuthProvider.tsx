'use client'
/**
 * @Project : sescoapp-API-main
 * @File : app/AuthProvider.tsx
 * @Author : Eng. Mustafa Elkhiat
 * @Date : 12/13/2023
 * @Time : 3:42 PM
 */
import {SessionProvider} from "next-auth/react";


export default function AuthProvider({children}) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}