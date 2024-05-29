<template>
    <button @click="year = year - 1">&lt;</button>
    {{ year }}
    <button @click="year = year + 1">&gt;</button>
    <div class="fixedColumn">
        <table>
            <thead>
                <tr>
                    <th>Employees</th>
                    <th v-for="month in months" :key="month">{{ month }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="employee in employees" :key="employee.info.id">
                    <td>{{ employee.name }}</td>
                    <td v-for="month in months" :key="month">
                        <div style="min-width: 300px; min-height: 50px;">
                            <div v-for="project in getProjectsForMonth(employee?.projects, month)" :key="project.id"
                                class="project"
                                :style="{ backgroundColor: project.color, color: '#fff', padding: '2px', margin: '2px', borderRadius: '4px' }">
                                <p> {{ project.name }}
                                </p>

                                <div>
                                    <p>{{ project.name }}</p>
                                </div>

                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import moment from 'moment';

const year = ref(new Date().getFullYear());

const employees = ref([
    {
        info: { name: "John", id: 1, employee_info: { client_ready: true } },
        name: "John",
        projects: [
            { name: "Project A", id: 1, startDate: "1995-05-07", endDate: "2025-05-12", color: "red", billable: true, prpoject_hours: 8 },
            { name: "Project E", id: 5, startDate: "2024-05-07", endDate: "2024-05-15", color: "orange", billable: false, prpoject_hours: 8 },
            { name: "Project B", id: 2, startDate: "2024-03-01", endDate: "2024-04-15", color: "blue", billable: true, prpoject_hours: 8 },
            { name: "Project F", id: 6, startDate: "2024-05-02", endDate: "2024-05-15", color: "blue", billable: true, prpoject_hours: 8 }
        ]
    },
    {
        info: { name: "Alice", id: 2, employee_info: { client_ready: false } },
        name: "Alice",
        projects: [
            { name: "Project A", id: 1, startDate: "2024-05-01", endDate: "2024-05-15", color: "red", billable: true, prpoject_hours: 8 },
            { name: "Project C", id: 3, startDate: "2024-02-01", endDate: "2024-03-15", color: "green", billable: false, prpoject_hours: 8 },
            { name: "Project D", id: 4, startDate: "2025-02-05", endDate: "2026-03-15", color: "lime", billable: true, prpoject_hours: 8 }
        ]
    },
    {
        info: { name: "Ben", id: 3, employee_info: { client_ready: true } },
        name: "Ben",
        projects: [
            { name: "Project A", id: 1, startDate: "2024-05-01", endDate: "2024-06-07", color: "red", billable: false, prpoject_hours: 8 },
            { name: "Project C", id: 3, startDate: "2024-02-01", endDate: "2024-03-15", color: "green", billable: false, prpoject_hours: 8 },
            { name: "Project D", id: 4, startDate: "2025-02-05", endDate: "2026-03-15", color: "lime", billable: true, prpoject_hours: 8 }
        ]
    },
    {
        info: { name: "Ben", id: 3, employee_info: { client_ready: true } },
        name: "Ben",
        projects: [
            { name: "Project A", id: 1, startDate: "2024-05-01", endDate: "2024-06-07", color: "red", billable: false, prpoject_hours: 8 },
            { name: "Project C", id: 3, startDate: "2024-02-01", endDate: "2024-03-04", color: "green", billable: false, prpoject_hours: 8 },
            { name: "Project D", id: 4, startDate: "2025-02-05", endDate: "2026-03-15", color: "lime", billable: true, prpoject_hours: 8 }
        ]
    },
    {
        info: { name: "John", id: 1, employee_info: { client_ready: true } },
        name: "John",
        projects: [
            { name: "Project A", id: 1, startDate: "1995-05-07", endDate: "2025-05-12", color: "red", billable: true, prpoject_hours: 8 },
            { name: "Project E", id: 5, startDate: "2024-05-07", endDate: "2024-05-15", color: "orange", billable: false, prpoject_hours: 8 },
            { name: "Project B", id: 2, startDate: "2024-03-01", endDate: "2024-04-15", color: "blue", billable: true, prpoject_hours: 8 },
            { name: "Project F", id: 6, startDate: "2024-05-02", endDate: "2024-05-15", color: "blue", billable: true, prpoject_hours: 8 }
        ]
    },
    {
        info: { name: "Alice", id: 2, employee_info: { client_ready: false } },
        name: "Alice",
        projects: [
            { name: "Project A", id: 1, startDate: "2024-05-01", endDate: "2024-05-15", color: "red", billable: true, prpoject_hours: 8 },
            { name: "Project C", id: 3, startDate: "2024-02-01", endDate: "2024-03-15", color: "green", billable: false, prpoject_hours: 8 },
            { name: "Project D", id: 4, startDate: "2025-02-05", endDate: "2026-03-15", color: "lime", billable: true, prpoject_hours: 8 }
        ]
    },
    {
        info: { name: "Ben", id: 3, employee_info: { client_ready: true } },
        name: "Ben",
        projects: [
            { name: "Project A", id: 1, startDate: "2024-05-01", endDate: "2024-06-07", color: "red", billable: false, prpoject_hours: 8 },
            { name: "Project C", id: 3, startDate: "2024-02-01", endDate: "2024-03-15", color: "green", billable: false, prpoject_hours: 8 },
            { name: "Project D", id: 4, startDate: "2025-02-05", endDate: "2026-03-15", color: "lime", billable: true, prpoject_hours: 8 }
        ]
    },
    {
        info: { name: "Ben", id: 3, employee_info: { client_ready: true } },
        name: "Ben",
        projects: [
            { name: "Project A", id: 1, startDate: "2024-05-01", endDate: "2024-06-07", color: "red", billable: false, prpoject_hours: 8 },
            { name: "Project C", id: 3, startDate: "2024-02-01", endDate: "2024-03-04", color: "green", billable: false, prpoject_hours: 8 },
            { name: "Project D", id: 4, startDate: "2025-02-05", endDate: "2026-03-15", color: "lime", billable: true, prpoject_hours: 8 }
        ]
    },
    {
        info: { name: "John", id: 1, employee_info: { client_ready: true } },
        name: "John",
        projects: [
            { name: "Project A", id: 1, startDate: "1995-05-07", endDate: "2025-05-12", color: "red", billable: true, prpoject_hours: 8 },
            { name: "Project E", id: 5, startDate: "2024-05-07", endDate: "2024-05-15", color: "orange", billable: false, prpoject_hours: 8 },
            { name: "Project B", id: 2, startDate: "2024-03-01", endDate: "2024-04-15", color: "blue", billable: true, prpoject_hours: 8 },
            { name: "Project F", id: 6, startDate: "2024-05-02", endDate: "2024-05-15", color: "blue", billable: true, prpoject_hours: 8 }
        ]
    },
    {
        info: { name: "Alice", id: 2, employee_info: { client_ready: false } },
        name: "Alice",
        projects: [
            { name: "Project A", id: 1, startDate: "2024-05-01", endDate: "2024-05-15", color: "red", billable: true, prpoject_hours: 8 },
            { name: "Project C", id: 3, startDate: "2024-02-01", endDate: "2024-03-15", color: "green", billable: false, prpoject_hours: 8 },
            { name: "Project D", id: 4, startDate: "2025-02-05", endDate: "2026-03-15", color: "lime", billable: true, prpoject_hours: 8 }
        ]
    },
    {
        info: { name: "Ben", id: 3, employee_info: { client_ready: true } },
        name: "Ben",
        projects: [
            { name: "Project A", id: 1, startDate: "2024-05-01", endDate: "2024-06-07", color: "red", billable: false, prpoject_hours: 8 },
            { name: "Project C", id: 3, startDate: "2024-02-01", endDate: "2024-03-15", color: "green", billable: false, prpoject_hours: 8 },
            { name: "Project D", id: 4, startDate: "2025-02-05", endDate: "2026-03-15", color: "lime", billable: true, prpoject_hours: 8 }
        ]
    },
    {
        info: { name: "Ben", id: 3, employee_info: { client_ready: true } },
        name: "Ben",
        projects: [
            { name: "Project A", id: 1, startDate: "2024-05-01", endDate: "2024-06-07", color: "red", billable: false, prpoject_hours: 8 },
            { name: "Project C", id: 3, startDate: "2024-02-01", endDate: "2024-03-04", color: "green", billable: false, prpoject_hours: 8 },
            { name: "Project D", id: 4, startDate: "2025-02-05", endDate: "2026-03-15", color: "lime", billable: true, prpoject_hours: 8 }
        ]
    }
]);

type Project = {
    name:string,
    startDate:string,
    endDate:string,
    color:string, 
    id:number
}
// Array of month names
const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Helper function to get the projects for a given month
const getProjectsForMonth = (projects:Project[], month:string)=> {
    const monthIndex = months.indexOf(month);
    const startDate = moment(`${year.value}-${String(monthIndex + 1).padStart(2, '0')}-01`);
    const endDate = moment(startDate).endOf('month');
    console.log({startDate, endDate});
    return projects?.filter(project => {
        const projectStart = moment(project.startDate);
        const projectEnd = moment(project.endDate);
        return projectStart.isBefore(endDate) && projectEnd.isAfter(startDate);
    });
}

</script>

<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
}

.fixedColumn {
    height: 85vh;
    overflow-y: scroll;
}

.fixedColumn td:nth-child(1),
.fixedColumn th:nth-child(1) {
    position: sticky;
    left: 0px;
    z-index: 1;

}

.fixedColumn th:nth-child(1) {
    background-color: #FAFBFF;
}

.fixedColumn thead {
    position: sticky;
    top: 0px;
    width: 100%;
    z-index: 2;
    /* Ensure the header is above the content */
    background-color: #FAFBFF;

}

.fixedColumn td:nth-child(1) {
    background-color: #fff;
    border-right: 1px solid rgb(240, 239, 239);
}

.fixedColumn td:nth-child(1):hover {
    --tw-bg-opacity: 1;
    background-color: rgb(243 244 246 / var(--tw-bg-opacity));
}

.project {
    width: 300px;
    height: 50px;
    /* line-height: 50px; */
}
</style>
