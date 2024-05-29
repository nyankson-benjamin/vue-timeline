<template>
    <table class="timeline">
      <thead>
        <tr>
          <th>Employee</th>
          <th v-for="(week, index) in weeks" :key="index">
            <div class="week-label">Week {{ index + 1 }}</div>
            <div class="week-dates">
              <div v-for="day in week" :key="day.date">
                <span>{{ day.dayName?.[0] }}</span>
                <span>{{ day.dayNumber }}</span>
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(employee, index) in employees" :key="index">
          <td>{{ employee.name }}</td>
          <td v-for="week in weeks" :key="week[0].date?.toISOString()">
            <div class="projects">
              <div class="project" v-for="project in getProjectsForWeek(employee, week[0].date, week[6].date)" :key="project.id" :style="{ backgroundColor: project.color }">
                {{ project.name }} - {{ project.startDate }} to {{ project.endDate }}
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // Dummy data for demonstration
  const employees = [
    {
      name: 'Employee 1',
      projects: [
        { id: 1, name: 'Project A', startDate: '2024-05-03', endDate: '2024-05-05', color: 'red' },
        { id: 2, name: 'Project B', startDate: '2024-05-07', endDate: '2024-05-12', color: 'blue' },
      ],
    },
    // Add more employees if needed
  ];
  
  // Function to get the month calendar
  function getMonthCalendar(month, year) {
    // Array of day names starting from Monday
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
    // Get the first day of the month
    let firstDayOfMonth = new Date(year, month - 1, 1);
  
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
          let date = new Date(year, month - 1, dayCounter);
          let dayName = dayNames[date.getDay()];
          weekDays.push({ dayNumber: dayCounter, dayName: dayName, date: date });
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
  
  // Get the weeks for May 2024
  const weeks = ref(getMonthCalendar(5, 2024));
  
  // Get projects for a given employee and week
  const getProjectsForWeek = (employee, start, end) => {
    const projects = [];
    for (const project of employee.projects) {
      const projectStartDate = new Date(project.startDate);
      const projectEndDate = new Date(project.endDate);
      if (projectStartDate <= end && projectEndDate >= start) {
        projects.push(project);
      }
    }
    return projects;
  };
  </script>
  
  <style scoped>
  .timeline {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 10px;
    border: 1px solid #ccc;
  }
  
  .week-label {
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .week-dates {
    display: flex;
    flex-wrap: wrap;
  }
  
  .week-dates > div {
    flex: 1;
    text-align: center;
  }
  
  .projects {
    display: flex;
    flex-direction: column;
  }
  
  .project {
    margin-bottom: 5px;
    padding: 5px;
    border-radius: 5px;
  }
  </style>
  