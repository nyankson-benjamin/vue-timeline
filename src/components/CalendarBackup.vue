<template>
    <div>
        {{ formatThisDate("2024-04-10") }}
        <div class="container">
            <div>
                <button class="currentMonth" @click="getToday()">This month</button>
            </div>
            <div>
                <input type="month" v-model="selectDate">
            </div>

        </div>

        <div class="change-month">
            <button @click="prevMonth">
                < </button>
                    <p class="month-year">{{ formatDate }}</p>
                    <button @click="nextMonth"> > </button>
        </div>
        {{ getMonthCalendar(month, year)?.flatMap(item => item).flatMap(item => item)?.filter(list => list.dayName &&
            list.dayNumber)?.map(date => date.date) }}

        <div class="timeline">

            <div class="cal">
                <div
                    v-for="date in getMonthCalendar(month, year)?.flatMap(item => item)?.filter(list => list.dayName && list.dayNumber)">


                    <div
                        :class="date.date?.split(' ')?.[0]?.includes('Sun') || date.date?.split(' ')?.[0]?.includes('Sat') ? 'weekend' : 'workday'">
                        <p>{{ date.date?.split(" ")?.[0]?.[0] }}</p>
                        <p :class="{ today: date.date === formatTodayDate }"> {{ date.dayNumber }}</p>

                    </div>
                </div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Employee</th>
                    <th
                        v-for="date in getMonthCalendar(month, year)?.flatMap(item => item)?.filter(list => list.dayName && list.dayNumber)">
                        <div
                            :class="date.date?.split(' ')?.[0]?.includes('Sun') || date.date?.split(' ')?.[0]?.includes('Sat') ? 'weekend' : 'workday'">
                            <p>{{ date.date?.split(" ")?.[0]?.[0] }}</p>
                            <p :class="{ today: date.date === formatTodayDate }"> {{ date.dayNumber }}</p>

                        </div>
                    </th>
                </tr>
            </thead>

            <tbody>
                <tr
                    v-for="date in getMonthCalendar(month, year)?.flatMap(item => item)?.filter(list => list.dayName && list.dayNumber)">
                    <td v-for="employee in employees">
                        {{ employee.name }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { getMonthCalendar } from '@/utils/Helpers';
import moment from 'moment';
import { ref, watch } from 'vue';
const year = ref(new Date().getFullYear());
const today = (new Date().getMonth() + 1);
const month = ref(today);
const getMonthType = ref(month.value.toString().length === 1 ? `0${month.value}` : month.value);

const selectDate = ref(`${year.value}-${getMonthType.value}`);
const formatDate = ref(moment(new Date()).format('MMMM YYYY'))
const formatTodayDate = ref(moment(new Date()).format('dddd MMMM Do YYYY'))


const getToday = () => {
    const todayDate = moment();
    month.value = todayDate.month() + 1;
    year.value = todayDate.year();
    selectDate.value = `${year.value}-${month.value.toString().padStart(2, '0')}`;
    formatDate.value = todayDate.format('MMMM YYYY');
};


watch(selectDate, (val) => {
    year.value = Number(val?.split("-")?.[0]);
    month.value = Number(val?.split("-")?.[1]);
    formatDate.value = moment(val, 'YYYY-MM').format('MMMM YYYY');
})


const employees = [
    {
        name: "Benjamin", projects: [
            { name: "projectA", startDate: "2024-04-1", endDate: "2024-04-10", bgColor: "blue" },
            { name: "projectB", startDate: "2024-01-15", endDate: "2025-05-05", bgColor: "green" }
        ]
    },

    {
        name: "Nyankson", projects: [
            { name: "projectC", startDate: "2024-04-10", endDate: "2024-04-15", bgColor: "lime" },
            { name: "projectD", startDate: "2024-01-15", endDate: "2025-05-05" }
        ]
    },
    {
        name: "Benjamin", projects: [
            { name: "projectE", startDate: "2024-05-11", endDate: "2024-08-10", bgColor: "red" },
            { name: "projectF", startDate: "2023-01-15", endDate: "2025-05-05" }
        ]
    }
]

const formatThisDate = (date: string) => {
    return moment(date).format("dddd MMMM Do YYYY")
}

function getDatesBetween(startDateStr: string, endDateStr: string): string[] {
    const dates: string[] = [];
    let currentDate = moment(startDateStr);
    const endDate = moment(endDateStr);

    while (currentDate <= endDate) {
        dates.push(currentDate.format('dddd MMMM Do YYYY'));
        currentDate.add(1, 'days');
    }
    return dates;
}

// Example usage:
const startDateStr = '2024-04-01';  // Example start date
const endDateStr = '2024-04-10';    // Example end date

const datesBetween = getDatesBetween(startDateStr, endDateStr);
console.log(datesBetween);

const getEmployeesTimeLine = (calandarDate: string) => {
    const viewEmployees = employees.flatMap(emp => {
        const projectsOnDate = emp.projects.filter(item => formatThisDate(item.startDate) === calandarDate);
        if (projectsOnDate.length) {
            // console.log(calandarDate);
            return { ...emp, projects: projectsOnDate };
        } else {
            return [];
        }
    });

    if (viewEmployees.length) {
        console.log(viewEmployees);
        return (viewEmployees);
    }
    // employees.forEach((emp) => {
    //     emp.projects.forEach(item => {
    //         console.log({ mom: moment(item.startDate).format("MMMM Do YYYY"), all });
    //         if (moment(item.startDate).format("MMMM Do YYYY") === calandarDate?.split(" ")[1][2][3]) {
    //             // console.log("we have");
    //         }
    //     })
    // })
}



const nextMonth = () => {
    const nextDate = moment(formatDate.value, 'MMMM YYYY').add(1, 'months');
    formatDate.value = nextDate.format('MMMM YYYY');
    month.value = nextDate.month() + 1;
    year.value = nextDate.year();
    selectDate.value = `${year.value}-${month.value.toString().padStart(2, '0')}`;
};

const prevMonth = () => {
    const prevDate = moment(formatDate.value, 'MMMM YYYY').subtract(1, 'months');
    formatDate.value = prevDate.format('MMMM YYYY');
    month.value = prevDate.month() + 1;
    year.value = prevDate.year();
    selectDate.value = `${year.value}-${month.value.toString().padStart(2, '0')}`;
};


const calculateProjectWidth = (project: { startDate: string, endDate: string }, currentDate: Date) => {
    const startDate = moment(project.startDate);
    const endDate = moment(project.endDate);
    const monthStartDate = moment(currentDate).startOf('month');
    const nextMonthStartDate = moment(currentDate).add(1, 'month').startOf('month');
    const monthEndDate = moment(currentDate).endOf('month');

    // Adjust start and end dates to fall within the current month or the next month
    const adjustedStartDate = startDate.isBefore(monthStartDate) ? monthStartDate : startDate;
    const adjustedEndDate = endDate.isAfter(monthEndDate) ? monthEndDate : endDate;

    // Calculate duration within the current month
    const currentMonthDuration = Math.max(0, moment.min(adjustedEndDate, monthEndDate).diff(adjustedStartDate, 'days') + 1);

    // Calculate duration within the next month (if applicable)
    const nextMonthDuration = adjustedEndDate.isAfter(monthEndDate) ? Math.max(0, adjustedEndDate.diff(nextMonthStartDate, 'days')) : 0;

    // Total duration considering both the current and next month
    const totalDuration = currentMonthDuration + nextMonthDuration;

    return `${totalDuration * 50}px`; // Assuming 1 day = 50px width, adjust as needed
};


</script>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    gap: 10px;

}

.cal {
    display: flex;
    justify-content: space-between;
    /* gap: 20px; */
    /* width: 90%; */
    margin: 0px auto;
    padding: 10px;
    height: 100vh;
    /* border: 1px solid; */

}

.workday {
    /* border: 1px solid; */
    background-color: rgb(255, 255, 255);
    width: 50px;
    text-align: center;
    /* height: 100vh; */

}

.weekend {
    /* border: 1px solid; */
    background-color: rgb(230, 228, 228);
    width: 50px;
    text-align: center;
    /* height: 100vh; */
    margin-left: 2px;
}

.timeline {
    display: flex;
}

.header {
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.left-side-bar {
    /* border: 1px solid; */
    margin-top: 10px;
    width: 100%;
    height: 100vh;
}

.employee-list-container {
    display: flex;
    flex-direction: column;
    gap: 50px;
}

.today {
    background-color: red;
    color: bisque;
    border-radius: 20px;
}

.change-month {
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

.month-year {
    width: 200px;
    text-align: center;
    font-size: large;
    font-weight: bold;
}

button {
    background-color: transparent;
    border: none;
    cursor: pointer;
}

.currentMonth {
    background-color: bisque;
    padding: 5px;
    border-radius: 10px;
}

.emp {
    /* background-color: aquamarine; */
    z-index: 1000;
    position: relative;
    width: 100%;
}

/* .emp p { */
/* background-color: rgb(0, 255, 170); */
/* width: 500px; */
/* padding: 10px; */
/* } */
</style>