"use client";

import React, { useEffect, useState } from "react";
import { Ship, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/heading";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import Pagination from "@/components/pagination";
import NewPattern from "./components/pattern-new";
import UpdatePattern from "./components/pattern-update";
import Filters from "@/components/filteration";
import SortOptions from "./components/pattern-sort";
import { POSTAPI, PUTAPI } from "@/utities/test";
import { toast } from "react-toastify";
import useSWR from "swr";
import { motion } from "framer-motion";


export default function PatternsPage() {
  const [filteredPatterns, setFilteredPatterns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const patternsPerPage = 18;
  const [sortOption, setSortOption] = useState("");
  const [originalPatterns, setOriginalPatterns] = useState([]);
  const [patternList, setPatternList] = useState([]);

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    "https://10.1.114.43:3030/api/pattern",
    fetcher
  );
  useEffect(() => {
    if (data) {
      setPatternList(data);
      setFilteredPatterns(data);
    }
  }, [data]);

  const filterPatterns = (filterValue) => {
    if (filterValue === "") {
      setFilteredPatterns(patternList);
      setCurrentPage(1);
    } else {
      const lowerCaseFilterValue = filterValue.toLowerCase();
      const filtered = patternList.filter((pattern) => {
        return (
          pattern.name.toLowerCase().includes(lowerCaseFilterValue) ||
          pattern.code.toLowerCase().includes(lowerCaseFilterValue) ||
          pattern.imex.toLowerCase().includes(lowerCaseFilterValue)
        );
      });

      setFilteredPatterns(filtered);
      setCurrentPage(1);
    }
  };

  const sortPatterns = (option) => {
    let sortedPatterns = [...patternList];

    switch (option) {
      case "all":
        // No filtering, display all patterns
        break;
      case "import":
        sortedPatterns = sortedPatterns.filter(
          (pattern) => pattern.imex === "IMPORT"
        );
        break;
      case "export":
        sortedPatterns = sortedPatterns.filter(
          (pattern) => pattern.imex === "EXPORT"
        );
        break;
      default:
        // No sorting
        break;
    }

    setFilteredPatterns(sortedPatterns);
  };

  const handleSortChange = (sortValue) => {
    setSortOption(sortValue);
    sortPatterns(sortValue);
  };

  const indexOfLastPattern = currentPage * patternsPerPage;
  const indexOfFirstPattern = indexOfLastPattern - patternsPerPage;
  const currentPatterns = filteredPatterns.slice(
    indexOfFirstPattern,
    indexOfLastPattern
  );
  const totalPages = Math.ceil(filteredPatterns.length / patternsPerPage);

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

  const handleAddPatternAPI = async (newPattern) => {
    const result = await POSTAPI("/api/pattern/", newPattern);
    if (result.statusCode === 401) {
      console.error(result.message);
    } else if (result.statusCode === 400 && result.message.includes("code")) {
        toast.error("The Pattern code already exists.", {
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
          });
      console.error(result.message);
    } else {
      setFilteredPatterns([...filteredPatterns, result]);
      setPatternList([...patternList, result]);
      toast.success("New Pattern created successfully!", {
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
      });
    }
  };

  const handleEditPatternAPI = async (pattern) => {
    const { _id, code, ...updatedPattern } = pattern;
    const result = await PUTAPI("/api/pattern/" + _id, updatedPattern);
    if (result.statusCode === 401) {
      console.error(result.message);
    } else if (result.statusCode === 400 && result.message.includes("code")) {
      console.error(result.message);
    } else {
      console.info(result);
      setFilteredPatterns(updatePatternList(result));
      setPatternList(updatePatternList(result));
      toast.success("Pattern updated successfully!", {
        position: toast.POSITION.TOP_RIGHT,
        style: {
          background: "#8acaff",
          color: "#ffffff",
          boxShadow:
            "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px 0  12px 0",
          width: "96%",
          fontSize: "bold",
        },
      });
    }
  };

  const updatePatternList = (updatedPattern) =>
    patternList.map((pattern) =>
      pattern.code === updatedPattern.code ? updatedPattern : pattern
    );

  if (isLoading) return <h1>Loading ...</h1>;

  if (!isLoading)
    return (
      <div className="">
        <Heading
          title="Pattern Operations"
          description="Navigating Your Pattern Fleet."
          icon={Upload}
          iconColor="text-sky-700"
        />

        <div className="px-1 flex flex-col md:flex-row mt-8 mb-2 justify-start items-center ">
          <div className="flex-1 mb-4 ">
            <Filters onFilterChange={filterPatterns} />
          </div>
          <div className="mb-4 ml-2">
            <SortOptions
              sortOption={sortOption}
              onSortChange={handleSortChange}
            />
          </div>
          <div className="mb-4">
            <NewPattern
              Patterns={filteredPatterns}
              onPatternCreated={handleAddPatternAPI} // Make sure this function is defined
            />
          </div>
        </div>

        <div
       

        className=" px-4 md:px-12 lg:px-16 space-y-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 ">
          {filteredPatterns.map((pattern, index) => (
            <Card
              key={index}
              className="p-4 border-2 border-gray-700 md:border-gray-100 rounded-2xl flex flex-col mt-4 shadow-md hover:shadow-xl transition rounded- "
            >
              <Link href={`/pattern/${pattern._id}`} key={index} legacyBehavior>
                <div
                
                className=" cursor-pointer  flex items-center justify-end mb-4 ">
                  <div className="w-full  ">
                    <div className="flex text-lg rounded-xl mb-2 bg-gray-100 shadow-lg p-2 border-2 border-gray-700 items-center justify-center rounded-t-2xl font-semibold">
                      <div className="text-right ">
                        {pattern.name || ".................."}
                      </div>
                    </div>
                    <div className="flex justify-between mb-2 shadow-md p-2">
                      <div className="text-left text-md">Code:</div>
                      <div className="text-right ">
                        {pattern.code || ".................."}
                      </div>
                    </div>
                    <div className="flex justify-between shadow-md p-2">
                      <div className="text-left text-md">IMEX:</div>
                      <div className="text-right ">
                        {pattern.imex || ".................."}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              <div className="flex justify-center px-1 ">
                <UpdatePattern
                  pattern={pattern}
                  onUpdatePattern={handleEditPatternAPI}
                />
              </div>
            </Card>
          ))}
        </div>

        <Pagination
          currentUsers={currentPatterns}
          currentPage={currentPage}
          totalPages={totalPages}
          goToPreviousPage={goToPreviousPage}
          goToNextPage={goToNextPage}
        />
      </div>
    );
}
