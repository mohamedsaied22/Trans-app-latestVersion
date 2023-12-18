/**
 * @Project : Internal Transportation Tracking
 * @File : app/login/layout.tsx
 * @Author : Eng. Mustafa Elkhiat
 * @Date : 10/1/2023
 * @Time : 1:46 AM
 */
import {ReactNode} from "react";
import {Metadata} from "next";

export const metadata :Metadata ={
    title : "Sign In"
}
export default function Layout({children}: { children: ReactNode }) {
    return (
        <div>{children}</div>
    );
}