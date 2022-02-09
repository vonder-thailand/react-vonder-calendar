import React from "react";
import "./App.css";
import Calendar, {
  CalendarControlButton,
  // CalendarControlButton,
  CalendarHeader,
  CalendarWeekDay,
  DateEvent,
} from "./components/Calendar";

function App() {
  return (
    <div className="App" style={{ margin: "0 auto", padding: "1rem" }}>
      <Calendar
        type="month"
        // currentDate={new Date(2022, 3, 10)}
        // displayFullEvent={true}
        onClick={(date) => {
          console.log("date :", date);
        }}
        fixWeek
        // disableSwipe
        eventLists={[
          {
            id: 1,
            startDate: new Date(2022, 1, 1),
            endDate: new Date(2022, 1, 7),
            title: "Meeting",
          },
          {
            id: 2,
            startDate: new Date(2022, 1, 3),
            endDate: new Date(2022, 1, 3),
            title: "xxxxxxx",
          },
        ]}
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
          {({ currentDate }) => {
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
                <h3
                  style={{
                    fontSize: "20px",
                    color: "#3E4357",
                    marginBottom: "0",
                  }}
                >
                  {currentDate}
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
            padding: "1.5rem 0.5rem 0rem 0.5rem",
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
