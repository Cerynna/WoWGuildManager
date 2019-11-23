import React, { useState, useRef } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { indexStatusRaidForUser } from "../../../database";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";

function Day({ day }) {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [event, setEvent] = useState(false);
  const [classStatus, setClassStatus] = useState(false);
  const raid = useRef();
  let url = `/raid/${new Date(day).getDate()}/${new Date(
    day
  ).getMonth()}/${new Date(day).getFullYear()}`;
  axios.get(url).then(({ data }) => {
    if (data && event === false) {
      setEvent(data);
    }
  });
  if (event && classStatus === false) {
    // console.log(indexStatusRaidForUser(event, cookies.user));
    const { indexAccept, indexRefuse } = indexStatusRaidForUser(
      event,
      cookies.user
    );
    if (indexAccept !== "") {
      setClassStatus("accept");
    }
    if (indexRefuse !== "") {
      setClassStatus("refuse");
    }
  }
  return (
    <div className={classNameDay(day)} key={new Date(day).getTime()}>
      <div className="number">{new Date(day).getDate()}</div>
      <div className="events">
        {event ? (
          <div className={`raid ${classStatus}`} ref={raid}>
            <Link to={`/raid/${event.id}`}>
              <div className={`icon ${event.type}`}> </div>
            </Link>
            <div className="info">
              <div className="name">{event.name}</div>
              <div className="hours">
                {event.date.hours}h{event.date.min}
              </div>
              <div className="tools">
                <div
                  className="refuse"
                  onClick={() => {
                    axios
                      .post("/api/raid/refuse", {
                        id: event.id,
                        user: cookies.user
                      })
                      .then(({ data }) => {
                        if (data) {
                          setClassStatus("refuse");
                        }
                      });
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </div>
                <div
                  className="accept"
                  onClick={() => {
                    axios
                      .post("/api/raid/accept", {
                        id: event.id,
                        user: cookies.user
                      })
                      .then(({ data }) => {
                        if (data) {
                          setClassStatus("accept");
                        }
                      });
                  }}
                >
                  <FontAwesomeIcon icon={faCheck} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          false
        )}
        {/* <div className="raid mc">
          <div className="name">MC</div>
          <div className="hours">20h30</div>
          <div className="tools">
            <div className="refuse">X</div>
            <div className="accept">V</div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
function classNameDay(date) {
  let result = ["day"];
  let dayRaid = new Date(date).getDate();
  let monthRaid = new Date(date).getMonth();
  let yearRaid = new Date(date).getFullYear();

  let dayNow = new Date(Date.now()).getDate();
  let monthNow = new Date(Date.now()).getMonth();
  let yearNow = new Date(Date.now()).getFullYear();

  if (dayRaid == dayNow && monthRaid == monthNow && yearRaid == yearNow) {
    result.push("today");
  } else if (new Date(date).getTime() < Date.now()) {
    result.push("passed");
  }

  return result.join(" ");
}
export default Day;
