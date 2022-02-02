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
            startDate: new Date(2021, 0, 30),
            endDate: new Date(2022, 1, 2),
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
