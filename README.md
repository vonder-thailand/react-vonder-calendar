## React Calendar with Compound Component Pattern

### Demo

[Codesandbox](https://codesandbox.io/s/sharp-ride-40uuo?file=/src/App.js)

<!-- - Typescript

  [Codesandbox](https://codesandbox.io/s/my-calendar-ts-kefev?file=/src/App.tsx)

- Javascript

  [Codesandbox](https://codesandbox.io/s/my-calendar-q5mf7?file=/src/App.js:11203-12272) -->

## Basic Usage

```js
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
```

## Advance Usage

```js
<Calendar
  type={"month"}
  displayFullEvent
  eventLists={[
    {
      id: 1,
      startDate: new Date(2021, 11, 30),
      endDate: new Date(2022, 0, 2),
      title: "Meeting",
    },
    {
      id: 2,
      startDate: new Date(2022, 0, 7),
      endDate: new Date(2022, 0, 10),
      title: "test",
    },
    {
      id: 3,
      startDate: new Date(2022, 0, 21),
      endDate: new Date(2022, 0, 21),
      title: "Meeting",
    },
  ]}
>
  <CalendarControlButton>
    {({ goNextMonth, goToDay }) => {
      return (
        <>
          <button onClick={() => goNextMonth()}>
            next month with render props
          </button>
          <button onClick={() => goToDay()}>go to day with render props</button>
        </>
      );
    }}
  </CalendarControlButton>
  <CalendarHeader>
    {({ activeYear, activeMonth }) => {
      return (
        <h2>
          this is header - {activeYear.toString()} /{" "}
          {activeMonth + 1?.toString()}
        </h2>
      );
    }}
  </CalendarHeader>
  <CalendarWeekDay>
    {MONTH_LIST?.map((item) => {
      return <CalendarWeekDay.Item>{item?.name}</CalendarWeekDay.Item>;
    })}
  </CalendarWeekDay>
  <DateEvent
    renderEvent={({ events }) => {
      return events?.map((event) => {
        return <span key={Math.random() * 2022}>{event?.title}</span>;
      });
    }}
  />
</Calendar>
```

Calendar Props

| Prop               | Description                                                                               |
| ------------------ | ----------------------------------------------------------------------------------------- |
| `type`             | "month" or "week"                                                                         |
| `displayFullEvent` | boolean default is false                                                                  |
| `eventLists`       | Array of Events                                                                           |
| `children`         | `<CalendarControlButton /> or <CalendarHeader /> or <CalendarWeekDay /> or <DateEvent />` |
