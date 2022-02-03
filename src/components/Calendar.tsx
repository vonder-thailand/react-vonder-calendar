import * as Framer from "framer-motion";
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
// import GlobalStyles from "./GlobalStyles";
// import "./index.css";
const { AnimatePresence, AnimateSharedLayout, motion } = Framer;

const NUMBER_OF_WEEK = 7;

export type Events = {
  id?: number;
  startDate?: string | Date;
  endDate?: string | Date;
  title?: string;
  // events?: Event[];
};

export type CalendarType = "month" | "week";

export type CalendarProps = {
  children?: ReactNode;
  currentDate?: any;
  eventLists?: Events[];
  displayFullEvent?: boolean;
  type?: CalendarType;
  locale?: "TH";
};

export type CalendarControlButtonPropsChildrenProps = {
  goNextMonth: () => void;
  goToDay: () => void;
  changeCalendarType: () => void;
  calendarType: CalendarType;
  goNextWeek: () => void;
  goPreviousWeek: () => void;
  goPreviousMonth: () => void;
};

export type CalendarControlButtonProps = {
  children?: ({
    goNextMonth,
    goToDay,
    changeCalendarType,
    calendarType,
  }: CalendarControlButtonPropsChildrenProps) => ReactNode;
};

export type CalendarHeaderButtonPropsChildrenProps = {
  activeYear?: number;
  activeMonth?: number;
};

export type CalendarHeaderButtonProps = {
  children?: ({
    activeYear,
    activeMonth,
  }: CalendarHeaderButtonPropsChildrenProps) => any;
  // children?: any;
};
export type CalendarWeekDayProps = { children?: ReactNode };
export type WeekDayItemProps = { children: ReactNode };
export type DateEventProps = {
  renderEvent?: ({ events }: { events?: Events[] }) => void;
};
export type RenderDayProps = {
  date: number;
  prevMonth?: boolean;
  currentMonth?: boolean;
  fullDate: string | Date;
  // events: Events;
};
export type Event = {
  title: string;
};

/**
 * Return the number of days in a month
 * @param {number} month -  month.
 * @param {number} year -  year.
 * @returns The number of days in the month.
 */
function daysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Given today's date and the start date of the month, return the number of weeks in the month
 * @param {number} todayDate - The current date.
 * @param {number} startDateOfMonth - the first day of the month.
 * @returns The number of weeks in the month.
 */
const getWeeksNumber = (todayDate: number, startDateOfMonth: number) => {
  return Math.ceil((todayDate + startDateOfMonth) / NUMBER_OF_WEEK);
};

const DEFAULT_DATE = {
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  date: new Date().getDate(),
};

type ContextProps = {
  goNextMonth: () => void;
  goPreviousMonth: () => void;
  renderDay: RenderDayProps[];
  activeYear: number;
  activeMonth: number;
  activeDate: number;
  locale: "TH";
  goToDay: () => void;
  displayFullEvent?: boolean;
  changeCalendarType: () => void;
  calendarType: "month" | "week";
  MONTH_LIST: typeof MONTH_LIST;
  setActiveDate: (date: typeof DEFAULT_DATE) => void;
  eventLists?: Events[];
  goNextWeek: () => void;
  goPreviousWeek: () => void;
  direction: number;
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

export default function Calendar({
  children,
  currentDate,
  eventLists,
  displayFullEvent,
  type = "month",
  locale = "TH",
}: CalendarProps) {
  const [
    { year: activeYear, month: activeMonth, date: activeDate },
    setActiveDate,
  ] = useState(DEFAULT_DATE);
  const [calendarType, setType] = useState<"month" | "week">("month");
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (type) {
      setType(type);
    }
  }, [type]);

  useEffect(() => {
    if (currentDate) {
      setActiveDate({
        date: new Date(currentDate).getDate(),
        year: new Date(currentDate).getFullYear(),
        month: new Date(currentDate).getMonth(),
      });
    }
  }, [currentDate]);

  const changeCalendarType = useCallback(() => {
    setType((prev) => (prev === "month" ? "week" : "month"));
  }, []);

  const goNextMonth = useCallback(() => {
    setDirection(1);
    setActiveDate((prev: any) => {
      if (prev.month + 1 > 11) {
        return {
          ...prev,
          date: null,
          month: 0,
          year: prev.year + 1,
        };
      } else {
        return { ...prev, month: prev.month + 1, date: null };
      }
    });
  }, []);

  const goPreviousMonth = useCallback(() => {
    setDirection(-1);
    setActiveDate((prev: any) => {
      if (prev.month - 1 < 0) {
        return {
          ...prev,
          date: null,
          month: 11,
          year: prev.year - 1,
        };
      } else {
        return { ...prev, month: prev.month - 1, date: null };
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
    // PREV_MONTH,
    // PREV_YEAR,
    MAX_DATE,
    MAX_COUNT_DATE,
    START_INDEX,
    // MAX_WEEK,
  } = getCurrentDate;

  const goNextWeek = useCallback(() => {
    setDirection(1);
    setActiveDate((prev) => {
      const isGoNextMonth = prev.date + 7 > MAX_DATE;
      const formatDateNextMonth = prev.date + 7 - MAX_DATE;
      const checkIsLastMonthOfYear = isGoNextMonth && prev.month + 1 > 11;
      return {
        ...prev,
        date: isGoNextMonth ? formatDateNextMonth : prev.date + 7,
        month: isGoNextMonth ? prev.month + 1 : prev.month,
        year: checkIsLastMonthOfYear ? prev.year + 1 : prev.year,
      };
    });
  }, [MAX_DATE]);

  const goPreviousWeek = useCallback(() => {
    setDirection(-1);
    setActiveDate((prev) => {
      const IsGoPrevMonth = prev.date - 7 <= 0;
      const formatDatePrevMonth = prev.date - 7 + MAX_DATE;
      const checkLastMonthOfYear = prev.month === 0 ? 11 : prev.month - 1;
      const checkLastYear = prev.month - 1 < 0 ? prev.year - 1 : prev.year;

      return {
        ...prev,
        date: IsGoPrevMonth ? formatDatePrevMonth : prev.date - 7,
        month: IsGoPrevMonth ? checkLastMonthOfYear : prev.month,
        year: IsGoPrevMonth ? checkLastYear : prev.year,
      };
    });
  }, [MAX_DATE]);

  const renderDay = useMemo(() => {
    const days = [...Array(MAX_COUNT_DATE).keys()].map((i) => {
      const currentDate = i - START_INDEX + 1;
      if (i < START_INDEX) {
        const prevDate = PREV_MAX_DATE - START_INDEX + 1 + i;
        return {
          date: prevDate,
          prevMonth: true,
          currentMonth: false,
          fullDate: new Date(activeYear, activeMonth - 1, prevDate),
        };
      }
      if (currentDate > MAX_DATE) {
        return {
          date: i - (MAX_DATE + START_INDEX) + 1,
          prevMonth: false,
          currentMonth: false,
          fullDate: new Date(
            activeMonth === 11 ? activeYear + 1 : activeYear,
            activeMonth === 11 ? 1 : activeMonth + 1,
            i - (MAX_DATE + START_INDEX) + 1
          ),
        };
      }

      return {
        date: currentDate,
        currentMonth: true,
        isToday: currentDate === TODAY,
        fullDate: new Date(activeYear, activeMonth, currentDate),
      };
    });

    const getDateIndex = days?.findIndex(
      (day) =>
        new Date(day.fullDate).getTime() ===
        new Date(activeYear, activeMonth, activeDate).getTime()
    );
    const get7DayOfWeek = days.slice(getDateIndex - 3, getDateIndex + 4);
    return calendarType === "week" ? get7DayOfWeek : days;
  }, [
    MAX_COUNT_DATE,
    calendarType,
    START_INDEX,
    MAX_DATE,
    TODAY,
    activeYear,
    activeMonth,
    PREV_MAX_DATE,
    activeDate,
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
      setActiveDate,
      activeDate,
      eventLists,
      goNextWeek,
      goPreviousWeek,
      direction,
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
    activeDate,
    eventLists,
    goNextWeek,
    goPreviousWeek,
    direction,
  ]);

  return (
    <CalendarContext.Provider value={contextValue}>
      {children}
      {/* <GlobalStyles /> */}
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
      goNextWeek,
      goPreviousWeek,
    } = useCalendarContext();

    return (
      <>
        {children ? (
          children({
            goNextMonth: goNextMonth,
            goPreviousMonth: goPreviousMonth,
            goToDay: goToDay,
            changeCalendarType: changeCalendarType,
            calendarType: calendarType,
            goNextWeek: goNextWeek,
            goPreviousWeek: goPreviousWeek,
          })
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
            <button onClick={() => goNextWeek()}>go next week</button>
            <button onClick={() => goPreviousWeek()}>go prev week</button>
          </>
        )}
      </>
    );
  }
);

export const CalendarHeader = memo(
  ({ children }: CalendarHeaderButtonProps) => {
    const { activeYear, activeMonth, locale } = useCalendarContext();
    if (children) {
      return children({ activeYear: activeYear, activeMonth: activeMonth });
    }
    return (
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

const getBetweenDate = ({
  startDate,
  endDate,
  fullDate,
}: {
  startDate: number;
  endDate: number;
  fullDate: Date;
}) => {
  const todayDate = new Date(fullDate);

  const firstDate = new Date(startDate);
  const secondDate = new Date(endDate);
  const isBetweenDate =
    firstDate.getTime() <= todayDate.getTime() &&
    todayDate.getTime() <= secondDate.getTime();
  return isBetweenDate;
};

export const DateEvent = memo(({ renderEvent }: DateEventProps) => {
  const {
    renderDay,
    displayFullEvent,
    activeMonth,
    activeYear,
    setActiveDate,
    activeDate,
    eventLists,
    goNextMonth,
    goPreviousMonth,
    direction,
    calendarType,
    goNextWeek,
    goPreviousWeek,
  } = useCalendarContext();

  const renderDate = useMemo(() => {
    return renderDay.map(({ date, isToday, currentMonth, fullDate }: any) => {
      const isActiveDate =
        new Date(activeYear, activeMonth, activeDate).getTime() ===
        new Date(fullDate).getTime();

      const isActiveItem =
        (activeDate === null && isToday) ||
        (isActiveDate && activeDate !== null);

      return (
        <DayItem
          onClick={() => {
            setActiveDate({
              year: new Date(fullDate).getFullYear(),
              month: new Date(fullDate).getMonth(),
              date: new Date(fullDate).getDate(),
            });
          }}
          key={fullDate}
          isCurrentMonth={currentMonth}
        >
          {!displayFullEvent ? (
            <DayContainer
              today={isToday}
              isActiveDate={isActiveItem}
              displayFullEvent={displayFullEvent}
            >
              <TodayText>{date}</TodayText>
              {isActiveItem && (
                <ActiveItem
                  layoutId="outline"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}

              {eventLists?.slice(0, 1)?.map((event: any) => {
                const isBetweenDate = getBetweenDate({
                  startDate: event?.startDate,
                  endDate: event?.endDate,
                  fullDate: fullDate,
                });

                if (isBetweenDate) {
                  if (renderEvent) {
                    return renderEvent({ events: event });
                  }
                  return (
                    <EventBadge
                      isToday={isToday}
                      isActiveDate={isActiveItem}
                      key={event?.title + new Date(event?.endDate)}
                    />
                  );
                }
                return null;
              })}
            </DayContainer>
          ) : (
            <EventLabel
              today={isToday}
              isActiveDate={isActiveDate}
              displayFullEvent={displayFullEvent}
            >
              <TodayText
                today={isToday}
                isActiveDate={isActiveItem}
                displayFullEvent={displayFullEvent}
              >
                {date}
              </TodayText>
              {isActiveItem && (
                <ActiveItemFullEvent
                  layoutId="outline-full-event"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
              {eventLists?.slice(0, 2)?.map((event: any) => {
                const isEventStartDate =
                  new Date(event?.startDate).getDate() === date;
                const isEventEndDate =
                  new Date(event?.endDate).getDate() === date;

                const isBetweenDate = getBetweenDate({
                  startDate: event?.startDate,
                  endDate: event?.endDate,
                  fullDate: fullDate,
                });

                if (isBetweenDate) {
                  if (renderEvent) {
                    return renderEvent({ events: event });
                  }
                  return (
                    <EventTitle
                      key={event?.title + new Date(event?.endDate)}
                      isEventStartDate={isEventStartDate}
                      isEventEndDate={isEventEndDate}
                      style={{ marginTop: "0.3rem" }}
                    >
                      {event?.title}
                    </EventTitle>
                  );
                }
                return null;
              })}
            </EventLabel>
          )}
        </DayItem>
      );
    });
  }, [
    renderDay,
    activeYear,
    activeMonth,
    activeDate,
    displayFullEvent,
    eventLists,
    setActiveDate,
    renderEvent,
  ]);

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <AnimateSharedLayout>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={
            calendarType === "month"
              ? activeMonth + activeYear
              : activeDate + activeMonth + activeYear
          }
          custom={direction}
          variants={{
            enter: (direction: number) => {
              return {
                x: direction > 0 ? 1000 : -1000,
                opacity: 0,
              };
            },
            center: {
              zIndex: 1,
              x: 0,
              opacity: 1,
            },
            exit: (direction: number) => {
              return {
                zIndex: 0,
                x: direction < 0 ? 1000 : -1000,
                opacity: 0,
              };
            },
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(_, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              calendarType === "month" ? goNextMonth() : goNextWeek();
            } else if (swipe > swipeConfidenceThreshold) {
              calendarType === "month" ? goPreviousMonth() : goPreviousWeek();
            }
          }}
        >
          <Days>{renderDate}</Days>
        </motion.div>
      </AnimatePresence>
    </AnimateSharedLayout>
  );
});

const ActiveItem = styled(motion.div)`
  position: absolute;
  left: 18%;
  background-color: #6565f2;
  border-radius: 8px;
  width: 50px;
  height: 50px;
  @media only screen and (min-width: 379px) and (max-width: 461px) {
    position: absolute;
    left: 0%;
    top: 0%;
    background-color: #6565f2;
    border-radius: 8px;
    width: 50px;
    height: 50px;
  }
  @media only screen and (min-width: 463px) and (max-width: 820px) {
    position: absolute;
    left: 10%;
    /* left: 0%;
    top: 0%; */
    background-color: #6565f2;
    border-radius: 8px;
    width: 50px;
    height: 50px;
  }

  @media only screen and (max-width: 381px) {
    position: absolute;
    left: 0%;
    background-color: #6565f2;
    border-radius: 8px;
    width: 50px;
    height: 50px;
  }
`;

const ActiveItemFullEvent = styled(motion.div)`
  position: absolute;
  left: 13%;
  top: 6%;
  background-color: #6565f2;
  border-radius: 8px;
  width: 40px;
  height: 40px;
`;

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
  position: absolute;
  width: 100%;
`;

const EventLabel = styled.div<{
  today?: boolean;
  displayFullEvent?: boolean;
}>`
  display: flex;
  justify-content: center;
  flex-direction: column;
  position: relative;
  gap: 4px;
  margin-top: 0.75rem;
  ${({ today, displayFullEvent }) => {
    if (today && !displayFullEvent) {
      return css`
        margin-top: 0.25rem;
      `;
    }
  }}
`;

const getActiveDate = css`
  ${({ today, isActiveDate, displayFullEvent }) => {
    if ((today && isActiveDate) || isActiveDate) {
      return css`
        border-radius: 8px;
        font-weight: 700;
        padding-bottom: ${"15px"};
        color: white;
        padding: ${displayFullEvent ? "10px" : "0 1rem 1rem 1rem"};
      `;
    }
    if (today) {
      return css`
        padding-bottom: ${"15px"};
        font-weight: 700;
        color: #6565f2;
        padding: ${displayFullEvent ? "10px" : "0 1rem"};
      `;
    }
  }};
`;

const TodayText = styled.span<{
  today?: boolean;
  isActiveDate?: boolean;
  displayFullEvent?: boolean;
}>`
  margin: 0 auto;
  width: fit-content;
  padding-top: 10px;
  z-index: 20;
  ${({ displayFullEvent, isActiveDate, today }) => {
    if (displayFullEvent && !isActiveDate && !today) {
      return css`
        margin-bottom: 1.2rem;
      `;
    }
    if (displayFullEvent && (isActiveDate || today)) {
      return css`
        margin-bottom: 0.6rem;
      `;
    }
  }}
  ${getActiveDate};
`;

const DayContainer = styled.div<{
  today?: boolean;
  isActiveDate?: boolean;
}>`
  display: flex;
  flex-direction: column;
  min-height: 40px;
  max-width: 30%;
  position: relative;

  /* 
  min-width: 50%; */
  margin: 0 auto;
  ${getActiveDate};

  /* min-width: 40%;
  max-width: 40%; */
`;

const DayItem = styled.div<{ isCurrentMonth?: boolean }>`
  min-height: 70px;
  list-style-type: none;
  display: inline-block;
  width: 13.6%;
  text-align: center;
  /* margin-bottom: 30px; */
  font-size: 14px;
  /* cursor: pointer; */
  color: ${({ isCurrentMonth }) => (isCurrentMonth ? "#777" : "lightgray")};
  /* padding-top: 0.75rem; */
`;

const EventBadge = styled.div<{ isToday?: boolean; isActiveDate?: boolean }>`
  width: 5px;
  height: 5px;
  background: ${({ isToday, isActiveDate }) =>
    (isToday && isActiveDate) || isActiveDate ? "white" : "#f0685b"};
  border-radius: 50%;
  margin: 0 auto;
  margin-top: 0.5rem;
  z-index: 20;
`;

const EventTitle = styled.span<{
  isEventStartDate?: boolean;
  isEventEndDate?: boolean;
}>`
  width: 100%;
  margin: 0 auto;
  color: white;
  padding: 2px;
  background: #f0685b;
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
