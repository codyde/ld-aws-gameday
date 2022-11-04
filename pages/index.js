import React, { useState } from "react";
import Head from "next/head";
import Loginbox from "../components/loginbox.js";
import Connection from "../components/connection.js";
import "semantic-ui-css/semantic.min.css";
import { useFlags } from "launchdarkly-react-client-sdk";
import toast, { Toaster } from "react-hot-toast";
import Banner from "../components/banner.js";
import Preview from "../components/preview.js";
import Herotext from "../components/herotext.js";
import Grid from "../components/grid.js";


export default function Home() {
  // Feature flags that are created and managed in LaunchDarkly
  const { siteRelease, logMode } = useFlags();
  const [userObj, setUserObj] = useState();
  //
  return (
    <div className="h-screen bg-ld-ls bg-repeat-y bg-center bg-cover">
      <Head>
        <title>UnicornRentals</title>
        <meta name="description" content="Built for exploring LaunchDarkly" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          className: "",
          duration: 5000,
          style: {
            background: "#00000",
            color: "#fffff",
          },
          success: {
            icon: "🚀",
            style: {
              fontSize: 22,
              background: "#282828",
              color: "white",
            },
          },
          error: {
            icon: "⚠️",
            style: {
              fontSize: 22,
              background: "#FF386B",
              color: "white",
            },
          },
        }}
      />
      {/* 
        ### DEV NOTES ###
        Our feature flag for the big release is below. Ensure it's been created in LaunchDarkly. 

        Flag Name/Key - siteRelease
        Flag Type - Boolean
      
      */}
      {siteRelease ?
        <div className="grid grid-cols-5">
          <div className="row-start-1 col-span-3">
            <Banner />
          </div>
          <div class='row-start-1 flex justify-end col-start-4 col-span-2 shadow-2xl'>
            <Loginbox userObj={userObj} setUserObj={setUserObj} />
          </div>
          <div className="row-start-2 col-span-5 items-end">
            <Herotext />
          </div>
          <div className="flex row-start-3 col-span-5 justify-center lg:text-2x xl:text-4x">
            <Grid userObj={userObj} />
          </div>
          {/* 
        
        ### DEV NOTES ###

        We can hide components behind a feature flag, and use targeting rules to control which users can see them - like a debug menu for a database connection!
        
        Here's a hint, you'll need to use these values:
        On value - 'debug'
        Off value - 'default'

        */}
          {logMode == 'debug' ? (
            <div className="flex row-start-4 col-span-5 justify-center">
              <Connection />
            </div>
          ) : null}
        </div> :
        <main className="h-screen bg-ld-ls grid grid-cols-4 grid-rows-3">
          <div className="grid col-span-4 row-start-2 items-center">
            <Preview />
          </div>
        </main>
      }
    </div>
  );
}
