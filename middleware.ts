/**
 * @Project : Internal Transportation Tracking
 * @File : /middleware.ts
 * @Author : Eng. Mustafa Elkhiat
 * @Date : 10/1/2023
 * @Time : 2:31 PM
 */

import {withAuth} from "next-auth/middleware"


export default withAuth(
    // `withAuth` augments your `Request` with the user's token.
    function middleware(req) {
    },
    {
        callbacks: {
            authorized: ({token}) => {
                return !!token
            },
        },
        pages: {
            signIn: '/login',
        }
    }
)

export const config = {matcher: ['/((?!auth).*)(.+)'],}