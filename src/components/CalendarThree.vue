<template>
    <div>
        mfenfjkebnf
        <table>
            <+thead>
                <tr>
                    <th>Employee</th>
                    <th v-for="week in weeks" :key="week.start">
                        Week {{ week.start }} - {{ week.end }}
                    </th>
                </tr>
            </+thead>
            <tbody>
                <tr v-for="employee in employees" :key="employee.name">
                    <td>{{ employee.name }}</td>
                    <td v-for="week in weeks" :key="week.start">
                        <span v-for="project in employee.projects" :key="project.name">
                            <!-- Check if the project is within this week -->
                            <span
                                v-if="new Date(project.start) >= new Date(currentDate.getFullYear(), currentDate.getMonth(), week.start) &&
                                    new Date(project.end) <= new Date(currentDate.getFullYear(), currentDate.getMonth(), week.end)">
                                {{ project.name }}
                            </span>
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<script>
export default {
    data() {
        return {
            employees: [
                {
                    name: 'Alvin Gomez',
                    projects: [
                        { name: 'Q4 OKR Brief', start: '2021-09-22', end: '2021-09-24' }
                        // More projects...
                    ]
                },
                // More employees...
            ],
            currentDate: new Date()
        };
    },

    methods: {
        getWeeksInMonth(month, year) {
            let weeks = [],
                firstDate = new Date(year, month, 1),
                lastDate = new Date(year, month + 1, 0),
                numDays = lastDate.getDate();

            let start = 1;
            let end = 7 - firstDate.getDay();
            while (start <= numDays) {
                weeks.push({ start, end: end > numDays ? numDays : end });
                start = end + 1;
                end = end + 7;
                if (end > numDays) {
                    end = numDays;
                }
            }
            return weeks;
        }
    },
    created() {
        this.weeks = this.getWeeksInMonth(this.currentDate.getMonth(), this.currentDate.getFullYear());
    }


}
</script>

<style lang="scss" scoped></style>