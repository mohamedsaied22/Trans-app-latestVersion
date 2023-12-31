import {getSession} from "next-auth/react";

const getToken = async () => {
    const session = await getSession()
    return session.accessToken
}
const http = async (url, options) => {
    options = {
        ...options,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,PUT",
            "Authorization": `Bearer ${await getToken()}`
        }
    }
    return fetch(url, {method: options.method, headers: options.headers, body: options.body})
}
export const HTTP_GET = (url) => {
    return http(url)
}
export const HTTP_POST = (url, body) => {
    const options = {method: "POST", body: JSON.stringify(body)}
    return http(url, options)
}

export const HTTP_PUT = (url, body) => {
    const options = {method: "PUT", body: JSON.stringify(body)}
    return http(url, options)
}

/*export async function POSTAPI(url: string, body: object) {
    const res = await HTTP_POST(`${process.env.NEXT_PUBLIC_api_url}${url}`, body)
    if (!res.ok) {
        const text = await res.text();
        return {errors: JSON.parse(text).errors}
    }
    return {data: await res.json()}
}*/
export async function POSTAPI(url, body) {
    const res = await HTTP_POST(`${process.env.NEXT_PUBLIC_api_url}${url}`, body)
    return res.json()
}

/*export async function PUTAPI(url: string, body: object) {
    const res = await HTTP_PUT(`${process.env.NEXT_PUBLIC_api_url}${url}`, body)
    if (!res.ok) {
        const text = await res.text();
        return {errors: JSON.parse(text).errors}
    }
    return {data: await res.json()}
}*/
export async function PUTAPI(url, body) {
    const res = await HTTP_PUT(`${process.env.NEXT_PUBLIC_api_url}${url}`, body)
    return await res.json()
}

 export const fetcher = async (url) => fetch(url, {headers: {"Authorization": `Bearer ${await getToken()}`}}).then(res => res.json())