import { AlertCircle, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { motion } from "framer-motion"; // Import motion from framer-motion



function ReturnTruckFromMaintenance({ returnedTruck, onReturnTruck }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [truck, setTruck] = useState({
    code: "",
    license: "",
    type: "",
    status: ""
  });
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const modalElement = document.getElementById("modal");
      if (modalElement && !modalElement.contains(event.target)) {
        closeModal();
      }
    };

    if (isModalOpen) {
      window.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  useEffect(() => {
    setTruck(returnedTruck);
  }, [returnedTruck]);

  const openModal = () => {
    setIsModalOpen(true);
    setIsButtonClicked(true);
  };

  const closeModal = () => {
    setTruck({
      code: "",
      license: "",
      type: "",
      status: ""
    });
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTruck((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onReturnTruck(truck);
    closeModal();

    /*toast.success("Truck updated successfully!", {
      position: toast.POSITION.TOP_RIGHT,
    });*/
  };

  return (
    <div>
      {isModalOpen && (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-70">
          <motion.div


initial={{ scale: 0, x: 0 }} // Initial position from left
animate={{ scale: 1, x: 0 }} // Animate to the center
exit={{ scale: 0, x: 0 }} // Exit to the left
transition={{ duration: .05, ease: 'easeInOut' }} // Custom transition

            id="modal"
            ref={modalRef}
            className="bg-white p-4 rounded-2xl grid transition duration-500"
          >
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold mb-4 drop-shadow-md mr-8">
                Are you sure you want to return this truck from Maintenance?
              </h2>
              <AlertCircle className="shadow-lg font-bold text-red-600" />
            </div>

            <div className="flex justify-end">
              <button
                className="px-4 py-1 bg-red-500 text-white rounded-lg mr-2 shadow-md hover:scale-95"
                onClick={handleSubmit}
              >
                Return
              </button>
              <button
                className="px-2 py-1 bg-gray-300 rounded-lg shadow-md hover:scale-95"
                onClick={() => {
                  setTruck({
                    code: "",
                    license: "",
                    type: "",
                    status: ""
                  });
                  setIsModalOpen(false);
                }}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <button
        className={`px-1 py-1 bg-red-400 text-white rounded-lg shadow-md ${
          isButtonClicked ? "hover:bg-red-500" : "hover:bg-red-500"
        } transition`}
        onClick={openModal}
      >
        Return From Maintenance
      </button>
      <ToastContainer autoClose={3000} />

    </div>
  );
}

export default ReturnTruckFromMaintenance;
