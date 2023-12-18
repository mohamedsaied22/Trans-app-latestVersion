
//import { UserButton } from "@clerk/nextjs";
'use client'
import MobileSidebar from "@/components/mobile-sidebar";
import SignInButton from "@/components/SignInButton";



const Navbar = () => {

    return (
        <div className="flex items-center p-4">
            <MobileSidebar/>
            <div className="flex w-full justify-end">

                <SignInButton/>
                {/*<UserButton  afterSignOutUrl="/"/>*/}
            </div>
        </div>
    )
}

export default Navbar;