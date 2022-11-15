import React, { useState, useEffect } from "react";
import { useFlags } from "launchdarkly-react-client-sdk";
import ls from 'local-storage';
import { Icon, Button, Modal, Segment } from "semantic-ui-react";


export default function Connection() {
  const { dbDetails } = useFlags();
  const [userkey, setuserkey] = useState("anonymous")
  const [loc1, setloc1] = useState("INACTIVE");
  const [api1, setapi1] = useState("bg-ldred");
  const [api1loc, setapi1loc] = useState("UNKNOWN");
  const [debugid, setdebugid] = useState("UNKNOWN")


  async function setID() {
    let id = ls.get('LD_User_Key');
    setuserkey(id)
    return id
  }

  async function queryAPI() {
    let id = await setID()
    const ENDPOINT2 =
      window.location.protocol + "//" + window.location.host + "/health";
    const response = await fetch(ENDPOINT2);
    const data = await response.json();
    setloc1(data.status);
    if (response.status != 200) {
      setapi1("bg-ldred");
    } else {
      setapi1("bg-ldblue");
      setapi1loc(data.location);
    }
  }

  async function queryTeamDebug() {
    let id = await setID()
    const DEBUGENDPOINT =
      window.location.protocol + "//" + window.location.host + "/teamdebug";
    const response = await fetch(DEBUGENDPOINT);
    const data = await response.json();
    console.log(data);
    setdebugid(data.debugcode);
  }

  useEffect(() => {
    if (dbDetails) {
      console.log("Migrated DB online");
    } else {
      console.log("Local DB");
    }
    queryAPI();
    console.log("running useeffect");
    console.log("Note: If you are seeing UNKNOWN in the debug field; check your feature flags and TEAM_ID configuration")
  }, [dbDetails]);

  useEffect(() => {
    console.log("update to key detected")
  }, [userkey])

  useEffect(() => {
    queryTeamDebug()
    // console.log("Team Debug ID is ")
  }, [])


  const [firstOpen, setFirstOpen] = React.useState(false)

  return (
    <Segment basic textAlign='center'>
      <div>
        <p className="text-center mx-auto p-5 text-white text-xl">Debug error code is {debugid.toLowerCase()}</p>
      </div>
      <Button onClick={() => setFirstOpen(true)}>Check Database Connection</Button>

      <Modal
        onClose={() => setFirstOpen(false)}
        onOpen={() => setFirstOpen(true)}
        open={firstOpen}
        size="tiny"
      >
        <Modal.Header>The most secret DEBUG view</Modal.Header>
        <Modal.Content image>
          {dbDetails.mode == "Cloud" ?
            <div className='image'>
              <Icon name='check circle' />
            </div>
            :
            <div className='image'>
              <Icon name='warning sign' />
            </div>
          }
          <Modal.Description>
            <p className="text-center text-black text-xl">Connected to the{" "}
              <span className="text-ldred">{api1loc.toUpperCase()}</span> Database</p>
            <div className={`overflow-hidden h-8 flex px-8 pb-4 ${api1}`}>
              <p className="mx-auto text-white text-xl">{loc1.toUpperCase()}</p>
            </div>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setFirstOpen(false)} primary>
            Close <Icon name='right chevron' />
          </Button>
        </Modal.Actions>
      </Modal>
    </Segment>
  );
}
