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
import {Heading} from "@/components/heading";
import { ArrowLeftRight } from "lucide-react";



export default function TransactionPage() {
    const [lat, setLat] = useState<number>(0)
    const [long, setLong] = useState<number>(0)
    const [qrCodeValue, setQrCodeValue] = useState<string>(null)
    const parsedQrCode = JSON.parse(qrCodeValue)


    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function (position) {
            setLat(position.coords.latitude);
            setLong(position.coords.longitude);
        });
    }, [])

    useEffect(() => {
        if (qrCodeValue) {
            const body = {
                lat, long, truckDriverId: parsedQrCode.truckDriverId
            }
            console.log(`Scanned : ${qrCodeValue}`, body)
        }
    }, [qrCodeValue]);


    const addCheckPointToTrip = async (body: any) => {
        const result = await POSTAPI(`/api/booking/${parsedQrCode.bookingNumber}/tripCheckPoint`, body)
    }


    return (
                 <div className="">
            <Heading
                title="Transactions Operations"
                description="Navigating Your Pattern Fleet."
                icon={ArrowLeftRight}
                iconColor="text-sky-700"
            />
            {qrCodeValue && <div className="my-4">{qrCodeValue} </div>}
            {lat && long && <div className="my-4">fdsfs</div>}
            <div className="w-72 h-72 mx-auto">
                <QrScanner
                    onDecode={(result) => setQrCodeValue(result)}
                    onError={(error) => console.log(error?.message)}
                />

            </div>
        </div>
    );
}