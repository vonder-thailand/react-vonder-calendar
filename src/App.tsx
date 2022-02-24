import React, { useState } from "react";
import "./App.css";
import Calendar, {
  CalendarControlButton,
  // CalendarControlButton,
  CalendarHeader,
  CalendarWeekDay,
  DateEvent,
} from "./components/Calendar";

function App() {
  const [date, setDate] = useState();
  console.log("date2 ; ", date);

  const MOCK = [
    1644969600000, 1644987600000, 1645365600000, 1645416000000, 1645430400000,
    1645434000000, 1645452000000, 1645657200000, 1645696800000, 1645704000000,
  ];

  const test = MOCK.map((date, index) => {
    return {
      id: index,
      startDate: new Date(date),
      endDate: new Date(date),
      title: "test",
    };
  });
  console.log("test ::: ", test);

  return (
    <div className="App" style={{ margin: "0 auto", padding: "1rem" }}>
      <Calendar
        type="month"
        // currentDate={new Date(2022, 1, 10)}
        // displayFullEvent={true}
        onClick={(date) => {
          console.log("date :", date);
          setDate(date);
        }}
        fixWeek
        // disableSwipe
        eventLists={test}
      >
        {/* <div
          style={{
            background:
              "linear-gradient(251.44deg, #E1D7FF 0.75%, #FFF4DE 98.69%)",
            padding: "0.5rem",
            borderRadius: "12px",
          }}
        > */}
        <CalendarControlButton />
        <CalendarHeader>
          {({ currentDate, goNextMonth, activeMonth, activeYear, goToDay }) => {
            console.log("activeYear : ", activeYear);
            console.log("activeMonth :", activeMonth);
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingBottom: "1rem",
                  alignItems: "start",
                  textIndent: "1.25rem",
                }}
              >
                <button onClick={() => goToDay()}>back</button>
                <h3
                  onClick={() => goNextMonth!()}
                  style={{
                    fontSize: "20px",
                    color: "#3E4357",
                    marginBottom: "0",
                  }}
                >
                  {currentDate} {activeMonth} {activeYear}
                </h3>
                <h4 style={{ margin: "0", fontWeight: 400, color: "#6E7282" }}>
                  ขอให้เป็นวันที่ดี 😆
                </h4>
              </div>
            );
          }}
        </CalendarHeader>
        <div
          style={{
            background: "white",
            borderRadius: "12px",
          }}
        >
          <CalendarWeekDay />
          <DateEvent />
        </div>
        {/* </div> */}
        {/* <CalendarControlButton /> */}
      </Calendar>
    </div>
  );
}

export default App;
