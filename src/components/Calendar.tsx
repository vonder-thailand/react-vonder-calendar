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
const { AnimatePresence, motion } = Framer;

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
  disableSwipe?: boolean;
  fixWeek?: boolean;
  onClick?: (date: any) => void;
  onDateChange?: (date: any) => void
  onSwipe?: (date: any) => void
  calendayType?: "a"
};

export type CalendarControlButtonPropsChildrenProps = {
  goNextMonth: () => void;
  goToDay: () => void;
  changeCalendarType: () => void;
  calendarType: CalendarType;
  goNextWeek: () => void;
  goPreviousWeek: () => void;
  goPreviousMonth: () => void;
  activeYear?: number;
  activeMonth?: number;
  activeDate?: number
};

export type CalendarControlButtonProps = {
  children?: ({
    goNextMonth,
    goToDay,
    changeCalendarType,
    calendarType,
    activeYear,
    activeMonth,
    activeDate
  }: CalendarControlButtonPropsChildrenProps) => ReactNode;
};

export type CalendarHeaderButtonPropsChildrenProps = {
  activeYear?: number;
  activeMonth?: number;
  currentDate?: string;
  goNextMonth: () => void;
  goPreviousMonth: () => void;
  goToDay: () => void;
};

export type CalendarHeaderButtonProps = {
  children?: ({
    activeYear,
    activeMonth,
  }: CalendarHeaderButtonPropsChildrenProps) => any;
  // children?: any;
};
export type CalendarWeekDayProps = { children?: ReactNode };
export type WeekDayItemProps = {
  children: ReactNode;
  style?: React.CSSProperties;
};
export type DateEventProps = {
  renderEvent?: ({ events }: { events?: Events[] }) => void;
  activeStyle?: React.CSSProperties;
  todayStyle?: React.CSSProperties;
  dayContainerStyle?: React.CSSProperties
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

export const chunk = (arr, size) =>
  arr.reduce(
    (acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]),
    []
  );

/**
 * Return the number of days in a month
 * @param {number} month -  month.
 * @param {number} year -  year.
 * @returns The number of days in the month.
 */
export function daysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Given today's date and the start date of the month, return the number of weeks in the month
 * @param {number} todayDate - The current date.
 * @param {number} startDateOfMonth - the first day of the month.
 * @returns The number of weeks in the month.
 */
export const getWeeksNumber = (
  todayDate: number,
  startIndexOfMonth: number
) => {
  return Math.ceil((todayDate + startIndexOfMonth) / NUMBER_OF_WEEK);
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
  locale: "TH" | "EN";
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
  disableSwipe?: boolean;
  fixWeek?: boolean;
  onClick?: (date: any) => void;
  onSwipe?: (date: any) => void
};

export const CalendarContext = createContext<ContextProps | null>(null);

export function useCalendarContext() {
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
    nameTH: "อา"
  },
  {
    name: "Mo",
    nameTH: "จ"
  },
  {
    name: "Tu",
    nameTH: "อ"
  },
  {
    name: "We",
    nameTH: "พ"
  },
  {
    name: "Th",
    nameTH: "พฤ"
  },
  {
    name: "Fr",
    nameTH: "ศ"
  },
  {
    name: "Sa",
    nameTH: "ส"
  },
];

export default function Calendar({
  children,
  currentDate,
  eventLists,
  displayFullEvent,
  type,
  locale = "TH",
  disableSwipe,
  fixWeek,
  onClick,
  onDateChange,
  onSwipe,
}: CalendarProps) {
  // const FIX_WEEK = true;

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
    if (onDateChange) {
      onDateChange({
        activeYear: activeYear,
        activeMonth: activeMonth,
        activeDate: activeDate
      })
    }
  }, [activeDate, activeMonth, activeYear, onDateChange])

  // useEffect(() => {
  //   if (onClick) {
  //     onClick({
  //       activeDate:
  //         DEFAULT_DATE.month === activeMonth && DEFAULT_DATE.year === activeYear
  //           ? DEFAULT_DATE.date
  //           : activeDate,
  //       activeMonth: activeMonth,
  //       activeYear: activeYear,
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [activeDate, activeMonth, activeYear]);

  useEffect(() => {
    if (fixWeek && type === "month") {
      console.warn(`fixWeek only work with calendar type "week"`);
    }
    if (type === "week" && displayFullEvent) {
      console.warn(`display full event only work with calendar type "month"`);
    }
    if (fixWeek && disableSwipe) {
      console.warn(
        `fixWeek will disable swipe automatically, but if disableSwipe = true and fixWeek= false or undefine, when user click some date calendar will swipe to 7 day of week belong to active date`
      );
    }
  }, [type, disableSwipe, displayFullEvent, fixWeek]);

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
    setDirection(prev => prev < 0 ? 1 : -1)
    setActiveDate(DEFAULT_DATE);
  }, []);

  const getCurrentDate = useMemo(() => {
    const TODAY =
      activeYear === DEFAULT_DATE.year && activeMonth === DEFAULT_DATE.month
        ? DEFAULT_DATE.date
        : "";

    const PREV_YEAR = activeYear - 1;
    const PREV_MONTH = activeMonth === 0 ? 11 : activeMonth - 1;
    const START_INDEX = new Date(activeYear, activeMonth).getDay();

    return {
      TODAY,
      PREV_YEAR,
      PREV_MONTH,
      PREV_MAX_DATE: daysInMonth(PREV_MONTH, PREV_YEAR),
      MAX_COUNT_DATE: 42, //7 in row ,6 row,
      MAX_DATE: daysInMonth(activeMonth, activeYear),
      START_INDEX,
      MAX_WEEK: getWeeksNumber(+TODAY, START_INDEX) * NUMBER_OF_WEEK,
    };
  }, [activeMonth, activeYear]);

  const {
    TODAY,
    PREV_MAX_DATE,
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

    const getWeekNumber = getWeeksNumber(activeDate, START_INDEX);

    const get7DayOfWeek = chunk(days, 7)[getWeekNumber - 1];
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
      disableSwipe,
      fixWeek,
      onClick,
      onDateChange,
      onSwipe
    };
  }, [
    onSwipe,
    onDateChange,
    fixWeek,
    disableSwipe,
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
    onClick,
  ]);

  return (
    <CalendarContext.Provider value={contextValue}>
      <div style={{ textAlign: "center" }}>{children}</div>
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
      activeDate, activeMonth, activeYear
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
            activeDate: activeDate,
            activeMonth: activeMonth,
            activeYear: activeYear
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
    const {
      activeYear,
      activeMonth,
      locale,
      goNextMonth,
      goPreviousMonth,
      goToDay,
    } = useCalendarContext();
    const currentDate = new Date()
      .toLocaleDateString(locale || "en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      .split(" ")
      .join(" ");
    if (children) {
      console.log('da : ', DEFAULT_DATE)
      console.log('activeMonth xxx : ', activeMonth)
      return children({
        activeYear: activeYear,
        activeMonth: activeMonth,
        currentDate: currentDate,
        goNextMonth: goNextMonth,
        goPreviousMonth: goPreviousMonth,
        goToDay: goToDay,
      });
    }
    return (
      <h2 style={{ fontSize: "20px", textIndent: "1.5rem", textAlign: "left" }}>
        {currentDate}
      </h2>
    );
  }
);

export const WeekDayList = () => {
  const { MONTH_LIST, locale } = useCalendarContext();
  return (
    <Weekday>
      {MONTH_LIST?.map((month: any) => {
        return <li key={month.name}>{month?.[locale === "TH" ? 'nameTH' : 'name']}</li>;
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

export const WeekDayItem = ({ children, style }: WeekDayItemProps) => {
  useCalendarContext();
  return <li style={{ ...style }}>{children}</li>;
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
  // console.log(
  //   "check :::",
  //   new Date(fullDate).setHours(0, 0, 0, 0) ===
  //     new Date(startDate).setHours(0, 0, 0, 0)
  // );
  // const todayDate = new Date(fullDate).getDate();
  // const getMonth = new Date(fullDate).getMonth();
  // const getYear = new Date(fullDate).getFullYear();

  // const firstDate = new Date(startDate).getDate();
  // const secondDate = new Date(endDate).getDate();
  // const startDateMonth = new Date(startDate).getMonth();
  // const endDateMonth = new Date(endDate).getMonth();
  // const startDateYear = new Date(startDate).getFullYear();
  // const endDateYear = new Date(endDate).getFullYear();
  return (
    new Date(fullDate).setHours(0, 0, 0, 0) ===
    new Date(startDate).setHours(0, 0, 0, 0) &&
    new Date(fullDate).setHours(0, 0, 0, 0) ===
    new Date(endDate).setHours(0, 0, 0, 0)
  );
  // if (
  //   getMonth === startDateMonth &&
  //   getMonth === endDateMonth &&
  //   todayDate === firstDate &&
  //   todayDate === secondDate &&
  //   getYear === startDateYear &&
  //   getYear === endDateYear
  // ) {
  //   return true;
  // }

  // return false;
};

export const DateEvent = memo(
  ({ renderEvent, activeStyle, dayContainerStyle }: DateEventProps) => {
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
      disableSwipe,
      fixWeek,
      onClick,
      onSwipe
    } = useCalendarContext();
    const isFixWeek = fixWeek && calendarType === "week";
    console.log('eventLists : ', eventLists)

    const renderDate = useMemo(() => {
      return renderDay.map(({ date, isToday, currentMonth, fullDate }: any) => {
        const isActiveDate =
          new Date(activeYear, activeMonth, activeDate).getTime() ===
          new Date(fullDate).getTime();

        const isActiveItem =
          (activeDate === null && isToday) ||
          (isActiveDate && activeDate !== null);

        const selectedYear = new Date(fullDate).getFullYear();
        const selectedMonth = new Date(fullDate).getMonth();
        const selectedDate = new Date(fullDate).getDate();

        const removeDuplicateEvent = eventLists?.reduce(
          (arr: any, item: any) => {
            const removed = arr.filter(
              (i: any) =>
                new Date(i["startDate"]).getDate() !==
                new Date(item["startDate"]).getDate()
            );
            return [...removed, item];
          },
          []
        );

        return (
          <DayItem
            data-testid="day-item"
            onClick={() => {
              setActiveDate({
                year: selectedYear,
                month: selectedMonth,
                date: selectedDate,
              });
              onClick &&
                onClick({
                  activeDate: selectedDate,
                  activeMonth: selectedMonth,
                  activeYear: selectedYear,
                });
            }}
            key={fullDate}
            isCurrentMonth={currentMonth}
          >
            {!displayFullEvent || calendarType === "week" ? (
              <DayContainer style={{ ...dayContainerStyle }} today={isToday} isActiveDate={isActiveItem}>
                <TodayText>{date}</TodayText>
                {isActiveItem && (
                  <ActiveItem
                    style={{ ...activeStyle }}
                    layoutId="outline"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                      delay: calendarType === "month" || isFixWeek ? 0 : 0.3,
                    }}
                  />
                )}

                {removeDuplicateEvent?.map((event: any) => {
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
                      delay: calendarType === "month" ? 0 : 0.2,
                    }}
                    style={{ ...activeStyle }}
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
    }, [renderDay, activeYear, activeMonth, activeDate, eventLists, displayFullEvent, calendarType, dayContainerStyle, activeStyle, isFixWeek, setActiveDate, onClick, renderEvent]);

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
      return Math.abs(offset) * velocity;
    };


    return (
      <Framer.LayoutGroup id="calendar">
        {isFixWeek ? (
          <Days>{renderDate}</Days>
        ) : (
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
                    translateX: direction > 0 ? 1000 : -1000,
                    opacity: 0,
                    position: "absolute",
                  };
                },
                center: () => {
                  return {
                    zIndex: 1,
                    translateX: 0,
                    opacity: 1,
                    position: "relative",
                    x: 0,
                  };
                },
                exit: (direction: number) => {
                  return {
                    zIndex: 0,
                    translateX: direction < 0 ? 1000 : -1000,

                    opacity: 0,
                    position: "absolute",
                  };
                },
              }}
              initial="enter"
              animate={"center"}
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                // opacity: { duration: 0.2 },
                // position: { duration: 0 },
              }}
              drag={disableSwipe || isFixWeek ? undefined : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0}
              onDragEnd={(_, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  calendarType === "month" ? goNextMonth() : goNextWeek();
                  onSwipe && onSwipe({ activeYear, activeMonth, activeDate, direction: 'next' })
                } else if (swipe > swipeConfidenceThreshold) {
                  calendarType === "month"
                    ? goPreviousMonth()
                    : goPreviousWeek();
                  onSwipe && onSwipe({ activeYear, activeMonth, activeDate, direction: 'previous' })
                }
              }}
            >
              <Days>{renderDate}</Days>
            </motion.div>
          </AnimatePresence>
        )}
      </Framer.LayoutGroup>
    );
  }
);

const ActiveItem = styled(motion.div)`
  position: absolute;

  background-color: #56a0ef;
  border-radius: 8px;
  width: 100%;
  min-height: 80%;
  max-height: 80%;
  /* height: 55px; */
  left: 0%;
  top: 0%;
`;

const ActiveItemFullEvent = styled(motion.div)`
  position: absolute;
  left: 5%;
  top: 14%;
  background-color: #56a0ef;
  border-radius: 8px;
  width: 100%;
  max-width: 90%;
  /* width: 40px; */
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
  /* position: absolute; */
  width: 100%;
`;

const EventLabel = styled.div<{
  today?: boolean;
  displayFullEvent?: boolean;
}>`
  display: flex;
  justify-content: center;
  flex-direction: column;
  /* position: relative; */
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
        color: #287fde;
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
  /* max-width: 30%; */
  /* position: relative; */

  /* 
  min-width: 50%; */
  margin: 0 auto;
  ${getActiveDate};
  /* gap : 8px; */

  /* min-width: 40%;
  max-width: 40%; */
`;

const DayItem = styled.div<{ isCurrentMonth?: boolean }>`
  min-height: 70px;
  list-style-type: none;
  display: inline-block;
  width: 13.6%;
  text-align: center;
  position: relative;
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
  font-size: 10px;
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
