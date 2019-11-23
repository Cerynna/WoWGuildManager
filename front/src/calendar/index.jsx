import React, { useState } from "react";
import { Calendar } from "calendar";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";



import Day from "./Day";

const cal = new Calendar(1);

function CalendarDiv() {
  const [mIndex, setMIndex] = useState(new Date().getMonth());
  const [yIndex, setYIndex] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(null);

  if (currentMonth === null) {
    setCurrentMonth(cal.monthDates(yIndex, mIndex));
  }

  const stringMonth = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Aout",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre"
  ];
  return (
    <div id="Calendar">
      <div className="header">
        <div
          className="prev"
          onClick={() => {
            if (mIndex - 1 >= 0) {
              setMIndex(mIndex - 1);
              setCurrentMonth(null);
            } else {
              setYIndex(yIndex - 1);
              setMIndex(11);
              setCurrentMonth(null);
            }
          }}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </div>
        <div className="current">
          {stringMonth[mIndex]} - {yIndex}
        </div>
        <div
          className="next"
          onClick={() => {
            console.log(mIndex + 1);
            if (mIndex + 1 <= 11) {
              setMIndex(mIndex + 1);
              setCurrentMonth(null);
            } else {
              setYIndex(yIndex + 1);
              setMIndex(0);
              setCurrentMonth(null);
            }
          }}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
      </div>
      <div className="weekheader">
        <div className="day">Lundi</div>
        <div className="day">Mardi</div>
        <div className="day">Mercredi</div>
        <div className="day">Jeudi</div>
        <div className="day">Vendredi</div>
        <div className="day">Samedi</div>
        <div className="day">Dimanche</div>
      </div>
      {currentMonth !== null
        ? currentMonth.map((week, index) => {
            let days = [];
            week.forEach((day, i) => {
              days.push(
                
                  <Day day={day} key={`day_${mIndex}_${i}`} />
                
              );
            });
            return (
              <div className="week" key={`week_${index}`}>
                {days}
              </div>
            );
          })
        : false}
    </div>
  );
}
export default CalendarDiv;
