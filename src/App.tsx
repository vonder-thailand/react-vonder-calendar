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
            startDate: new Date(2022, 1, 5),
            endDate: new Date(2022, 1, 7),
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
