/**
 * @Project : Internal Transportation Tracking
 * @File : app/login/page.tsx
 * @Author : Eng. Mustafa Elkhiat
 * @Date : 10/1/2023
 * @Time : 1:29 AM
 */
import LoginForm from "@/app/(auth)/(routes)/login/LoginForm";


export default function Page() {
    return (
        <div className="flex flex-col justify-center items-center">
            <LoginForm/>
        </div>
    );
}