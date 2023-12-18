/**
 * @Project : Internal Transportation Tracking
 * @File : app/booking/[bookingNum]/trucks/trips/Status.tsx
 * @Author : Eng. Mustafa Elkhiat
 * @Date : 9/13/2023
 * @Time : 5:10 PM
 */
import {convertMsToHM} from "@/utities/Duration";


interface StatusProp {
    checkPoint: string;
    time: string;
    done: boolean;
    duration: number;
    addedBy: string
}

export default function CheckPoint({time, checkPoint, done, addedBy, duration}: StatusProp) {
    return (
        <div
            className={`flex-col rounded-2xl border-2 ${done ? 'text-green-500 border-green-500' : 'text-orange-400 border-orange-400'} bg-zinc-100 dark:bg-zinc-600 p-2 min-w-[300px]`}>
            <div className="flex justify-between capitalize items-center">
                <div className="text-small capitalize">{checkPoint}</div>
                <div className="font-bold">{duration ? convertMsToHM(duration) : ''}</div>
            </div>
            <div className="flex justify-between text-tiny capitalize items-center">
                <div>{time}</div>
                <div>{addedBy}</div>
            </div>
        </div>
    );
}