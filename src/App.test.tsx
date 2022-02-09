import { chunk, daysInMonth, getWeeksNumber } from "./components/Calendar";

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
