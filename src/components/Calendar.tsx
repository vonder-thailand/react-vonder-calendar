import React, {
  useMemo,
  useState,
  memo,
  useCallback,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import styled, { css } from "styled-components";

const Weekday = styled.ul`
  margin: 0;
  padding: 10px 0;
  li {
    display: inline-block;
    width: 13.6%;
    color: #666;
    text-align: center;
  }
`;

const Days = styled.ul`
  padding: 10px 0;
  margin: 0;
`;

const TodayText = styled.span<{ today?: boolean }>`
  ${({ today }) => {
    if (today) {
      return css`
        margin: 0 auto;
        width: fit-content;
        background: lightgray;
        padding: 1rem 0.75rem;
        border-radius: 6px;
        font-weight: 600;
        padding: 0.5rem;
      `;
    }
  }}
`;

const DayItem = styled.div<{ isCurrentMonth?: boolean }>`
  height: 60px;
  list-style-type: none;
  display: inline-block;
  width: 13.6%;
  text-align: center;
  margin-bottom: 30px;
  font-size: 12px;
  cursor: pointer;
  color: ${({ isCurrentMonth }) => (isCurrentMonth ? "#777" : "lightgray")};
`;

const EventBadge = styled.div`
  width: 10px;
  height: 10px;
  background: lightsalmon;
  border-radius: 50%;
  margin: 0 auto;
  margin-top: 0.75rem;
`;

const EventTitle = styled.span<{
  isEventStartDate?: boolean;
  isEventEndDate?: boolean;
}>`
  width: 100%;
  margin: 0 auto;
  color: white;
  margin-top: 0.25rem;
  padding: 2px;
  background: salmon;
  ${({ isEventStartDate, isEventEndDate }) => {
    if (isEventStartDate && isEventEndDate) {
      return css`
        border-radius: 6px;
      `;
    }

    if (isEventStartDate) {
      return css`
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;
      `;
    }
    if (isEventEndDate) {
      return css`
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
      `;
    }
  }}
`;

const EventLabel = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
  margin-top: 0.5rem;
`;

const NUMBER_OF_WEEK = 7;

function daysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

const getDateEvents = (events?: any[], currentDate?: any) => {
  // console.log("events : ", events);
  const todayDate = new Date(currentDate);
  const eventDate = events?.find(({ startDate, endDate }) => {
    const firstDate = new Date(startDate);
    const secondDate = new Date(endDate);
    const isBetweenDate =
      firstDate.getTime() <= todayDate.getTime() &&
      todayDate.getTime() <= secondDate.getTime();
    return isBetweenDate;
  });

  return {
    ...eventDate,
  };
};

const getWeeksNumber = (todayDate: number, startDateOfMonth: number) => {
  return Math.ceil((todayDate + startDateOfMonth) / NUMBER_OF_WEEK);
};

const DEFAULT_DATE = {
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
};

type ContextProps = {
  goNextMonth: () => void;
  goPreviousMonth: () => void;
  renderDay: RenderDayProps[];
  activeYear: number;
  activeMonth: number;
  locale: "TH";
  goToDay: () => void;
  displayFullEvent?: boolean;
  changeCalendarType: () => void;
  calendarType: "month" | "week";
  MONTH_LIST: typeof MONTH_LIST;
};

const CalendarContext = createContext<ContextProps | null>(null);

function useCalendarContext() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error(
      `Calendar compound components cannot be rendered outside the Calendar component`
    );
  }
  return context;
}

const MONTH_LIST = [
  {
    name: "Su",
  },
  {
    name: "Mo",
  },
  {
    name: "Tu",
  },
  {
    name: "We",
  },
  {
    name: "Th",
  },
  {
    name: "Fr",
  },
  {
    name: "Sa",
  },
];

export type EventProps = {
  id: number;
  startDate: Date | string;
  endDate: Date | string;
  events: Array<{
    title: string;
  }>;
};

export type CalendarProps = {
  children?: ReactNode;
  currentDate?: any;
  eventLists?: Array<EventProps>;
  displayFullEvent?: boolean;
  type?: "month" | "week";
  locale?: "TH";
};

export type CalendarControlButtonProps = { children?: any };
export type CalendarHeaderButtonProps = { children?: any };
export type CalendarWeekDayProps = { children?: ReactNode };
export type WeekDayItemProps = { children: ReactNode };
export type DateEventProps = {
  renderEvent?: ({ events }: { events: Array<Event> }) => void;
};
export type RenderDayProps = {
  date: number;
  prevMonth?: boolean;
  currentMonth?: boolean;
  fullDate: string | Date;
  events: Events;
};

export type Events = {
  id: number;
  startDate: string;
  endDate: string;
  events: Event[];
};

export type Event = {
  title: string;
};

export default function Calendar({
  children,
  currentDate,
  eventLists,
  displayFullEvent,
  type = "month",
  locale = "TH",
}: CalendarProps) {
  const [{ year: activeYear, month: activeMonth }, setActiveDate] =
    useState(DEFAULT_DATE);
  const [calendarType, setType] = useState<"month" | "week">("month");

  useEffect(() => {
    if (type) {
      setType(type);
    }
  }, [type]);

  useEffect(() => {
    if (currentDate) {
      setActiveDate({
        year: new Date(currentDate).getFullYear(),
        month: new Date(currentDate).getMonth(),
      });
    }
  }, [currentDate]);

  const changeCalendarType = useCallback(() => {
    setType((prev) => (prev === "month" ? "week" : "month"));
  }, []);

  const goNextMonth = useCallback(() => {
    setActiveDate((prev) => {
      if (prev.month + 1 > 11) {
        return {
          month: 0,
          year: prev.year + 1,
        };
      } else {
        return { ...prev, month: prev.month + 1 };
      }
    });
  }, []);

  const goPreviousMonth = useCallback(() => {
    setActiveDate((prev) => {
      if (prev.month - 1 < 0) {
        return {
          month: 11,
          year: prev.year - 1,
        };
      } else {
        return { ...prev, month: prev.month - 1 };
      }
    });
  }, []);

  const goToDay = useCallback(() => {
    setActiveDate(DEFAULT_DATE);
  }, []);

  const getCurrentDate = useMemo(() => {
    const TODAY =
      activeYear === new Date().getFullYear() &&
      activeMonth === new Date().getMonth()
        ? new Date().getDate()
        : "";

    const PREV_YEAR = activeYear - 1;
    const PREV_MONTH = activeMonth === 0 ? 11 : activeMonth - 1;
    const START_INDEX = new Date().getDay();

    return {
      TODAY,
      PREV_YEAR,
      PREV_MONTH,
      PREV_MAX_DATE: daysInMonth(PREV_MONTH, PREV_YEAR),
      MAX_COUNT_DATE: activeMonth === 1 ? 35 : 42, //7 in row ,6 row,
      MAX_DATE: daysInMonth(activeMonth, activeYear),
      START_INDEX,
      MAX_WEEK: getWeeksNumber(+TODAY, START_INDEX) * NUMBER_OF_WEEK,
    };
  }, [activeMonth, activeYear]);

  const {
    TODAY,
    PREV_MAX_DATE,
    PREV_MONTH,
    PREV_YEAR,
    MAX_DATE,
    MAX_COUNT_DATE,
    START_INDEX,
    MAX_WEEK,
  } = getCurrentDate;

  const renderDay = useMemo(() => {
    const days = [...Array(MAX_COUNT_DATE).keys()].map((i) => {
      const currentDate = i - START_INDEX + 1;
      if (i < START_INDEX) {
        const prevDate = PREV_MAX_DATE - START_INDEX + 1 + i;
        return {
          date: prevDate,
          prevMonth: true,
          currentMonth: false,
          fullDate: new Date(PREV_YEAR, PREV_MONTH, prevDate),
          events: getDateEvents(
            eventLists,
            new Date(activeYear, activeMonth, currentDate)
          ),
        };
      }
      if (currentDate > MAX_DATE) {
        return {
          date: i - (MAX_DATE + START_INDEX) + 1,
          prevMonth: false,
          currentMonth: false,
          fullDate: new Date(
            activeYear + 1,
            activeMonth === 11 ? 1 : activeMonth + 1
          ),
          events: getDateEvents(
            eventLists,
            new Date(activeYear, activeMonth, currentDate)
          ),
        };
      }

      return {
        date: currentDate,
        currentMonth: true,
        isToday: currentDate === TODAY,
        fullDate: new Date(activeYear, activeMonth, currentDate),
        events: getDateEvents(
          eventLists,
          new Date(activeYear, activeMonth, currentDate)
        ),
      };
    });

    return calendarType === "week" ? days.slice(MAX_WEEK - 7, MAX_WEEK) : days;
  }, [
    activeMonth,
    activeYear,
    MAX_COUNT_DATE,
    MAX_DATE,
    MAX_WEEK,
    PREV_MAX_DATE,
    PREV_MONTH,
    PREV_YEAR,
    START_INDEX,
    TODAY,
    eventLists,
    calendarType,
  ]);

  const contextValue = useMemo(() => {
    return {
      goNextMonth,
      goPreviousMonth,
      renderDay,
      activeYear,
      activeMonth,
      locale,
      goToDay,
      displayFullEvent,
      changeCalendarType,
      calendarType,
      MONTH_LIST,
    };
  }, [
    goNextMonth,
    goPreviousMonth,
    renderDay,
    activeYear,
    activeMonth,
    locale,
    goToDay,
    displayFullEvent,
    changeCalendarType,
    calendarType,
    MONTH_LIST,
  ]);

  return (
    <CalendarContext.Provider value={contextValue}>
      {children}
    </CalendarContext.Provider>
  );
}

export const CalendarControlButton = memo(
  ({ children }: CalendarControlButtonProps) => {
    const {
      goNextMonth,
      goToDay,
      goPreviousMonth,
      changeCalendarType,
      calendarType,
    } = useCalendarContext();

    const renderedEventChildren = children
      ? children({
          goNextMonth: goNextMonth,
          goToDay: goToDay,
          changeCalendarType: changeCalendarType,
          calendarType: calendarType,
        })
      : null;

    return (
      <>
        {renderedEventChildren ? (
          renderedEventChildren
        ) : (
          <>
            <button onClick={() => changeCalendarType()}>
              {calendarType === "month" ? "change to week" : "change to month"}
            </button>
            <button onClick={() => goToDay()}>go to day</button>
            <button
              onClick={() => {
                goPreviousMonth();
              }}
            >
              prev month
            </button>
            <button
              onClick={() => {
                goNextMonth();
              }}
            >
              next month
            </button>
          </>
        )}
      </>
    );
  }
);

export const CalendarHeader = memo(
  ({ children }: CalendarHeaderButtonProps) => {
    const { activeYear, activeMonth, locale } = useCalendarContext();
    const renderedEventChildren = children
      ? children({ activeYear, activeMonth })
      : null;

    return renderedEventChildren ? (
      renderedEventChildren
    ) : (
      <h2>{new Date(activeYear, activeMonth).toLocaleDateString(locale)}</h2>
    );
  }
);

export const WeekDayList = () => {
  const { MONTH_LIST } = useCalendarContext();
  return (
    <Weekday>
      {MONTH_LIST?.map((month: any) => {
        return <li key={month?.name}>{month.name}</li>;
      })}
    </Weekday>
  );
};

export const CalendarWeekDay = ({ children }: CalendarWeekDayProps) => {
  useCalendarContext();
  if (children) {
    return <Weekday>{children}</Weekday>;
  }
  if (!children) {
    return <WeekDayList />;
  }
  return null;
};

export const WeekDayItem = ({ children }: WeekDayItemProps) => {
  useCalendarContext();
  return <li>{children}</li>;
};
CalendarWeekDay.Item = WeekDayItem;
CalendarWeekDay.displayName = "CalendarWeekDay";

export const DateEvent = memo(({ renderEvent }: DateEventProps) => {
  const { renderDay, displayFullEvent } = useCalendarContext();
  const renderDate = useMemo(() => {
    return renderDay.map(({ date, isToday, events, currentMonth }: any) => {
      const isEventStartDate = new Date(events?.startDate).getDate() === date;
      const isEventEndDate = new Date(events?.endDate).getDate() === date;
      return (
        <DayItem
          key={date + Math.random() * 2000}
          isCurrentMonth={currentMonth}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <>
              <TodayText today={isToday}>{date}</TodayText>
              {/* {renderedDateEventChildren(events)} */}

              {renderEvent && renderEvent({ events: events?.events })}
              {!renderEvent && displayFullEvent && (
                <EventLabel>
                  {events?.events?.slice(0, 2)?.map((event: any) => {
                    return (
                      <EventTitle
                        key={event?.title}
                        isEventStartDate={isEventStartDate}
                        isEventEndDate={isEventEndDate}
                      >
                        {event?.title}
                      </EventTitle>
                    );
                  })}
                </EventLabel>
              )}
            </>

            {!displayFullEvent && events?.events?.length > 0 && <EventBadge />}
          </div>
        </DayItem>
      );
    });
  }, [displayFullEvent, renderDay, renderEvent]);

  return (
    <>
      {/* <WeekDayList /> */}
      {/* {renderedWeekDayChildren} */}
      <Days>{renderDate}</Days>
    </>
  );
});
