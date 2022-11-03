import { useFlags } from 'launchdarkly-react-client-sdk';
import { Container, Image } from 'semantic-ui-react';


export default function Banner() {
  /* DEV NOTES
    As we all know, Unicorns love creativity. The Unicorns demanded that the banner be customizable for each of their users. Since they could agree on colors we had to add multiple options:
    
    Variant 1: 'lldblue'
    Variant 2: 'unicornshampoo'
    Variant 3: 'unicorntea'
    Variant 4: 'unicornmelon'
    Variant 5: 'unicornbananas'

    We'll want to serve a default value for users without a Unicorn color preference, head over to LaunchDarkly and create the correct flag with these varieties for whatever users you want!
  */

  const { textColor } = useFlags();

  return (
    <div>
      <div className="shadow-2xl lg:px-20">
        {textColor ?
          <div className={`col-span-3 content-evenly text-left py-10 text-xl md:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-br from-red-600 to-${textColor}`}><Image src='./unicorn.png' size='tiny' verticalAlign='middle' spaced='right' />Welcome to the new Unicorn.Rentals!</div>
          : <div className={`col-span-3 content-evenly text-left py-10 text-xl md:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-br from-red-600 to-lddblue`}><Image src='./unicorn.png' size='tiny' verticalAlign='middle' spaced='right' />Welcome to the new Unicorn.Rentals!</div>}
      </div>
    </div>
  );
}
