<template>
  <div class="gantt-container">
    <div class="timeline-header">
      <div class="header-name">Employee</div> <!-- Reserved space for employee names -->
      <div class="header-timeline">
        <div v-for="day in daysInMonth" :key="day" class="day" :style="{ width: getDayWidth() + '%' }">
          {{ day }}
        </div>
      </div>
    </div>
    <div v-for="employee in employees" :key="employee.info.id" class="employee-row">
      <div class="employee-name">{{ employee.name }}</div>
      <div class="employee-projects">
        <div v-for="project in employee.projects" :key="project.id" class="project" :style="{ backgroundColor: project.color, left: getProjectStart(project.startDate), width: getProjectDuration(project.startDate, project.endDate) + '%' }">
          {{ project.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GanttChart',
  props: ['employees'],
  data() {
    return {
      currentYear: 2024,
      currentMonth: 5, // May, adjust as needed
      daysInMonth: new Date(2024, 5, 0).getDate() // Get days in May 2024
    };
  },
  methods: {
    getDayWidth() {
      return 100 / this.daysInMonth; // Width of each day as a percentage
    },
    getProjectStart(startDate) {
      const start = new Date(startDate);
      const monthStart = new Date(this.currentYear, this.currentMonth - 1, 1);
      return Math.max(0, (start - monthStart) / (1000 * 60 * 60 * 24)) * this.getDayWidth(); // Convert to percentage
    },
    getProjectDuration(startDate, endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return ((end - start) / (1000 * 60 * 60 * 24)) * this.getDayWidth(); // Convert days to percentage width
    }
  }
}
</script>

<style>
.gantt-container {
  width: 100%;
  position: relative;
}
.timeline-header, .employee-row {
  display: flex;
}
.header-name, .employee-name {
  width: 200px; /* fixed width for names */
  padding-right: 10px;
  text-align: right;
}
.header-timeline, .employee-projects {
  flex: 1;
  position: relative;
  display: flex;
}
.day {
  height: 30px;
  border-right: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}
.employee-projects {
  height: 30px;
  background-color: #f0f0f0;
}
.project {
  position: absolute;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: white;
}
</style>
