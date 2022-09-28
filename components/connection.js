import React, { useState, useEffect } from "react";
import { useFlags } from "launchdarkly-react-client-sdk";
import Modal from "./modal";
import ls from 'local-storage';


export default function Connection() {
  const { dbDetails } = useFlags();
  const [userkey, setuserkey] = useState("anonymous")
  const [loc1, setloc1] = useState("INACTIVE");
  const [api1, setapi1] = useState("bg-ldred");
  const [api1loc, setapi1loc] = useState("UNKNOWN");
  const [debugid, setdebugid] = useState("UNKNOWN")


  async function setID(){
    let id = ls.get('LD_User_Key');
    setuserkey(id)
    return id
  }
  
  async function queryAPI() {
    let id = await setID()
    const ENDPOINT2 =
    window.location.protocol + "//" + window.location.host + "/health?LD_USER_KEY="+id;
    const response = await fetch(ENDPOINT2);
    const data = await response.json();
    setloc1(data.status);
    if (data.status != "healthy") {
      setapi1("bg-ldred");
    } else {
      setapi1("bg-ldblue");
      setapi1loc(data.location);
    }
  }

  async function queryTeamDebug() {
    let tid = process.env.NEXT_PUBLIC_TEAM_ID
    const DEBUGENDPOINT =
    window.location.protocol + "//" + window.location.host + "/teamdebug?TEAM_ID="+tid;
    const response = await fetch(DEBUGENDPOINT);
    const data = await response.json();
    setdebugid(data.id);
  }

  useEffect(() => {
    if (dbDetails) {
      console.log("RDS online");
    } else {
      console.log("Local DB");
    }
    queryAPI();
    console.log("running useeffect");
  }, [dbDetails]);

  useEffect(() => {
    console.log("update to key detected")
  }, [userkey])

  useEffect(() => {
    queryTeamDebug()
    console.log("Team Debug ID is ")
  }, [])

  return (
    <div className="flex mx-auto w-full space-x-4">
      <div
        className="grid mx-auto justify-center items-center bg-ldgray shadow-2xl py-8 px-8 w-full"
      >
        <div>
          <h1 className="text-center font-bold text-ldgraytext text-base lg:text-4xl">
            Connected to the{" "}
            <span className="text-ldred">{api1loc.toUpperCase()}</span> Database
          </h1>
          <div className={`overflow-hidden h-8 flex px-8 pb-4 ${api1}`}>
            <p className="mx-auto text-black text-xl">{loc1.toUpperCase()}</p>
          </div>
          <div className="grid mx-auto py-4">
            <Modal dbDetails={dbDetails} />
          </div>
          <div>
          <p className="text-center mx-auto text-white text-xl">Debug ID for team is {debugid.toUpperCase()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
