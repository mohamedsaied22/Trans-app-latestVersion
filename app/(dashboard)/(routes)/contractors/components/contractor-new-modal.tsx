import { BadgePlus } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { motion } from "framer-motion";

const NewContractor = ({ contractors, onContractorCreated }) => {
  const [isNewContractorModalOpen, setIsNewContractorModalOpen] =
    useState(false);
  const [newContractor, setNewContractor] = useState({
    name: "",
    code: "",
    truckList: [],
    driverList: [],



  });
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const modalRef = document.getElementById("modal");

      if (modalRef && !modalRef.contains(event.target)) {
        closeModal();
      }
    };

    if (isNewContractorModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNewContractorModalOpen]);

  const openModal = () => {
    setIsNewContractorModalOpen(true);
    setIsButtonClicked(true);
  };

  const closeModal = () => {
    setNewContractor({
      name: "",
    code: "",
    truckList: [],
    driverList: [],
    });
    setIsNewContractorModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContractor((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission

    const existingContractor = contractors.find(
      (contractor) => contractor.code === newContractor.code
    );

    if (existingContractor) {
      toast.error("The Contractor Code already found!", {
        position: toast.POSITION.TOP_RIGHT,
        style: {
          background: "#8acaff", // Background color
          color: "#ffffff", // Text color
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow
          borderRadius: "12px 0  12px 0",
          width: "96%",
          fontSize: "bold",
        },
      });
    } else {
      closeModal();
      onContractorCreated(newContractor);
      // Show a success toast when a new vessel is created
      toast.success("Contractor created successfully!", {
        position: toast.POSITION.TOP_RIGHT,
        style: {
          background: "#8acaff", // Background color
          color: "#ffffff", // Text color
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow
          borderRadius: "12px 0  12px 0",
          width: "96%",
          fontSize: "bold",
        },
      });
    }
  };

  return (
    <div>
    {isNewContractorModalOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-70"
      >
        <motion.div
          initial={{ scale: 0, x: 0 }}
          animate={{ scale: 1, x: 0 }}
          exit={{ scale: 0, x: 0 }}
          transition={{ duration: 0.05, ease: "easeInOut" }}
          id="modal"
          ref={modalRef}
          className="bg-gradient-to-t from-gray-900 via-sky-900 to-sky-700 p-6 rounded-t-3xl grid border border-sky-700 shadow-md transition duration-500"
        >
          <div className="flex justify-between mb-8 shadow-xl bg-gradient-to-b from-sky-400 via-sky-700 to-sky-900 px-6 py-3 rounded-t-3xl">
            <h2 className="text-xl text-white drop-shadow-lg font-semibold mr-6">
              New Contractor
            </h2>
            <BadgePlus className="shadow-xl text-sky-300 font-semibold" />
          </div>
          <form onSubmit={handleSubmit} className="">
            <div className="flex justify-between items-center mb-4 shadow-md px-2">
              <span className="text-sm font-semibold mb-1 text-white mr-2">
                Contractor Name
              </span>
              <input
                className="px-2 py-1 border border-gray-300 rounded-2xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                type="text"
                name="name"
                value={newContractor.name}
                onChange={handleInputChange}
                placeholder="name"
                required
              />
            </div>

            <div className="flex justify-between items-center mb-4 shadow-md px-2">
              <span className="text-sm font-semibold mb-1 text-white mr-2">
                Contractor Code
              </span>
              <input
                className="px-2 py-1 border border-gray-300 rounded-2xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                type="text"
                name="code"
                value={newContractor.code}
                onChange={handleInputChange}
                placeholder="Code"
                required
              />
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
      New Contractor
      <span className="text-xl"> +</span>
    </button>
    <ToastContainer autoClose={5000} />
  </div>
  );
};

export default NewContractor;
