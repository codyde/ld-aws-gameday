import React, { useState, useEffect } from "react";
import { useLDClient } from "launchdarkly-react-client-sdk";
import Radium, { StyleRoot } from "radium";
import toast, { Toaster } from "react-hot-toast";
import ls from 'local-storage';
import { Segment, Form } from "semantic-ui-react";

export default function Loginbox({ userObj, setUserObj }) {
  const LDClient = useLDClient();

  const [userState, setUserState] = useState({
    username: "",
  });

  async function setCurrLDUser() {
    const obj = await LDClient.getContext()
    return obj;
  }

  const submitUser = async (e) => {
    e.preventDefault();
    const lduser = await setCurrLDUser();
    lduser.user.key = userState.username;
    await LDClient.identify(lduser);
    const response = await fetch(
      window.location.protocol +
      "//" +
      window.location.host +
      "/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(lduser)
    }
    )
    await ls.remove('LD_User_Key')
    await ls.set('LD_User_Key', userState.username)
    LDClient.track('userLogin', { customProperty: userState.username });
    toast.success("Your LaunchDarkly user is " + userState.username);
    setUserObj(userState.username)
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );
  };

  useEffect(() => {
    setUserState(LDClient.getContext())
  }, [])

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  async function setCurrLDUser() {
    const obj = await LDClient.getContext();
    return obj;
  }

  const submitLogout = async (e) => {
    e.preventDefault();
    const lduser = await setCurrLDUser();
    lduser.user.key = "anonymous";
    await LDClient.identify(lduser);
    await fetch(
      window.location.protocol +
      "//" +
      window.location.host +
      "/logout", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    )
    await ls.remove('LD_User_Key')
    LDClient.track('userClear', { customProperty: userState.username });
    toast.success("User has been cleared");
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );
  };

  return (
    <div className="p-12 py-16 items-center content-center">
      <Form inverted size="small">
        <Form.Group inline>
          {/* <p className="mx-auto font-normal text-ldgraytext text-sm lg:text-lg my-6 max-w-lg">
              This login field will create a user object with the LaunchDarkly
              SDK. This user object can be used to interact with targeting
              rules allowing specific feature configurations to be enabled or
              disabled based on users.
            </p> */}
          <div>
            <Form.Input
              type="input"
              id="username"
              placeholder="Enter Username"
              value={userState.username}
              onChange={handleChange}
            />
          </div>
          <Form.Button
            name='login'
            color='purple'
            onClick={submitUser.bind(userState)}
          >Login</Form.Button>
          <Form.Button
            inverted
            name='clear user'
            onClick={submitLogout.bind(userState)}
          >Clear User</Form.Button>
        </Form.Group>
      </Form>
    </div>
  );
}


