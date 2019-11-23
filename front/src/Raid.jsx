import React, { useState } from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import Axios from "axios";

function Raid() {
  let { raidId } = useParams();
  console.log(raidId);
  const [raid, setRaid] = useState(false);
  if (!raid) {
    console.log("UPDATE ");
    Axios.get(`/raid/${raidId}`).then(({ data }) => {
      setRaid(data);
    });
  }
  console.log(raid);
  return <div>
      
      {raid.name}
      
      
      
      </div>;
}
export default Raid;
