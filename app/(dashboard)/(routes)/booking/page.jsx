"use client";

// Import necessary modules and components
import React, { useEffect, useState } from "react";
import { CalendarDays, CheckSquare, ShieldX } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/heading";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import Pagination from "@/components/pagination";
import Filters from "@/components/filteration";
import SortOptions from "./components/booking-sorting";
import NewBooking from "./components/booking-new";
import UpdateBooking from "./components/booking-update";
import DeleteBooking from "./components/booking-delete";
import CloseBooking from "./components/booking-closed";
import { motion } from "framer-motion";

import useSWR from "swr";
import { POSTAPI, PUTAPI } from "/utities/test";

// Main component for BookingsPage
export default function BookingsPage() {
  // State variables
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("");
  const [originalBookings, setOriginalBookings] = useState([]);
  const [closedBookings, setClosedBookings] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [bookingList, setBookingList] = useState([]);

  // Constants
  const bookingsPerPage = 18;

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    "https://10.1.114.43:3030/api/booking/",
    fetcher
  );

  useEffect(() => {
    setBookingList(data || []);
    setFilteredBookings(data || []);
  }, [data]);

  const searchBookings = (searchValue) => {
    setFilteredBookings(
      bookingList.filter(
        (booking) =>
          booking.bookingNumber
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          booking.workOrderNumber
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          booking.vessel.name
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          booking.cargo.name
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          booking.subCargo.name
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          booking.imex.toLowerCase().includes(searchValue.toLowerCase()) ||
          booking.bookingStatus
            .toLowerCase()
            .includes(searchValue.toLowerCase())
      )
    );
  };

  const handleAPIAddBooking = async (booking) => {
    try {
      const result = await POSTAPI("/api/booking", booking);
      console.log(result);

      if (
        result.statusCode === 400 &&
        result.message.includes("bookingNumber")
      ) {
        console.error(result.message);
        // Handle validation error
        // toast
      } else if (result.statusCode === 400) {
        // console.
      } else {
        setFilteredBookings([...filteredBookings, result]);
        //toast
        toast.success("New Booking Created successfully!", {
          position: toast.POSITION.TOP_RIGHT,
          style: {
            background: "#8acaff", // Background color
            color: "#ffffff", // Text color
            boxShadow:
              "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow
            borderRadius: "12px 0  12px 0",
            width: "96%",
            fontSize: "bold",
          },
        });
      }
    } catch (error) {
      console.error("Error adding contractor:", error);
      // Handle error
    }
  };

  const handleAPIUpdateBooking = async (updatedBooking) => {
    try {
      const { _id, code, ...booking } = updatedBooking;
      const result = await PUTAPI("/api/booking/" + _id, booking);

      if (result.statusCode === 400 && result.message.includes("code")) {
        // Handle validation error
        // toast
      } else {
        setFilteredBookings(
          filteredBookings.map((booking) =>
            booking._id === _id ? updatedBooking : booking
          )
        );
        //toast
      }
    } catch (error) {
      console.error("Error booking contractor:", error);
      // Handle error
    }
  };

  // Function to handle sort changes
  const handleSortChanges = (sortValue) => {
    setSortOption(sortValue);

    switch (sortValue) {
      case "all":
        searchBookings("");
        break;
      case "closed":
        searchBookings("CLOSED");

        break;
      case "opened":
        searchBookings("OPENED");

        break;
      default:
        // No sorting
        break;
    }
  };

  // Function to filter bookings based on search value
  const filterBySearch = (booking) => {
    const lowerCaseFilterValue = searchValue.toLowerCase();
    return Object.values(booking).some((value) =>
      String(value).toLowerCase().includes(lowerCaseFilterValue)
    );
  };

  // Function to handle sort change
  const handleSortChange = (sortValue) => {
    setSortOption(sortValue);
    sortBookings(sortValue);
  };

  // Function to handle pagination
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to handle the creation of a new booking
  const handleBookingCreated = (newBooking) => {
    newBooking.id = uuidv4();
    newBooking.voyages = 0;

    const updatedBookings = [...filteredBookings, newBooking];
    setFilteredBookings(updatedBookings);
    setOriginalBookings(updatedBookings); // Update originalBookings
    localStorage.setItem("Bookings", JSON.stringify(updatedBookings));
    localStorage.setItem(`bookings_${newBooking.id}`, JSON.stringify([]));
  };

  // Function to handle the update of a booking
  const handleUpdateBooking = (updatedBooking) => {
    const bookingIndex = filteredBookings.findIndex(
      (booking) => booking.id === updatedBooking.id
    );

    if (bookingIndex !== -1) {
      const updatedBookings = [...filteredBookings];
      updatedBookings[bookingIndex] = updatedBooking;
      setFilteredBookings(updatedBookings);
      setOriginalBookings(updatedBookings); // Update originalBookings
      localStorage.setItem("Bookings", JSON.stringify(updatedBookings));
    }
  };

  // Function to handle the deletion of a booking
  const handleDeleteBooking = (booking) => {
    const updatedBookings = filteredBookings.filter((q) => q.id !== booking.id);
    setFilteredBookings(updatedBookings);
    localStorage.setItem("Bookings", JSON.stringify(updatedBookings));
  };

  // Function to handle the closure of a booking
  const handleBookingClosed = (closedBooking) => {
    setClosedBookings((prevClosedBookings) => [
      ...prevClosedBookings,
      closedBooking,
    ]);

    const updatedBooking = { ...closedBooking, status: "Closed" };
    handleUpdateBooking(updatedBooking);
  };

  // Calculate pagination values
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  // JSX structure for the component
  return (
    <div className="">
      {/* Heading */}
      <Heading
        title="Booking Management"
        description="Monitor all bookings in one place.."
        icon={CalendarDays}
        iconColor="text-sky-700"
      />

      {/* Filter and Sorting Controls */}
      <div
      
      className="px-4 md:px-12 mb-4 flex flex-col md:flex-row mt-8 justify-start items-center ">
        <div className="flex-1 mb-4 ">
          <Filters onFilterChange={searchBookings} />
        </div>
        <div className="mb-4 ml-2">
          <SortOptions
            sortOption={sortOption}
            onSortChange={handleSortChanges}
          />
        </div>
        <div className="mb-4">
          <NewBooking
            bookings={filteredBookings}
            onBookingCreated={handleAPIAddBooking}
          />
        </div>
      </div>

      {/* Display Bookings */}
{/* Display Bookings */}
<div className="px-4 md:px-12 lg:px-16 rounded-2xl ">
  <div
  
   className="overflow-x-auto ">
    <table
                  initial={{ opacity: 0, x: "-100%" }} // Initial position from left
                  animate={{ opacity: 1, x: 0 }} // Animate to the center
                  exit={{ opacity: 0, x: "-100%" }} // Exit to the left
                  transition={{ duration: 0.3, ease: "easeInOut" }} // Custom transition
    
    className="w-full bg-white shadow-xl rounded-t-3xl overflow-hidden ">
      <thead className="bg-gray-300 text-s-700  border border-gray-300 shadow-xl">
        <tr>
          {/* ... your existing table headers */}
          <th className="py-3 px-6 text-center">NO</th>
                <th className="py-3 px-6 text-center">Work Order</th>
                <th className="py-3 px-6 text-center">Vessel</th>
                <th className="py-3 px-6 text-center">Cargo</th>
                <th className="py-3 px-6 text-center">Sub Cargo</th>
                <th className="py-3 px-6 text-center">IMEX</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
      {currentBookings.map((booking, index) => (
  <Link
    href={`/booking/${booking.bookingNumber}/truckDriver`}
    key={index}
    legacyBehavior
  >
    <tr
      className={`border border-gray-300 scale-50 ${
        index % 2 === 0 ? "bg-white " : "bg-gray-100"
      } hover:bg-sky-100 hover:shadow-md transition-all`}
      style={{ cursor: "pointer", fontSize: "14px", padding: "8px" }}
    >
      <td className=" text-center">
        {booking.bookingNumber || "..........."}
      </td>
      <td className=" text-center">
                    {booking.workOrderNumber || "..........."}
                  </td>
                  <td className="text-center px-2">
                    {booking.vessel.name || "..........."}
                  </td>
                  <td className="text-center px-2">
                    {booking.cargo.name || "..........."}
                  </td>
                  <td className="text-center">
                    {booking.subCargo.name || "..........."}
                  </td>
                  <td className="text-center">
                    {booking.imex || "..........."}
                  </td>
                  <td className="py-2 px-6 text-center">
                    {booking.status === "Closed" ? (
                      <div className="text-red-500 font-semibold flex">
                        <ShieldX className="inline-block mr-1" />
                        Closed
                      </div>
                    ) : (
                      <div className="text-green-500 font-semibold flex">
                        <CheckSquare className="inline-block mr-1" />
                        Open
                      </div>
                    )}
                  </td>
      {/* ... other td elements ... */}
      <td className="py-2 px-6 text-center">
        <div className="flex items-center justify-center">
          <UpdateBooking
            bookings={filteredBookings}
            booking={booking}
            onUpdateBooking={handleAPIUpdateBooking}
          />
          {/* <DeleteBooking
            booking={booking}
            onDeleteBooking={() => handleDeleteBooking(booking)}
          /> */}
          <CloseBooking
            booking={booking}
            onBookingClosed={handleBookingClosed}
          />
        </div>
      </td>
    </tr>
  </Link>
))}

      </tbody>
    </table>
  </div>
</div>


      {/* Pagination */}
      <Pagination
        currentUsers={currentBookings}
        currentPage={currentPage}
        totalPages={totalPages}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
      />
    </div>
  );
}
