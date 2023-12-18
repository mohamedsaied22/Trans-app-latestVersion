"use client";

/**
 * @Project : sescoapp-API-main
 * @File : app/(dashboard)/(routes)/booking/components/BookingPattern.tsx
 * @Author : Eng. Mustafa Elkhiat
 * @Date : 12/12/2023
 * @Time : 2:39 PM
 */

import useSWR from "swr";
import { useEffect, useState } from "react";
import { POSTAPI } from "@/utities/test";
import {motion} from "framer-motion";


export default function BookingPattern({ booking }) {
  const [patternList, setPatternList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [berthList, setBerthList] = useState([]);
  const [warehouseList, setWarehouseList] = useState([]);
  const [activePatternList, setActivePatternList] = useState([]);
  const [selectedPatternCode, setSelectedPatternCode] = useState(null);
  const [pattern, setPattern] = useState(null);

  const [patternAccessRight, setPatternAccessRight] = useState({
    pattern: null,
    accessRightList: [],
  });
  useEffect(() => {
    console.log(patternAccessRight);
  });
  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    "https://10.1.114.43:3030/api/pattern/",
    fetcher
  );
  const {
    data: usersData,
    error: usersError,
    isLoading: usersIsLoading,
  } = useSWR("https://10.1.114.43:3030/api/users/", fetcher);
  const {
    data: berthData,
    error: berthError,
    isLoading: berthIsLoading,
  } = useSWR("https://10.1.114.43:3030/api/berth/", fetcher);
  const {
    data: warehouseData,
    error: warehouseError,
    isLoading: warehouseIsLoading,
  } = useSWR("https://10.1.114.43:3030/api/warehouse/", fetcher);

  useEffect(() => {
    setPatternList(data || []);
  }, [data]);
  useEffect(() => {
    setUserList(usersData || []);
  }, [usersData]);
  useEffect(() => {
    setBerthList(berthData || []);
  }, [berthData]);
  useEffect(() => {
    setWarehouseList(warehouseData || []);
  }, [warehouseData]);

  useEffect(() => {
    if (selectedPatternCode) {
      const pattern = getPattern(selectedPatternCode);
      setPattern(pattern);
      const patternRoles = pattern
        ? [
            ...new Set(
              pattern.checkPointList.map((checkPoint) => checkPoint.role)
            ),
          ]
        : [];
      setPatternAccessRight({
        pattern: getBookingPattern(selectedPatternCode),
        accessRightList: pattern.checkPointList.map((checkPoint) => {
          return {
            checkPoint,
            location: null,
            user: "",
          };
        }),
      });
    }
  }, [selectedPatternCode]);

  const getPattern = (code: string) =>
    getActivePatterns().find((pattern) => pattern.code === code);

  const getActivePatterns = () =>
    patternList.filter((pattern) => pattern.checkPointList.length);

  const getUserListByRole = (role: string) =>
    userList.filter((user) => user.role == role);

  const getLocationList = (locationType: string) => {
    switch (locationType) {
      case "Berth":
        return berthList;
      case "Warehouse":
        return warehouseList;
    }
  };

  const getLocation = (locationType: string, id: string) => {
    switch (locationType) {
      case "Berth":
        return berthList.find((berth) => berth._id === id);
      case "Warehouse":
        return warehouseList.find((warehouse) => warehouse._id === id);
    }
  };
  const getBookingPattern = (code: string) => {
    const { checkPointList, ...pattern } = getPattern(code);
    return pattern;
  };

  function getAccessRightByCheckPoint(checkPoint) {
    return patternAccessRight.accessRightList.find(
      (accessRight) => accessRight.checkPoint.id === checkPoint.id
    );
  }

  function updateAccessRight(checkPoint, updatedAccessRight) {
    setPatternAccessRight({
      ...patternAccessRight,
      accessRightList: patternAccessRight.accessRightList.map((accessRight) =>
        accessRight.checkPoint.id === checkPoint.id
          ? updatedAccessRight
          : accessRight
      ),
    });
  }

  const setAccessRightLocation = (checkPoint, value: string) => {
    let accessRight = getAccessRightByCheckPoint(checkPoint);
    accessRight.location = getLocation(checkPoint.locationType, value);
    updateAccessRight(checkPoint, accessRight);
  };

  const setAccessRightUser = (checkPoint, value: string) => {
    let accessRight = getAccessRightByCheckPoint(checkPoint);
    accessRight.user = value;
    updateAccessRight(checkPoint, accessRight);
  };

  const addPatternToBooking = async () => {
    const result = await POSTAPI(
      `/api/booking/${booking._id}/pattern`,
      patternAccessRight
    );
    if (result.statusCode === 400) {
      console.error(result.message);
    } else if (result.statusCode === 401) {
      console.error(result.message);
    } else {
      console.info(result);
    }
  };

  return (
    <motion.div
    initial={{opacity: 1, x: "-25%"}}
    animate={{opacity: 1, x: 0}}
    exit={{opacity: 0, x: "-100%"}}
    transition={{duration: 0.6, ease: "easeInOut"}}
    className=" md:px-12 mt-4">
               <div className="flex justify-center">

      <select
        className="px-2 py-1 mb-4 border rounded-full outline-none border-gray-300 h-9 mr-2 shadow-md cursor-pointer flex justify-center items-center"
        defaultValue={selectedPatternCode}
        onChange={(e) => setSelectedPatternCode(e.target.value)}
      >
        <option 
        selected hidden>
          Select Pattern
        </option>
        {getActivePatterns().map((pattern) => (
          <option
          className=" rounded-ful shadow-2xl border-none outline-none"
          key={pattern.code} value={pattern.code}>
            {pattern.name}
          </option>
        ))}
      </select>
      </div>
      {pattern && (
        <motion.div 
        initial={{opacity: 0, x: "-100%"}}
        animate={{opacity: 1, x: 0}}
        exit={{opacity: 0, x: "-100%"}}
        transition={{duration: 1.5, ease: "easeInOut"}}
        className="border-2 border-gray-300 p-2 md:p-6 bg-white rounded-2xl m-4 lg:w-fit lg:m-auto flex text-sm md:text-lg justify-center lg:gap-8">
          
          <div className=" ">
            {pattern.checkPointList.map((checkPoint, index) => (
              <div
                key={index}
                className=" px-2 py-1 mb-4 border rounded-xl border-gray-300 h-9 mr-2 shadow-md cursor-pointer flex justify-center items-center"
                >
                {checkPoint.label}
              </div>
            ))}
          </div>
          <div className=" ">
            {pattern.checkPointList.map((checkPoint, index) => (
              <div
                key={index}
                className="px-2 py-1 mb-4 border rounded-xl border-gray-300 h-9 mr-2 shadow-md cursor-pointer flex justify-center items-center"
                >
                <select
                  onChange={(e) =>
                    setAccessRightLocation(checkPoint, e.target.value)
                  }
                >
                  <option selected hidden
                  className="w-full p-8"
                  >
                    {" "}
                    Location
                  </option>
                  {getLocationList(checkPoint.locationType).map((location) => (
                    <option key={location.code} value={location._id}>
                      {location.number}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <div className="flex flex-col ">
            {pattern.checkPointList.map((checkPoint, index) => (
              <div
                key={index}
                className="px-2 py-1 mb-4 border rounded-xl border-gray-300 h-9 mr-2 shadow-md cursor-pointer flex justify-center items-center"
                >
                <select
                  onChange={(e) =>
                    setAccessRightUser(checkPoint, e.target.value)
                  }
                >
                  <option selected hidden>
                    Select User
                  </option>
                  {getUserListByRole(checkPoint.role).map((user) => (
                    <option key={user._id} value={user.email}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {pattern && <button onClick={addPatternToBooking}>Add Pattern</button>}
    </motion.div>
  );
}
