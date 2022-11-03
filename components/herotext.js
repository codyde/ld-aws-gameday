import React from "react";
import { useFlags } from 'launchdarkly-react-client-sdk';

export default function Herotext() {
  const { textColor } = useFlags();
  return (
    <div>
      <div className="p-10 lg:px-28 py-8">
        {textColor ?
          <div className={`mx-auto py-4 text-2xl md:text-4xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-br from-ldyellow to-${textColor} text-center`}>
            Your one stop shop for all your Unicorn needs!
          </div>
          :
          <div className="mx-auto py-4 text-2xl md:text-4xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-br from-ldyellow to-lddblue text-center">
            Your one stop shop for all your Unicorn needs!
          </div>}
        <div>
          <p className="mx-auto py-4 text-ldgraytext text-xl text-center">
            It's impossible to quantify the amount of value that we bring. You can only experience it through our first class offerings. Words on this page will never be able to succinctly convey all that we can do for you.
          </p>
        </div>
      </div>
    </div>
  );
}
