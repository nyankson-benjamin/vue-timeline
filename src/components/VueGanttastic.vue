<template>
    <div class="calendar-nav">
        <button @click="goToPreviousMonth">Previous</button>
        <h2>{{ moment(currentMonth).format("MMMM YYYY") }}</h2>
        <h2>{{ currentMonth }}</h2>
        <h2>{{ getStartEndDate(currentMonth).startDate }}</h2>
        <button @click="goToNextMonth">Next</button>
    </div>
    <g-gantt-chart no-overlap current-time :push-on-overlap="false" :row-height="300"
        :chart-start="getStartEndDate(currentMonth).startDate + ' 12:00'"
        :chart-end="getStartEndDate(currentMonth).endDate + ' 12:00'" precision="day" bar-start="myBeginDate"
        bar-end="myEndDate" label-column-title="Employee" label-column-width="200px">
        <g-gantt-row v-for="emp in employeeList" :label="emp.label" :bars="emp.projects" class="gantt-bar" />
    </g-gantt-chart>
</template>

<script setup>
import { ref, computed } from "vue"
import moment from "moment";

const employees = ref([
    {
        info: { name: "John", id: 1, employee_info: { client_ready: true } },
        name: "John",
        projects: [
            { name: "Project A", id: 1, startDate: "2024-05-01", endDate: "2024-06-15", color: "red" },
            { name: "Project E", id: 5, startDate: "2024-05-07", endDate: "2024-05-15", color: "orange" },
            { name: "Project B", id: 2, startDate: "2024-03-01", endDate: "2024-04-15", color: "blue" },
            { name: "Project F", id: 6, startDate: "2024-05-02", endDate: "2024-05-17", color: "blue" }
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
])

const currentMonth = ref(new Date().toLocaleString('default', { month: 'long', year: 'numeric' }))
const currentDate = ref(new Date())
// const selectedDate = : this.formatDate(new Date()),

const updateCurrentMonth = () => {
    currentMonth.value = currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' });
}

const goToPreviousMonth = () => {
    const newDate = new Date(currentDate.value);
    newDate.setMonth(newDate.getMonth() - 1);
    currentDate.value = newDate;
    updateCurrentMonth();
}

const goToNextMonth = () => {
    const newDate = new Date(currentDate.value);
    newDate.setMonth(newDate.getMonth() + 1);
    currentDate.value = newDate;
    updateCurrentMonth();
}


const employeeList = computed(() => {
    return employees.value?.map((emp) => {
        return {
            label: emp.info.name,
            projects: emp.projects.map((proj, idx) => {
                return {
                    myBeginDate: proj.startDate + " 13:00",
                    myEndDate: proj.endDate + " 13:00",
                    ganttBarConfig: {
                        id: proj.name,
                        label: proj.name,
                        style: {
                            height: "40px", // Set the height of the bars here
                            background: proj.color,
                            borderRadius: "10px",
                            color: "black",
                            marginTop: idx !== 0 ? 20 * idx + "px" : "",
                        }

                    }
                }
            })
        }
    })
})

function getStartEndDate(monthYear) {
    const [month, year] = monthYear.split(" ");
    const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0); // Setting day to 0 gets the last day of the previous month
    return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
    };
}

// Example usage:
const monthYear = "June 2024";
const { startDate, endDate } = getStartEndDate(monthYear);
console.log("Start Date:", startDate); // Output: Start Date: 2024-06-01
console.log("End Date:", endDate);     // Output: End Date: 2024-06-30

</script>
