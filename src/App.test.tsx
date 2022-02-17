import React from "react";
import Calendar, {
  CalendarControlButton,
  CalendarHeader,
  chunk,
  DateEvent,
  daysInMonth,
  getWeeksNumber,
} from "./components/Calendar";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("chunk array function", () => {
  const result = chunk([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5);
  expect(result).toHaveLength(2);
});

test("daysInMonth function febuary 2022", () => {
  const result = daysInMonth(1, 2022);
  expect(result).toEqual(28);
});

test("daysInMonth function Jan 2022", () => {
  const result = daysInMonth(0, 2022);
  expect(result).toEqual(31);
});

test("daysInMonth function febuary 2024", () => {
  const result = daysInMonth(1, 2024);
  expect(result).toEqual(29);
});

test("daysInMonth function april 2022", () => {
  const result = daysInMonth(3, 2024);
  expect(result).toEqual(30);
});

test("get week number start 1 date = 10", () => {
  const result = getWeeksNumber(10, 1);
  expect(result).toEqual(2);
});

test("get week number start 6 date = 2", () => {
  const result = getWeeksNumber(2, 6);
  expect(result).toEqual(2);
});

describe("test calendar context", () => {
  test("test render date correctly when current date = 07/01/2022", async () => {
    const expected20220210 = [
      {
        date: 30,
        prevMonth: true,
        currentMonth: false,
        fullDate: "2022-01-29T17:00:00.000Z",
      },
      {
        date: 31,
        prevMonth: true,
        currentMonth: false,
        fullDate: "2022-01-30T17:00:00.000Z",
      },
      {
        date: 1,
        currentMonth: true,
        isToday: false,
        fullDate: "2022-01-31T17:00:00.000Z",
      },
      {
        date: 2,
        currentMonth: true,
        isToday: false,
        fullDate: "2022-02-01T17:00:00.000Z",
      },
      {
        date: 3,
        currentMonth: true,
        isToday: false,
        fullDate: "2022-02-02T17:00:00.000Z",
      },
      {
        date: 4,
        currentMonth: true,
        isToday: false,
        fullDate: "2022-02-03T17:00:00.000Z",
      },
      {
        date: 5,
        currentMonth: true,
        isToday: false,
        fullDate: "2022-02-04T17:00:00.000Z",
      },
      {
        date: 6,
        currentMonth: true,
        isToday: false,
        fullDate: "2022-02-05T17:00:00.000Z",
      },
      {
        date: 7,
        currentMonth: true,
        isToday: false,
        fullDate: "2022-02-06T17:00:00.000Z",
      },
      {
        date: 8,
        currentMonth: true,
        isToday: false,
        fullDate: "2022-02-07T17:00:00.000Z",
      },
      {
        date: 9,
        currentMonth: true,
        isToday: false,
        fullDate: "2022-02-08T17:00:00.000Z",
      },
      {
        date: 10,
        currentMonth: true,
        isToday: false,
        fullDate: "2022-02-09T17:00:00.000Z",
      },
      {
        date: 11,
        currentMonth: true,
        isToday: false,
        fullDate: "2022-02-10T17:00:00.000Z",
      },
      {
        date: 12,
        currentMonth: true,
        isToday: false,
        fullDate: "2022-02-11T17:00:00.000Z",
      },
      {
        date: 13,
        currentMonth: true,
        isToday: false,
        fullDate: "2022-02-12T17:00:00.000Z",
      },
      {
        date: 14,
        currentMonth: true,
        isToday: true,
        fullDate: "2022-02-13T17:00:00.000Z",
      },
      {
        date: 15,
        currentMonth: true,
        isToday: false,
        fullDate: "2022-02-14T17:00:00.000Z",
      },
      {
        date: 16,
        currentMonth: true,
        isToday: false,
        fullDate: "2022-02-15T17:00:00.000Z",
      },
      {
        date: 17,
        currentMonth: true,
        isToday: false,
        fullDate: "2022-02-16T17:00:00.000Z",
      },
      {
        date: 18,
        currentMonth: true,
        isToday: false,
        fullDate: "2022-02-17T17:00:00.000Z",
      },
      {
        date: 19,
        currentMonth: true,
        isToday: false,
        fullDate: "2022-02-18T17:00:00.000Z",
      },
      {
        date: 20,
        currentMonth: true,
        isToday: false,
        fullDate: "2022-02-19T17:00:00.000Z",
      },
      {
        date: 21,
        currentMonth: true,
        isToday: false,
        fullDate: "2022-02-20T17:00:00.000Z",
      },
      {
        date: 22,
        currentMonth: true,
        isToday: false,
        fullDate: "2022-02-21T17:00:00.000Z",
      },
      {
        date: 23,
        currentMonth: true,
        isToday: false,
        fullDate: "2022-02-22T17:00:00.000Z",
      },
      {
        date: 24,
        currentMonth: true,
        isToday: false,
        fullDate: "2022-02-23T17:00:00.000Z",
      },
      {
        date: 25,
        currentMonth: true,
        isToday: false,
        fullDate: "2022-02-24T17:00:00.000Z",
      },
      {
        date: 26,
        currentMonth: true,
        isToday: false,
        fullDate: "2022-02-25T17:00:00.000Z",
      },
      {
        date: 27,
        currentMonth: true,
        isToday: false,
        fullDate: "2022-02-26T17:00:00.000Z",
      },
      {
        date: 28,
        currentMonth: true,
        isToday: false,
        fullDate: "2022-02-27T17:00:00.000Z",
      },
      {
        date: 1,
        prevMonth: false,
        currentMonth: false,
        fullDate: "2022-02-28T17:00:00.000Z",
      },
      {
        date: 2,
        prevMonth: false,
        currentMonth: false,
        fullDate: "2022-03-01T17:00:00.000Z",
      },
      {
        date: 3,
        prevMonth: false,
        currentMonth: false,
        fullDate: "2022-03-02T17:00:00.000Z",
      },
      {
        date: 4,
        prevMonth: false,
        currentMonth: false,
        fullDate: "2022-03-03T17:00:00.000Z",
      },
      {
        date: 5,
        prevMonth: false,
        currentMonth: false,
        fullDate: "2022-03-04T17:00:00.000Z",
      },
      {
        date: 6,
        prevMonth: false,
        currentMonth: false,
        fullDate: "2022-03-05T17:00:00.000Z",
      },
      {
        date: 7,
        prevMonth: false,
        currentMonth: false,
        fullDate: "2022-03-06T17:00:00.000Z",
      },
      {
        date: 8,
        prevMonth: false,
        currentMonth: false,
        fullDate: "2022-03-07T17:00:00.000Z",
      },
      {
        date: 9,
        prevMonth: false,
        currentMonth: false,
        fullDate: "2022-03-08T17:00:00.000Z",
      },
      {
        date: 10,
        prevMonth: false,
        currentMonth: false,
        fullDate: "2022-03-09T17:00:00.000Z",
      },
      {
        date: 11,
        prevMonth: false,
        currentMonth: false,
        fullDate: "2022-03-10T17:00:00.000Z",
      },
      {
        date: 12,
        prevMonth: false,
        currentMonth: false,
        fullDate: "2022-03-11T17:00:00.000Z",
      },
    ];
    const wrapper = ({ children }) => (
      <Calendar type="month" currentDate={new Date(2022, 1, 7)}>
        {children}
      </Calendar>
    );

    render(<DateEvent />, { wrapper });
    expected20220210.forEach((e, i) => {
      expect(screen.getAllByTestId("day-item")[i].textContent).toEqual(
        e.date.toString()
      );
    });
  });

  test("should render date correct when user click next month to Mar 2022", async () => {
    const wrapper = ({ children }) => (
      <Calendar type="month" currentDate={new Date(2022, 1, 7)}>
        {children}
      </Calendar>
    );

    render(
      <>
        <CalendarControlButton></CalendarControlButton>
        <CalendarHeader />
        <DateEvent />
      </>,
      { wrapper }
    );
    const nextMonthButton = screen.getByRole("button", {
      name: "next month",
    });
    userEvent.click(nextMonthButton);

    const allDate = await screen.findAllByTestId("day-item");

    const firstDateOfMar = allDate[0].textContent;
    const lastDateOfMar = allDate?.[allDate.length - 1].textContent;
    expect(firstDateOfMar).toEqual("30");
    expect(lastDateOfMar).toEqual("9");
  });
});

describe("test render calendar", () => {
  it("render type week 7 days", async () => {
    const wrapper = ({ children }) => (
      <Calendar type="week">{children}</Calendar>
    );

    render(<DateEvent />, { wrapper });

    await waitFor(() => {
      expect(screen.getAllByTestId("day-item")).toHaveLength(7);
    });
  });

  it("render type week 42 days", async () => {
    const wrapper = ({ children }) => (
      <Calendar type="month">{children}</Calendar>
    );

    render(<DateEvent />, { wrapper });

    await waitFor(() => {
      expect(screen.getAllByTestId("day-item")).toHaveLength(42);
    });
  });
});
