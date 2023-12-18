/**
 * @Project : Internal Transportation Tracking
 * @File : app/api/auth/[...nextauth]/route.ts
 * @Author : Eng. Mustafa Elkhiat
 * @Date : 10/1/2023
 * @Time : 11:12 AM
 */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {signOut} from "next-auth/react";
import {cookies} from "next/headers";

const handler = NextAuth(
    {
        session: {
            strategy: 'jwt',
            maxAge: 1 * 60 * 60 // 4 hours
        },
        providers: [
            CredentialsProvider({
                // The name to display on the sign in form (e.g. 'Sign in with...')
                //name: 'credentials',
                // The credentials is used to generate a suitable form on the sign in page.
                // You can specify whatever fields you are expecting to be submitted.
                // e.g. domain, username, password, 2FA token, etc.
                // You can pass any HTML attribute to the <input> tag through the object.
                credentials: {},

                async authorize(credentials, req) {
                    // You need to provide your own logic here that takes the credentials
                    // submitted and returns either a object representing a user or value
                    // that is false/null if the credentials are invalid.
                    // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                    // You can also use the `req` object to obtain additional parameters
                    // (i.e., the request IP address)

                    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
                    const res = await fetch(`${process.env.api_url}/auth/login`, {
                        method: 'POST',
                        body: JSON.stringify(credentials),
                        headers: {"Content-Type": "application/json"}
                    })
                    const user = await res.json()
                    // If no error and we have user data, return it
                    if (res.ok && user) {
                        return user
                    }
                    // Return null if user data could not be retrieved
                    return null
                },

            }),

        ],
        pages: {
            signIn: "/login",
        },
        /*callbacks: {

            async signIn({user, account, profile}) {
                console.log("userDto : "+JSON.stringify(user.userDto))
                console.log("token : "+user.token)

                return true;
            },
            async jwt({token, user, account, profile, isNewUser}) {
                if(user)

                console.log("jwt Token : "+JSON.stringify(token))
                console.log("jwt user : "+JSON.stringify(user))
                // Add access_token to the token right after signin
                if (account?.accessToken) {
                    token.accessToken = account.accessToken
                }
                return token
            },
            async session({session, user}) {
                console.log(session,user)
                return session
            },
        }*/
        callbacks: {

            async jwt({token, user}) {


                /*if (user) {
                    token.accessToken = user.token
                    token.user = user
                }
                return token*/

                if(user) return {...token,...user}
                return token
            },

            async session({session, token}) {
                session.accessToken = token.access_token
                session.user = token.userDto
                return session
            }
        }
    }
);
export {handler as GET, handler as POST};