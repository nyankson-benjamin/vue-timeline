const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
import moment from "moment";

export function getMonthCalendar(month = currentMonth, year = currentYear) {
  // Array of day names starting from Monday
  const dayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Get the first day of the month
  let firstDayOfMonth = new Date(year, month - 1, );

  // Get the day of the week for the first day
  let startingDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday

  // Calculate the number of days in the month
  let daysInMonth = new Date(year, month, 0).getDate();

  // Initialize calendar array to store weeks
  let calendar = [];

  // Initialize counter for days
  let dayCounter = 1;

  // Loop through each week
  for (let week = 0; dayCounter <= daysInMonth; week++) {
    let weekDays = [];

    // Fill the week array with day objects
    for (let i = 0; i < 7; i++) {
      if (week === 0 && i < startingDayOfWeek) {
        // Add empty days before the first day of the month
        weekDays.push({ dayNumber: null, dayName: null, date: null });
      } else if (dayCounter <= daysInMonth) {
        // Add days of the month
        let date = (new Date(year, month - 1, dayCounter));
        let dayName = dayNames[date.getDay()];
        weekDays.push({ dayNumber: dayCounter, dayName: dayName, date: moment(date).format("dddd MMMM Do YYYY") });
        dayCounter++;
      } else {
        // Add empty days after the last day of the month
        weekDays.push({ dayNumber: null, dayName: null, date: null });
      }
    }

    // Add the week to the calendar array
    calendar.push(weekDays);
  }

  return calendar;
}

// // Example usage:
// let monthCalendar = getMonthCalendar(5, 2024); // May 2024
// monthCalendar.forEach((week, index) => {
//     console.log(`Week ${index + 1}:`);
//     week.forEach(day => {
//         if (day.dayNumber !== null) {
//             console.log(`Date: ${day.date.toDateString()}, Day number: ${day.dayNumber}, Day name: ${day.dayName}`);
//         } else {
//             console.log("Empty");
//         }
//     });
// });
