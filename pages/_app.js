"use client"
//import "../styles/globals.css";
import 'tailwindcss/tailwind.css';
import { withLDProvider } from "launchdarkly-react-client-sdk";
import { deviceType, osName } from "react-device-detect";
import { v4 as uuidv4 } from 'uuid';
import ls from 'local-storage';

function getUserId() {
  let id;
  console.log(process.env.NEXT_PUBLIC_LD_CLIENT_KEY)
  if (ls.get('LD_User_Key')) {
    id = ls.get('LD_User_Key');
  } else {
    id = uuidv4();
    ls.set('LD_User_Key', id)
  }
  return id;
}

let id = getUserId()


function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default withLDProvider({
  clientSideID: process.env.NEXT_PUBLIC_LD_CLIENT_KEY,
  context: {
    "kind": "multi",
    "user": {
      "key": id,
    },
    "device": {
      "key": id,
      "name": "device",
      "deviceType": deviceType,
      "os": osName
    },
    "location": {
      "key": id,
      "timezone": "PST",
      "region": "US-West",
      "office": "HQ"
    }
  },
  options: {
    bootstrap: "localStorage",
  },
})(MyApp);
