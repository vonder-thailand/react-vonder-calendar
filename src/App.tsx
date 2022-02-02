import React from "react";
import "./App.css";
import Calendar, {
  CalendarControlButton,
  CalendarHeader,
  CalendarWeekDay,
  DateEvent,
} from "./components/Calendar";

function App() {
  return (
    <div className="App">
      <Calendar
        type={"month"}
        displayFullEvent={false}
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
        <CalendarControlButton />
        <CalendarHeader />
        <CalendarWeekDay />
        <DateEvent />
      </Calendar>
    </div>
  );
}

export default App;
