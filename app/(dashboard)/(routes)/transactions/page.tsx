'use client'
/**
 * @Project : sescoapp-API-main
 * @File : app/(dashboard)/(routes)/transactions/page.tsx
 * @Author : Eng. Mustafa Elkhiat
 * @Date : 12/7/2023
 * @Time : 12:05 PM
 */
import {QrScanner} from "@yudiel/react-qr-scanner";
import {POSTAPI} from "@/utities/test";
import {useEffect, useState} from "react";


export default function TransactionPage() {
    const [lat, setLat] = useState<number>(0)
    const [long, setLong] = useState<number>(0)
    const [qrCodeValue, setQrCodeValue] = useState<string>(null)
    const parsedQrCode = JSON.parse(qrCodeValue)
    const [message, setMessage] = useState("")


    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function (position) {
            setLat(position.coords.latitude);
            setLong(position.coords.longitude);
        }, (error) => {
            console.log(error);
        }, {
            enableHighAccuracy: true,
            maximumAge: 10000,
            timeout: 5000,
        });
    }, [])

    useEffect(() => {
        if (qrCodeValue) {
            const body = {
                lat, long, truckDriverId: parsedQrCode.truckDriverId
            }
            console.log(`Scanned : ${qrCodeValue}`, body)
            setMessage('')
            addCheckPointToTrip(body).then((result) => {
                console.log(result.message)
                setMessage(result.message)
            })
        }
    }, [qrCodeValue]);


    const addCheckPointToTrip = async (body: any) => {
        return await POSTAPI(`/api/booking/${parsedQrCode.bookingNumber}/tripCheckPoint`, body)
    }


    return (
        <div>
            {/*{qrCodeValue && <div className="my-4">{qrCodeValue}</div>}
            {lat && long && <div className="my-4">{lat} , {long}</div>}*/}
            {/* {message.error && <div className="my-4 text-red-400">{message.error.message}</div>}*/}
            {message && <div className="my-4 text-green-400">{message}</div>}

            {lat && long && !qrCodeValue && <div className="w-72 h-72 mx-auto">
                <QrScanner
                    onDecode={(result) => setQrCodeValue(result)}
                    onError={(error) => console.log(error?.message)}
                />

            </div>
            }
            {!lat && !long && <h1> Location is loading... </h1>}
            {!message && qrCodeValue && <div>...Loading</div>}
        </div>
    );
}