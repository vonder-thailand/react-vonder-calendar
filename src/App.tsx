import React, { Fragment, useState } from "react";
import "./App.css";
import Calendar, {
  CalendarControlButton,
  // CalendarControlButton,
  // CalendarHeader,
  CalendarWeekDay,
  DateEvent,
} from "./components/Calendar";

function App() {
  const [currentDate, setDate] = useState<any>(new Date());

  const MOCK = [1682960400000, 1682874000000];
  const test = MOCK.map((date, index) => {
    return {
      id: index,
      startDate: new Date(date),
      endDate: new Date(date),
      title: "test",
      status: "clockIn"
    };
  });


  return (
    <div className="App" style={{ margin: "0 auto", }}>
      <div style={{ padding: '1rem' }}>
        <button onClick={() => {
          setDate(new Date(2023, 0, 3))
        }}>go to jan</button>

      </div>
      <Calendar
        type="month"
        locale="TH"
        currentDate={currentDate}

        // displayFullEvent={true}
        onClick={(date) => {
          setDate(new Date(date.activeYear, date.activeMonth, date.activeDate));
        }}
        onDateChange={(date) => {
          console.log('data : ', date)
        }}
        fixWeek
        // disableSwipe
        eventLists={[...test, {
          id: 9,
          startDate: new Date(2023, 4, 7),
          endDate: new Date(2023, 4, 7),
          title: "test",
          status: "clockIn"
        }]}
      >
        <CalendarControlButton>
          {({ goToDay, activeDate, activeMonth, activeYear }) => {
            console.log('activeDate : ', activeDate, activeMonth, activeYear)
            //@ts-ignore
            const formatMonth = activeMonth === 0 ? 12 : activeMonth + 1 > 12 ? 1 : activeMonth + 1
            console.log('formatMonth;;;', formatMonth)
            return <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
              <p>{new Date(`${activeYear}/${formatMonth}/${1}`).toDateString()}</p>
              <button onClick={() => {
                goToDay()
                // setDate(new Date(activeYear || new Date().getFullYear(), activeMonth || new Date().getMonth(), activeDate));
              }}>go to day</button>
            </div>
          }}
        </CalendarControlButton>

        <div
          style={{
            background: "white",
            borderRadius: "12px",
          }}
        >
          <CalendarWeekDay />
          <DateEvent
            activeStyle={{ opacity: 0.8 }}
            // dayContainerStyle={{ gap: '8px', padding: '1px' }}
            renderEvent={({ events }: any) => {
              console.log('events : ', events)
              return <Fragment key={events?.id}>
                <div style={{ width: '4px', height: '4px', backgroundColor: 'green', position: 'absolute', top: '10%', right: '25%', borderRadius: '50%' }}>

                </div>
                <div style={{
                  height: '5px', width: '32px', background: 'red', margin: '0 auto', borderRadius: '10%', position: "absolute",
                  bottom: "25%",
                  left: "8%",
                  right: "10%",
                }} key={Math.random() * 99}>

                </div>

              </Fragment>
            }}
          />
        </div>
      </Calendar>
    </div >
  );
}

export default App;
