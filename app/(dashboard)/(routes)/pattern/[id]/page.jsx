"use client";

import React, { useEffect, useState } from "react";
import { Heading } from "@/components/heading";
import Link from "next/link";
import { Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import CheckPointData from "../components/checkPoint-data";
import { v4 as uuidv4 } from "uuid";
import useSWR from "swr";
import {POSTAPI, PUTAPI} from "@/utities/test";
import {toast} from "react-toastify";
// import UpdatePattern from "/components/Pattern-Update";

const PatternInfo = ({ params }) => {
  const [pattern, setPattern] = useState(null);
  const [checkPoints, setCheckPoints] = useState([]);
  const [filteredCheckPoints, setFilteredCheckPoints] = useState([]);
  const [filteredPatterns, setFilteredPatterns] = useState([]);

  const id = params.id;

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
      "https://10.1.114.43:3030/api/pattern/" + id,
      fetcher
  );

  useEffect(() => {
    setPattern(data);
  }, [data]);

  /*useEffect(() => {
    const Patterns = JSON.parse(localStorage.getItem("Patterns")) || [];
    const foundPattern = Patterns.find((c) => c.id === id);

    if (foundPattern) {
      setPattern(foundPattern);
      const PatternCheckPoints =
        JSON.parse(localStorage.getItem(`checkPoints_${id}`)) || [];
      foundPattern.checkPoints = PatternCheckPoints.length;
      setFilteredPatterns(Patterns);
    }

    const PatternCheckPoints =
      JSON.parse(localStorage.getItem(`checkPoints_${id}`)) || [];
    setCheckPoints(PatternCheckPoints);
    setFilteredCheckPoints(PatternCheckPoints);
  }, [id]);*/

  if (!pattern) {
    return <div>Loading...</div>;
  }

  const handleCheckPointCreated = (newCheckPoint) => {
    newCheckPoint.id = uuidv4();
    const updatedCheckPoints = [...checkPoints, newCheckPoint];
    setCheckPoints(updatedCheckPoints);
    localStorage.setItem(
      `checkPoints_${id}`,
      JSON.stringify(updatedCheckPoints)
    );

    const updatedPattern = {
      ...pattern,
      checkPoints: pattern.checkPoints + 1,
    };
    setPattern(updatedPattern);
    localStorage.setItem(`Pattern_${id}`, JSON.stringify(updatedPattern));

    setFilteredPatterns((prevState) => {
      const index = prevState.findIndex((v) => v.id === updatedPattern.id);
      if (index !== -1) {
        prevState[index] = updatedPattern;
      }
      return [...prevState];
    });
  };

  const handleAddCheckPointAPI = async (newCheckPoint) => {
    const result = await POSTAPI("/api/pattern/"+id +"/checkpoint", newCheckPoint);
    if (result.statusCode === 401) {
      console.error(result.message)
    } else if (result.statusCode === 400 ) {
      console.error(result.message)
    } else {
      console.info(result)
      setPattern(result)
      toast.success("New Check Point created successfully!", {
        position: toast.POSITION.TOP_RIGHT,
        style: {
          background: "#9acaff", // Background color
          color: "#ffffff", // Text color
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow
          borderRadius: "12px 0  12px 0",
          width: "98%",
          fontSize: "bold",
        },
      });
    }
  }
  const handleEditCheckPointAPI = async (editedCheckPoint) => {
    editedCheckPoint.order = +editedCheckPoint.order
    const result = await PUTAPI("/api/pattern/"+id +"/checkpoint", editedCheckPoint);
    if (result.statusCode === 401) {
      console.error(result.message)
    } else if (result.statusCode === 400 ) {
      console.error(result.message)
    } else {
      console.info(result)
      setPattern(result)
      toast.success("Checkpoint updated successfully!", {
        position: toast.POSITION.TOP_RIGHT,
        style: {
          background: "#9acaff",
          color: "#ffffff",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px 0  12px 0",
          width: "98%",
          fontSize: "bold",
        },
      });
    }
  }

  const handleUpdateCheckPoint = (updatedCheckPoint) => {
    const checkPointIndex = checkPoints.findIndex(
      (checkPoint) => checkPoint.id === updatedCheckPoint.id
    );

    if (checkPointIndex !== -1) {
      const updatedCheckPoints = [...checkPoints];
      updatedCheckPoints[checkPointIndex] = updatedCheckPoint;
      setCheckPoints(updatedCheckPoints);

      const filteredCheckPointsIndex = filteredCheckPoints.findIndex(
        (checkPoint) => checkPoint.id === updatedCheckPoint.id
      );

      if (filteredCheckPointsIndex !== -1) {
        const updatedFilteredCheckPoints = [...filteredCheckPoints];
        updatedFilteredCheckPoints[filteredCheckPointsIndex] =
          updatedCheckPoint;
        setFilteredCheckPoints(updatedFilteredCheckPoints);
        localStorage.setItem(
          `checkPoints_${id}`,
          JSON.stringify(updatedCheckPoints)
        );
      }
    }
  };

  const handleUpdatePattern = (updatedPattern) => {
    setPattern(updatedPattern);

    const PatternIndex = filteredPatterns.findIndex(
      (Pattern) => Pattern.id === updatedPattern.id
    );

    if (PatternIndex !== -1) {
      const updatedPatterns = [...filteredPatterns];
      updatedPatterns[PatternIndex] = updatedPattern;
      setFilteredPatterns(updatedPatterns);
      localStorage.setItem("Patterns", JSON.stringify(updatedPatterns));
    }
  };

  return (
    <div>
      <Link href="/pattern">
      <Heading
          title="Pattern Operations"
          description="Navigating Your Pattern Fleet."
          icon={Upload}
          iconColor="text-sky-700"
        />
      </Link>

      <div className="px-4 md:px-12 lg:px-16 space-y-4  grid  xl:grid-cols-2 gap-4">
        <Card className="p-4  border-black/5 flex flex-col mt-4 shadow-md hover:shadow-xl transition rounded-xl ">
          <div className=" ">
            <div className="flex text-lg  mb-2 bg-gray-100 shadow-lg p-2 items-center justify-center rounded-t-2xl font-semibold">
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
        </Card>
      </div>

      <div>
        <CheckPointData
          checkPoints={pattern.checkPointList}
          onCheckPointCreated={handleAddCheckPointAPI}
          onUpdateCheckPoint={handleEditCheckPointAPI}
        />
      </div>
    </div>
  );
};

export default PatternInfo;
