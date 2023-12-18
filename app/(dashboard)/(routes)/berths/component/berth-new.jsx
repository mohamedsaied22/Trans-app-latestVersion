import {BadgePlus, ShieldPlus} from "lucide-react";
import {useState, useEffect, useRef} from "react";

import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {motion} from "framer-motion";

const NewBerth = ({berths, onBerthCreated}) => {
    const [isNewBerthModalOpen, setIsNewBerthModalOpen] = useState(false);
    const [newBerth, setNewBerth] = useState({
        number: "",
        code: "",
        lat: 0,
        long: 0,
        branch: "",
    });
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const modalRef = useRef(null);
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function (position) {
            setNewBerth({...newBerth, lat: position.coords.latitude, long: position.coords.longitude});
        },(error) => {
            console.log(error);
        },{
            enableHighAccuracy: true,
            maximumAge: 10000,
            timeout: 5000,
        });
    }, [isNewBerthModalOpen])


    useEffect(() => {
        const handleClickOutside = (event) => {
            const modalRef = document.getElementById("modal");

            if (modalRef && !modalRef.contains(event.target)) {
                closeModal();
            }
        };

        if (isNewBerthModalOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isNewBerthModalOpen]);

    const openModal = () => {
        setIsNewBerthModalOpen(true);
        setIsButtonClicked(true);
    };

    const closeModal = () => {
        setNewBerth({
            number: "",
            code: "",
            lat: 0,
            long: 0,
            branch: "",
        });
        setIsNewBerthModalOpen(false);
    };

    const handleInputChange = (e) => {

        const {name, value} = e.target;
        setNewBerth((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent form submission

        const existingBerth = berths.find((berth) => berth.code === newBerth.code || berth.number === newBerth.number);

        if (existingBerth) {
            toast.error("The Berth already exists.", {
                style: {
                    background: "#9acaff", // Background color
                    color: "#ffffff", // Text color
                    boxShadow:
                        "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow
                    borderRadius: "12px 0  12px 0",
                    width: "98%",
                    fontSize: "bold",
                },
            });
        } else {
            closeModal();
            onBerthCreated(newBerth);

            // Show a success toast when a new vessel is created
            /*toast.success("New Berth created successfully!", {
                position: toast.POSITION.TOP_RIGHT,

                style: {
                    background: "#9acaff", // Background color
                    color: "#ffffff", // Text color
                    boxShadow:
                        "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow
                    borderRadius: "12px 0  12px 0",
                    width: "98%",
                    fontSize: "bold",
                },
            });*/
        }
    };

    return (
        <div>
            {isNewBerthModalOpen && (
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-70"
                >
                    <motion.div
                        id="modal"
                        ref={modalRef}
                        className="bg-gradient-to-t from-gray-900 via-sky-900 to-sky-700 p-6 rounded-t-3xl grid border border-sky-700 shadow-md transition duration-500"
                        initial={{scale: 0, x: "-0%"}}
                        animate={{scale: 1, x: 0}}
                        exit={{scale: 0, y: "0%"}}
                        transition={{duration: 0.05, ease: "easeInOut"}}
                    >
                        <div
                            className="flex justify-between mb-8 shadow-xl bg-gradient-to-b from-sky-400 via-sky-700 to-sky-900 px-6 py-3 rounded-t-3xl">
                            <h2 className="text-xl text-white drop-shadow-lg font-semibold mr-6">
                                New Berth
                            </h2>
                            <ShieldPlus className="shadow-xl text-sky-300  font-semibold"/>
                        </div>
                        <form onSubmit={handleSubmit} className="">
                            <div className="flex justify-between items-center mb-4 shadow-md px-2">
                <span className="text-sm font-semibold mb-1 text-white mr-2">
                  Berth Number
                </span>
                                <input
                                    className="px-2 py-1 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                                    type="text"
                                    name="number"
                                    value={newBerth.number}
                                    onChange={handleInputChange}
                                    placeholder="number"
                                    required
                                />
                            </div>

                            <div className="flex justify-between items-center mb-4 shadow-md px-2 ">
                <span className="text-sm  font-semibold mb-1 text-white mr-2">
                  Berth Code
                </span>
                                <input
                                    className="px-2 py-1 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                                    type="text"
                                    name="code"
                                    value={newBerth.code}
                                    onChange={handleInputChange}
                                    placeholder="Code"
                                    required
                                />
                            </div>

                            <div className="flex justify-between items-center mb-4 shadow-md px-2">
                <span className="text-sm font-semibold mb-1 text-white mr-2">
                  Latitude
                </span>
                                <input
                                    className="px-2 py-1 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                                    type="number"
                                    step="any"
                                    name="lat"
                                    value={newBerth.lat}
                                    onChange={handleInputChange}
                                    placeholder="Latitude"
                                    required
                                />
                            </div>
                            <div className="flex justify-between items-center mb-4 shadow-md px-2">
                <span className="text-sm font-semibold mb-1 text-white mr-2">
                  Longitude
                </span>
                                <input
                                    className="px-2 py-1 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                                    type="number"
                                    name="long"
                                    step="any"
                                    value={newBerth.long}
                                    onChange={handleInputChange}
                                    placeholder="Longitude"
                                    required
                                />
                            </div>
                            <div className="flex justify-between items-center mb-4 shadow-md px-2">
                <span className="text-sm font-semibold mb-1 text-white mr-2">
                  Branch
                </span>
                                <select
                                    className="px-2 py-1 cursor-pointer text-gray-600 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                                    name="branch"
                                    value={newBerth.branch}
                                    onChange={handleInputChange}
                                    style={{width: "233px"}} // Set a fixed width (adjust as needed)
                                >
                                    <option value="" selected hidden>Branch</option>
                                    <option value="Damietta">Damietta</option>
                                    <option value="El-Dekheila">El-Dekheila</option>
                                    <option value="Abu Qir">Abu Qir</option>
                                    <option value="El-Adabia">El-Adabia</option>
                                    <option value="PortSaid">PortSaid</option>
                                </select>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    className={`px-4 py-1 bg-sky-400 text-white rounded-lg mr-2 shadow-md ${
                                        isButtonClicked
                                            ? "hover:bg-sky-500 hover:scale-95"
                                            : "hover:scale-95"
                                    }`}
                                    type="submit"
                                >
                                    Save
                                </button>
                                <button
                                    className="px-2 py-1 bg-gray-300 rounded-lg shadow-md hover:scale-95"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}

            <button
                className={`lg:mr-16 px-2 py-1 bg-sky-400 text-white rounded-lg shadow-md ${
                    isButtonClicked
                        ? "hover:bg-sky-400"
                        : "hover:scale-[95%] hover:bg-sky-500"
                } transition`}
                onClick={openModal}
            >
                New Berth
                <span className="text-xl"> +</span>
            </button>

            <ToastContainer autoClose={4000}/>
        </div>
    );
};

export default NewBerth;
