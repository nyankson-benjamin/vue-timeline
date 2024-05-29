<template>
    <div>
      <h1>Employee Timeline</h1>
      <table>
        <thead>
          <tr>
            <th>Week</th>
            <th v-for="day in daysInWeek" :key="day">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(week, index) in weeksInMonth" :key="index">
            <td>{{ week }}</td>
            <td v-for="day in daysInWeek" :key="day">
              <ul>
                <li v-for="employee in employeesWithProjectsInWeek(week, day)" :key="employee.name">
                  <strong>{{ employee.name }}</strong>
                  <ul>
                    <li v-for="project in employee.projects" :key="project.name">
                      <span :style="{ backgroundColor: project.color }">{{ project.name }}</span>
                      <span>{{ formatDate(project.startDate) }} to {{ formatDate(project.endDate) }}</span>
                    </li>
                  </ul>
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>

<script setup>
import { ref, computed, watchEffect } from 'vue';

// Assuming you have props for employees data
const employees = ref([]); // Pass employees data as props
const weeksInMonth = ref([]); // Array of weeks in the month
const daysInWeek = ref(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']); // Array of days in a week

// Compute the weeks in the month
const computeWeeksInMonth = () => {
  const weeks = [];
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
  let currentDay = new Date(firstDayOfMonth);

  while (currentDay <= lastDayOfMonth) {
    weeks.push(`${currentDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${currentDay.setDate(currentDay.getDate() + 6).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);
    currentDay.setDate(currentDay.getDate() + 1);
  }

  weeksInMonth.value = weeks;
};

// Compute employees with projects falling in a particular week and day
const employeesWithProjectsInWeek = (week, day) => {
  const employeesInWeek = [];
  const weekStart = new Date(week.split(' - ')[0]);
  const weekEnd = new Date(week.split(' - ')[1]);

  employees.value.forEach(employee => {
    employee.projects.forEach(project => {
      const projectStartDate = new Date(project.startDate);
      const projectEndDate = new Date(project.endDate);

      if (projectStartDate <= weekEnd && projectEndDate >= weekStart) {
        employeesInWeek.push({ ...employee, project });
      }
    });
  });

  return employeesInWeek;
};

// Initialize weeks in the month
computeWeeksInMonth();

// Watch for changes in employees data
watchEffect(() => {
  computeWeeksInMonth();
});
</script>
