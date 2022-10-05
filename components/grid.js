import React, { useEffect, useState } from "react";
import ls from "local-storage";

export default function Grids() {
  async function setID() {
    let id = ls.get("LD_User_Key");
    return id;
  }

  const [dummyData, setDummyData] = useState([]);

  const seedData = [
    {
      id: 1,
      title: "Debug Ipsum 1",
      text: "This is our debug text. Charlie ate the last candy bar.",
    },
    {
      id: 2,
      title: "Debug Ipsum 2",
      text: "We're debugging all the Unicorns. They are trampling our code.",
    },
    {
      id: 3,
      title: "Debug Ipsum 3",
      text: "Will it ever end? Speculation is nay. It likely won't.",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      let id = await setID();
      const response = await fetch(
        window.location.protocol +
          "//" +
          window.location.host +
          "/datas?LD_USER_KEY=" +
          id
      );
      console.log("DEBUG MODE = The return code is " + response.status);
      console.log("Your current ID is " + id);
      if (response.status != 200) {
        setDummyData(seedData);
        console.log(seedData);
        return seedData;
      } else {
        const nbdData = await response.json();
        setDummyData(nbdData);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="grid space-x-4 justify-center invisible sm:invisible md:visible">
      <div className="grid grid-cols-3 col-span-4 space-x-4 justify-center">
        {dummyData.map(function (card) {
          return (
            <div
              className={`mx-auto w-3/4 shadow-2xl bg-ldgray py-3 px-3 text-white`}
            >
              <h1 className="text-2xl sm:text-base xl:text-2xl">
                {card.title}
              </h1>
              <p className="text-ldgraytext text-xl invisible md:text-xl xl:text-xl sm:invisible md:invisible xl:visible">
                {card.text}
              </p>
            </div>
          );
        })}
        {/* <div
          className={`mx-auto w-3/4 shadow-2xl bg-ldgray py-3 px-3 text-white`}
        >
          <h1 className="text-2xl sm:text-base xl:text-2xl">
            Unicorn with Confidence
          </h1>
          <p className="text-ldgraytext text-xl invisible md:text-xl xl:text-xl sm:invisible md:invisible xl:visible">
            Because you can always be confident when Unicorn.Rentals is providing your Unicorn.
          </p>
        </div>
 
        <div
          className={`mx-auto w-3/4 shadow-2xl bg-ldgray py-3 px-3 text-white`}
        >
          <h1 className=" text-2xl sm:text-base xl:text-2xl">
            Mythically Reliabile
          </h1>
          <p className="text-ldgraytext text-xl invisible md:text-xl xl:text-xl sm:invisible md:invisible xl:visible">
            If you can't trust that your Unicorn is going to be available when you ask for it, what can you really trust in this world?
          </p>
        </div>
        <div
          className={`mx-auto w-3/4 shadow-2xl bg-ldgray  py-3 px-3 text-white`}
        >
          <h1 className="text-2xl sm:text-base xl:text-2xl">
            Automagic Unicornation
          </h1>
          <p className="text-ldgraytext text-xl invisible md:text-xl xl:text-xl sm:invisible md:invisible xl:visible">
            The Unicorn is neither missing nor present. Its Automagic. It arrives when it needs to be there, and not a second before. 
          </p>
        </div> */}
      </div>
    </div>
  );
}
