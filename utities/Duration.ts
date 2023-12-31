/**
 * @Project : Internal Transportation Tracking
 * @File : utilities/Duration.ts
 * @Author : Eng. Mustafa Elkhiat
 * @Date : 9/26/2023
 * @Time : 2:31 PM
 */


function padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
}

export function convertMsToHM(milliseconds: number) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    // 👇️ if seconds are greater than 30, round minutes up (optional)
    //minutes = seconds >= 30 ? minutes + 1 : minutes;

    minutes = minutes % 60;

    // 👇️ If you don't want to roll hours over, e.g. 24 to 00
    // 👇️ comment (or remove) the line below
    // commenting next line gets you `24:00:00` instead of `00:00:00`
    // or `36:15:31` instead of `12:15:31`, etc.
    hours = hours % 24;

    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
}

export const DateTimeFormat: string = "DD/MM/YYYY hh:mm:ss A"