/**
 * @Project : sescoapp-API-main
 * @File : app/(dashboard)/(routes)/booking/[bookingNumber]/truckDriver/[id]/trips/TripList.tsx
 * @Author : Eng. Mustafa Elkhiat
 * @Date : 12/17/2023
 * @Time : 11:10 PM
 */
import CheckPoint from "@/app/(dashboard)/(routes)/booking/[bookingNumber]/truckDriver/[id]/trips/CheckPoint";
import React from "react";


export default function TripList({tripList}) {

    let x = 1
    const resetX = () => {
        x = 1;
        return ''
    }

    const calculateNumberOfSpaces = (order, index) => {
        let numberOfSpaces = order - (index + x)
        x += numberOfSpaces
        return numberOfSpaces;
    }


    const handleSpaces = (order, index) => {
        const numberOfSpaces = calculateNumberOfSpaces(order, index)
        // @ts-ignore
        return Array(numberOfSpaces).fill().map(obj => <div className="min-w-[300px]"></div>)
    }

    return (
        <div className="bg-white p-5 m-5 rounded-2xl shadow-lg overflow-x-auto">
            <h1 className="text-lg font-bold my-2">Trips Details</h1>
            {tripList.length > 0 && <div className="flex flex-col gap-4 mx-auto">
                {tripList.map((trip, tripIndex) => <div className="flex gap-4 items-center">
                    {resetX()}
                    {<div>{tripIndex + 1}</div>}
                    {trip.tripCheckPointList.map((checkPoint, index) => {
                            return (
                                <>
                                    {handleSpaces(checkPoint.checkPoint.order, index)}
                                    <CheckPoint
                                        key={index}
                                        checkPoint={checkPoint.checkPoint.label} time={checkPoint.time}
                                        done={index < trip.tripCheckPointList.length - 1 || !trip.isOpened}
                                        duration={checkPoint.duration}
                                        addedBy={checkPoint.createdBy}/>
                                </>)
                        }
                    )}
                    <br/>
                </div>)}
            </div>}
            {tripList.length === 0 && <h1>No Trips Yet</h1>}
        </div>
    )


}