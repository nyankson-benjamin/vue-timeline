<template>
    <div>
      <button @click="toggleView">{{ view }}</button>
      <TimelineTable :employees="employees" :view="view" />
    </div>
  </template>
  
  <script>
  import TimelineTable from './TimelineTable.vue';
  
  export default {
    data() {
      return {
        view: 'Monthly', // or 'Yearly'
       employees: [
                {
                    info: { name: "John", id: 1, employee_info: { client_ready: true } },
                    name: "John",
                    projects: [
                        { name: "Project A", id: 1, startDate: "2024-05-01", endDate: "2024-06-15", color: "red" },
                        { name: "Project E", id: 5, startDate: "2024-05-07", endDate: "2024-05-15", color: "orange" },
                        { name: "Project B", id: 2, startDate: "2024-03-01", endDate: "2024-04-15", color: "blue" },
                        { name: "Project F", id: 6, startDate: "2024-05-02", endDate: "2024-05-15", color: "blue" }
                    ]
                },
                {
                    info: { name: "Alice", id: 2, employee_info: { client_ready: false } },

                    name: "Alice",
                    projects: [
                        { name: "Project A", id: 1, startDate: "2024-05-01", endDate: "2024-05-15", color: "red" },
                        { name: "Project C", id: 3, startDate: "2024-02-01", endDate: "2024-03-15", color: "green" },
                        { name: "Project D", id: 4, startDate: "2025-02-05", endDate: "2026-03-15", color: "lime" }
                    ]
                },
                {
                    info: { name: "Ben", id: 3, employee_info: { client_ready: true } },

                    name: "Ben",
                    projects: [
                        { name: "Project A", id: 1, startDate: "2024-05-01", endDate: "2024-06-07", color: "red" },
                        { name: "Project C", id: 3, startDate: "2024-02-01", endDate: "2024-03-15", color: "green" },
                        { name: "Project D", id: 4, startDate: "2025-02-05", endDate: "2026-03-15", color: "lime" }
                    ]
                }
            ]
      };
    },
    methods: {
      toggleView() {
        this.view = this.view === 'Monthly' ? 'Yearly' : 'Monthly';
      }
    },
    components: {
      TimelineTable
    }
  }
  </script>
  