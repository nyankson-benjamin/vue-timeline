<template>
    <table>
        <thead>
            <tr>
                <th>Employee</th>
                <th v-for="header in headers" :key="header">{{ header }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="employee in employees" :key="employee.info.id">
                <td>{{ employee.name }}</td>
                <td v-for="header in headers" :key="header" :style="getProjectStyle(employee.projects, header)">
                    <!-- Placeholder for projects -->
                    <div v-for="project in employee.projects"  :style="{background:project.color}" >
                        {{ project.name }}
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
export default {
    props: {
        employees: Array,
        view: String
    },
    computed: {
        headers() {
            if (this.view === 'Monthly') {
                return this.generateMonthlyHeaders();
            } else {
                return this.generateYearlyHeaders();
            }
        }
    },
    methods: {
        generateMonthlyHeaders() {
            let current = new Date();
            let year = current.getFullYear();
            let month = current.getMonth();
            let weeks = [];
            let date = new Date(year, month, 1);
            while (date.getMonth() === month) {
                let weekStart = new Date(date);
                weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Adjust to start of the week
                weeks.push(weekStart.toISOString().slice(0, 10));
                date.setDate(date.getDate() + 7); // Next week
            }
            return weeks;
        },

        generateYearlyHeaders() {
            let months = [];
            for (let i = 0; i < 12; i++) {
                months.push(new Date(new Date().getFullYear(), i, 1).toLocaleString('default', { month: 'short' }));
            }
            return months;
        },

        getProjectStyle(projects, header) {
            let headerDate = new Date(header);
            let style = {};
            projects.forEach(project => {
                let startDate = new Date(project.startDate);
                let endDate = new Date(project.endDate);

                // For monthly view, check if the project falls within the week of the header
                if (this.view === 'Monthly') {
                    let endOfWeek = new Date(headerDate);
                    endOfWeek.setDate(endOfWeek.getDate() + 6); // End of week

                    if (startDate <= endOfWeek && endDate >= headerDate) {
                        style = { background: project.color };
                    }
                }

                // For yearly view, check if the project falls within the month of the header
                if (this.view === 'Yearly') {
                    let month = new Date(0, headerDate.getMonth(), 1);
                    let startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
                    let endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

                    if (startDate <= endOfMonth && endDate >= startOfMonth) {
                        style = { background: project.color };
                    }
                }
            });

            return style;
        },

    }
}
</script>

<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: center;
}
</style>