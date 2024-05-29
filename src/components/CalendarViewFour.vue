<template>
    <div>
        <MonthSelect @select="handleSelect($event)" :month="currentMonth" :year="currentYear" />
        <div style="display: flex; gap: 5px; justify-content: center; margin-top: 50px; margin-bottom: 50px;"
            class="flex gap-5 justify-center items-center mt-10">
            <button @click="prevMonth">&lt;</button>
            <p style="padding: 5px; display: flex; gap: 5px; width: 100px; text-align: center;">
                <span>{{ formattedMonthYear?.split(" ")[0]?.slice(0, 3) }}</span>
                <span>{{ formattedMonthYear?.split(" ")[1] }}</span>
            </p>
            <button @click="nextMonth">&gt;</button>
        </div>
        <div style="margin: 0px auto; width: 100%;">
            <p style="padding: 5px; display: flex; gap: 5px; width: 100px; text-align: center;">
                <span>{{ formattedMonthYear?.split(" ")[0]?.slice(0, 3) }}</span>
                <span>{{ formattedMonthYear?.split(" ")[1] }}</span>
            </p>
        </div>
        <div class="fixedColumn">

            <table>
                <thead>

                    <tr>
                        <th>Employees</th>
                        <th scope="col" v-for="(week, idx) in getWeeksInMonth" :key="week.weekNumber">
                            <p style="margin: 10px;" class="week-header">W {{ idx + 1 }}
                            </p>
                            <div style="display: flex;">
                                <div v-for="(day, index) in week.dates"
                                    :style="{ borderLeft: index ? '' : '1px solid #E6E8F0' }" class="dates" :key="day">
                                    {{ getDayInfo(moment(day).format('YYYY-MM-DD'))[1]?.toString()?.slice(0, 2) }} {{
                                        getDayInfo(moment(day).format('YYYY-MM-DD'))[0] }}
                                </div>
                            </div>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="emp in employees" :key="emp.info.id">
                        <td>{{ emp.name }}</td>
                        <td v-for="week in getWeeksInMonth" :key="week.weekNumber">
                            <div v-for="proj in emp.projects" :key="proj.id"
                                :class="{ 'invisible-project': !isProjectVisible(week.dates, proj.startDate, proj.endDate) }"
                                :style="{ backgroundColor: stringToColor(proj.color), marginRight: week.dates?.length === 7 ? '35px' : '10px', marginLeft: week.dates?.length === 7 ? '35px' : '10px', marginTop: '10px', minHeight: '62px', borderRadius: '5px', color: '#fff' }">
                                <div style="display: flex; justify-content: left; margin-left: 16px;">
                                    <p :title="proj.name" style=" padding: 10px;" class="project-name"> {{ proj.name }}
                                    </p>
                                </div>

                                <div style="display: flex; justify-content: right; margin-right: 22px; margin-left: 10px;">
                                    <div>
                                        <p>{{ proj.prpoject_hours }}hrs/day</p>
                                        <p style="white-space: nowrap;" >{{ proj.billable ? 'Billable' : 'Not Billable' }}</p>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>

    </div>
</template>

<script setup lang="ts">
import moment from 'moment';
import { computed, onBeforeUnmount, onMounted, ref, } from 'vue';
import MonthSelect from "./MonthSelect.vue";

const currentMonth = ref(new Date().getMonth()); // Current month index (0-11)
const currentYear = ref(new Date().getFullYear()); // Current year

const employees = [
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
    }
];

const getWeekNumber = (d: Date) => {
    const date = new Date(d.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    const week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
}

const getWeeksInMonth = computed(() => {
    const weeks = [];
    let currentWeek = [];
    console.log(currentYear.value, currentMonth.value);
    function pad(num: number) {
        return num < 10 ? '0' + num : num;
    }

    for (let day = 1; day <= new Date(currentYear.value, currentMonth.value + 1, 0).getDate(); day++) {
        const date = new Date(currentYear.value, currentMonth.value, day);
        const dayOfWeek = date.getDay();

        if (dayOfWeek === 0 && currentWeek.length) {
            weeks.push({ weekNumber: getWeekNumber(currentWeek[0]), dates: currentWeek });
            currentWeek = [];
        }

        currentWeek.push(date);

        if (day === new Date(currentYear.value, currentMonth.value + 1, 0).getDate()) {
            weeks.push({ weekNumber: getWeekNumber(currentWeek[0]), dates: currentWeek });
        }
    }

    const formattedWeeks = weeks.map(week => ({
        weekNumber: week.weekNumber,
        dates: week.dates.map(date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`)
    }));

    return formattedWeeks;
});


const prevMonth = () => {
    if (currentMonth.value === 0) {
        currentMonth.value = 11;
        currentYear.value -= 1;
    } else {
        currentMonth.value -= 1;
    }
};

const nextMonth = () => {
    if (currentMonth.value === 11) {
        currentMonth.value = 0;
        currentYear.value += 1;
    } else {
        currentMonth.value += 1;
    }
};

const formattedMonthYear = computed(() => {
    return moment({ year: currentYear.value, month: currentMonth.value }).format('MMMM YYYY');
});

const getDayInfo = (dateStr: string) => {
    const dateObj = new Date(dateStr);

    // Get the day's number within the month (1 for the 1st day, 2 for the 2nd day, ..., 31 for the 31st day)
    const dayNumber = dateObj.getDate();

    // Get the day's name
    const dayName = dateObj.toLocaleString('en-US', { weekday: 'long' });

    return [dayNumber, dayName];
}
const isProjectVisible = (weekDates: string[], startDate: string, endDate: string) => {
    const projectStart = moment(startDate);
    const projectEnd = moment(endDate);
    return weekDates.some(date => {
        const weekDate = moment(date);
        return weekDate.isBetween(projectStart, projectEnd, null, '[]');
    });
};

function stringToColor(name: string) {
    // Hash function to convert the string to a numeric value
    function hashCode(str: string) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    // Convert hash to a light color
    function intToLightRGB(i: number) {
        let c = (i & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();
        // Ensure the color is always 6 digits
        c = "00000".substring(0, 6 - c.length) + c;

        // Convert to RGB and lighten the color
        let r = parseInt(c.substring(0, 2), 16);
        let g = parseInt(c.substring(2, 4), 16);
        let b = parseInt(c.substring(4, 6), 16);

        // Increase the brightness by blending with white
        r = Math.floor((r + 255) / 2);
        g = Math.floor((g + 255) / 2);
        b = Math.floor((b + 255) / 2);

        return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }

    const hash = hashCode(name);
    const color = intToLightRGB(hash);
    return `#${color}`;
}

// Usage
const colorForName = stringToColor("John Doe");
console.log(colorForName);  // Example output: "#F1C40F"


const handleSelect = (event: string) => {
    if (event) {
        console.log("target.value", event);
        currentYear.value = Number(event?.split("-")[0])
        if (event?.split("-")[1][0] === "0") {
            currentMonth.value = Number(event?.split("-")[1][1]) - 1
        }

        else {
            currentMonth.value = Number(event?.split("-")[1]) - 1

        }
    }
}

const fixedColumn = ref<HTMLElement | null>(null);
    const scrollSpeed = 50; // Adjust this value to control the scrolling speed


const handleScroll = () => {
    const container = fixedColumn.value;
    if (!container) return;
    const scrollLeft = container.scrollLeft;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    
    if (scrollLeft === 0) {
        console.log('Scrolled to the left end');
        prevMonth();
    } else if (scrollLeft >= maxScrollLeft) {
        console.log('Scrolled to the right end');
        nextMonth();
    }
};

onMounted(() => {
    const container = fixedColumn.value;
    if (container) {
        container.addEventListener('scroll', handleScroll);
    }
});

onBeforeUnmount(() => {
    const container = fixedColumn.value;
    if (container) {
        container.removeEventListener('scroll', handleScroll);
    }
});

const handleWheel = (event: WheelEvent) => {
    const deltaX = event.deltaX;
    const scrollSpeed = 20; // Adjust this value to control the scrolling speed

    const container = fixedColumn.value;
    if (!container) return;

    if (deltaX > 0) {
        container.scrollLeft += scrollSpeed;
        console.log('Scrolled to the right');
        nextMonth();
    } else if (deltaX < 0) {
        container.scrollLeft -= scrollSpeed;
        console.log('Scrolled to the left');
        prevMonth();
    }
    
    // Prevent the default scrolling behavior
    event.preventDefault();
};

onMounted(() => {
    const container = fixedColumn.value;
    if (container) {
        container.addEventListener('wheel', handleWheel);
    }
});

onBeforeUnmount(() => {
    const container = fixedColumn.value;
    if (container) {
        container.removeEventListener('wheel', handleWheel);
    }
});

</script>

<style scoped>
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

.invisible-project {
    /* visibility: hidden; */
    display: none;
}

.dates {
    font-family: Work Sans;
    font-size: 13.33px;
    font-weight: 400;
    line-height: 16px;
    text-align: left;
    border-right: 1px solid #E6E8F0;
    border-top: 1px solid #E6E8F0;
    border-bottom: 1px solid #E6E8F0;
    padding: 5px;
}

.week-header {
    font-family: Work Sans;
    font-size: 13.33px;
    font-weight: 400;
    line-height: 16px;
    text-align: center;
}


th,
td {
    border: 1px solid #ccc;
    padding: 5px;
    text-align: center;
    border: none;
    border-right: 1px solid #E6E8F0;
    border-bottom: 1px solid #E6E8F0;
}

th {
    border-top: 1px solid #E6E8F0;

}

.project-name {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
