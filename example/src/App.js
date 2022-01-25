import React from "react";
import "./App.css";
import Calendar, {
  CalendarControlButton,
  CalendarHeader,
  CalendarWeekDay,
  DateEvent,
} from "react-vonder-calendar";

function App() {
  return (
    <div className="App">
      <h2>Calendar</h2>
      <Calendar
        type={"month"}
        displayFullEvent
        eventLists={[
          {
            id: 1,
            startDate: new Date(2021, 11, 30),
            endDate: new Date(2022, 0, 2),
            events: [
              {
                title: "Meeting",
              },
            ],
          },
        ]}
      >
        <CalendarControlButton />
        <CalendarHeader />
        <CalendarWeekDay />
        <DateEvent />
      </Calendar>
    </div>
  );
}

export default App;
