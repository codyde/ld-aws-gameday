import React, { useEffect, useState } from "react";
import ls from "local-storage";
import { Image, Card } from 'semantic-ui-react';

export default function Grids(userObj) {
  async function setID() {
    let id = ls.get("LD_User_Key");
    return id;
  }

  const [dummyData, setDummyData] = useState([]);

  const seedData = [
    {
      "id": 1,
      "title": "Debug Ipsum 1",
      'text': "This is our debug text. Charlie ate the last candy bar.",
      'image': './unicorn-mane.jpg'
    },
    {
      "id": 2,
      "title": "Debug Ipsum 2",
      "text": "We're debugging all the Unicorns. They are trampling our code.",
      'image': './unicorn-rainbow.jpg'
    },
    {
      "id": 3,
      "title": "Debug Ipsum 3",
      "text": "Will it ever end? Speculation is nay. It likely won't.",
      'image': './unicorn-dab.png'
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      let id = await setID();
      const response = await fetch(
        window.location.protocol +
        "//" +
        window.location.host +
        "/datas"
      );
      if (response.status != 200) {
        setDummyData(seedData);
        return seedData;
      } else {
        const nbdData = await response.json();
        setDummyData(nbdData[0]);
      }
    };
    fetchData();
  }, [userObj]);

  return (
    <div className="p-20 py-15 gap-1">
      <Card.Group>
        {dummyData.map(function (card) {
          return (
            <Card color="purple" raised>
              <Image src={card.image} size="small" centered />
              <Card.Content key={card.id}>
                <Card.Header>
                  {card.title}
                </Card.Header>
                <Card.Description>
                  {card.text}
                </Card.Description>
              </Card.Content>
            </Card>
          );
        })}
      </Card.Group>
    </div>
  );
}
