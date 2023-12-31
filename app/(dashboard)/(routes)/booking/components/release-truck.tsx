import {useState, useRef, useEffect} from "react";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {motion} from "framer-motion";
import {AlertCircle} from "lucide-react";
import {PUTAPI} from "@/utities/test";

const ReleaseTruck = ({
                          booking,
                          truckDriver,
                          onTruckReleased,
                          releasedTruck = [],
                      }) => {
    const [isReleaseTruckModalOpen, setIsReleaseTruckModalOpen] = useState(false);
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const modalRef = useRef(null);
    const [releaseType, setReleaseType] = useState(""); // State for release type
    const [reason, setReason] = useState(""); // State for release reason

    useEffect(() => {
        const handleClickOutside = (event) => {
            const modalElement = document.getElementById("modal");
            if (modalElement && !modalElement.contains(event.target)) {
                releaseModal();
            }
        };

        if (isReleaseTruckModalOpen) {
            window.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isReleaseTruckModalOpen]);

    const openModal = () => {
        setIsReleaseTruckModalOpen(true);
        setIsButtonClicked(true);
    };

    const releaseModal = () => {
        setIsReleaseTruckModalOpen(false);
        setIsButtonClicked(false);
    };

    const handleTruckRelease = async () => {
        if (!releaseType) {
            toast.error("Please select release type.");
            return;
        }

        let api_url = "";
        switch (releaseType) {
            case "MAINTENANCE":
                api_url =
                    "/api/booking/" + booking.bookingNumber + "/maintenanceRelease";
                break;
            case "NEEDLESS":
                api_url = "/api/booking/" + booking.bookingNumber + "/needlessRelease";
                break;
        }

        const body = {truckDriverId: truckDriver.id, reason}

        const result = await PUTAPI(api_url, body);
        console.log(result);
        if (result.statusCode === 403) {
            console.error(result.message)
            toast.error(result.message, {
                position: toast.POSITION.TOP_RIGHT,
                style: {
                    background: "#8acaff",
                    color: "#ffffff",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)",
                    borderRadius: "12px 0  12px 0",
                    width: "96%",
                    fontSize: "bold",
                },
            });
        } else {
            onTruckReleased(result);
            releaseModal();

            toast.success("Truck released successfully!", {
                position: toast.POSITION.TOP_RIGHT,
                style: {
                    background: "#8acaff",
                    color: "#ffffff",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)",
                    borderRadius: "12px 0  12px 0",
                    width: "96%",
                    fontSize: "bold",
                },
            });
        }
    };

    return (
        <div>
            {!truckDriver.truckDriverStatus || truckDriver.truckDriverStatus !== "RELEASED" ? (
                <>
                    {isReleaseTruckModalOpen && (
                        <motion.div
                            className="fixed  z-50 inset-0 flex items-center justify-center bg-gray-700 bg-opacity-70"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                        >
                            <motion.div
                                id="modal"
                                ref={modalRef}
                                className=" bg-gradient-to-t from-gray-900 via-sky-900 to-sky-700 p-6 rounded-t-3xl grid border border-sky-700 shadow-md transition duration-500"
                                initial={{scale: 0, x: "-0%"}}
                                animate={{scale: 1, x: 0}}
                                exit={{scale: 0, y: "0%"}}
                                transition={{duration: 0.05, ease: "easeInOut"}}
                            >
                                {/* Modal content */}
                                <div className="flex justify-between items-center mb-4 shadow-md px-2">
                                    <h2 className="text-sm font-semibold mb-1 text-white mr-2">
                                        Release:
                                        <select
                                            className="px-2 py-1 cursor-pointer ml-8 text-gray-600 border border-gray-300 rounded-2xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                                            value={releaseType}
                                            onChange={(e) => setReleaseType(e.target.value)}
                                            style={{width: "235px"}} // Set a fixed width (adjust as needed)
                                        >
                                            <option value="">Select Type</option>
                                            <option value="MAINTENANCE">Maintenance</option>
                                            <option value="NEEDLESS">Needless</option>
                                        </select>
                                    </h2>
                                </div>
                                <div className="flex justify-between items-center mb-4 shadow-md px-2 ">
                                    <h2 className="text-sm font-semibold mb-1 text-white mr-2">
                                        Reason:
                                        <input
                                            type="text"
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            className="ml-8 px-2 py-1 text-black border border-gray-300 rounded-2xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                                            placeholder="Enter Reason"
                                            style={{width: "240px"}} // Set a fixed width (adjust as needed)
                                        />
                                    </h2>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        className="px-4 py-1 bg-red-500 text-white rounded-lg mr-2 shadow-md hover:scale-95"
                                        onClick={handleTruckRelease}
                                    >
                                        Release
                                    </button>
                                    <button
                                        className="px-2 py-1 bg-gray-300 rounded-lg shadow-md hover:scale-95"
                                        onClick={releaseModal}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    <button
                        className={`px-1 py-1 ml-2 bg-red-400 text-white text-center text-sm rounded-lg shadow-lg ${
                            isButtonClicked
                                ? "hover:bg-red-400 "
                                : "hover:bg-red-600 hover:scale-[95%]"
                        } transition`}
                        onClick={openModal}
                        disabled={truckDriver.truckDriverStatus === "RELEASED"} // Disable the button if status is "Released"
                        style={{
                            cursor:
                                truckDriver.truckDriverStatus === "RELEASED"
                                    ? "not-allowed"
                                    : "pointer",
                            display:
                                truckDriver.truckDriverStatus === "RELEASED" ? "none" : "block", // Hide the button when the truck is released
                        }}
                    >
                        <div className="flex p-1 text ">
                            Release
                            <AlertCircle className="w-4 ml-1"/>
                        </div>
                    </button>
                </>
            ) : null}
            <ToastContainer autoClose={5000}/>
        </div>
    );
};

export default ReleaseTruck;
