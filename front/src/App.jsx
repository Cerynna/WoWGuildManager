import React, { useRef } from "react";
import "./stylesheets/main.css";
import { useCookies } from "react-cookie";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Calendar from "./calendar";
import Login from "./Login";
import MyCharacter from "./MyCharacter";
import Raid from "./Raid";

function App() {
  const [cookies, setCookie, removeCookie] = useCookies();
  const login = useRef();
  const pass = useRef();

  if (cookies.token) {
    // console.log("TOKKEN EXIST", cookies.token);
    axios.post("/auth/verif", { token: cookies.token }).then(({ data }) => {
      if (!data) {
        removeCookie("token");
        window.location.reload();
      }
    });
    return (
      <Router>
        <div className="App">
          <div id="nav">
            <ul>
              <li>
                <Link to="/calendar">Calendrier</Link>
              </li>
              <li>Roster</li>
              <li>
                <Link to="/mycharater">Mon Personnage</Link>
              </li>
              <li>WishList</li>
            </ul>
            <div
              className="profil"
              onClick={() => {
                removeCookie("token");
                window.location.reload();
              }}
            >
              profil
            </div>
          </div>
          <div id="main">
            <Switch>
              <Route path="/calendar">
                <Calendar />
              </Route>
              <Route path="/mycharater">
                <MyCharacter />
                {/* LOL */}
              </Route>
              <Route exact={true} path="/">
                LOL
              </Route>
              <Route path="/raid/:raidId">
                <Raid />
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    );
  } else {
    return <Login />;
  }
}

export default App;
