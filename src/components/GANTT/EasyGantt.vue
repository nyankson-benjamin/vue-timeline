<template>
    <p> {{ currentMonthDates[0] }}</p>
    <p>{{ currentMonthDates?.length }}</p>
    <p>{{ currentMonthDates }}</p>
    <p> {{ firstDateInMonth }}</p>
    <p> {{ monthLength }}</p>
    <p>{{ dates }}</p>

    <div class="at-eg">
        <div class="at-eg-hd data">
            <p>qdlqmd</p>
            <table border="0" class="at-eg-tb">
                <thead>
                    <tr>
                        <th class="at-eg-cell-first">
                            <div v-show="isLoading" class="at-eg-spinner">
                                <slot name="spinner">
                                    <i :class="'at-eg-spinner-' + spinner"></i>
                                </slot>
                            </div>
                            <div v-show="!isLoading" class="at-eg-cell-first-inner">
                                <div class="calendar-nav">
                                    <button @click="goToPreviousMonth">&lt;</button>
                                    <div class="cal">
                                        <p> {{ getThreeLetters(moment(currentMonth).format("MMMM YYYY")?.split(" ")[0])
                                            }}</p>
                                            
                                        <p> {{ moment(currentMonth).format("MMMM YYYY")?.split(" ")[1] }}</p>
                                    </div>
                                    <button @click="goToNextMonth">&gt;</button>
                                </div>
                            </div>
                        </th>
                        <th v-for="date in dates">
                            <p> {{ getDayInfo(date)[1][0] }}</p>
                            <p v-if="getDayInfo(date)[0]?.length===1" > {{ getDayInfo(date)[0] }}</p>
                            <p> {{ getDayInfo(date)[0] }}</p>
                        </th>
                    </tr>
                </thead>
            </table>
        </div>
        <div class="at-eg-bd">
            <table class="at-eg-tb at-eg-tasks">
                <tbody>
                    <template v-for="(obj, idx) in egtasks">
                        <user-tasks :user="obj.user" :tasks="obj.tasks" :dates="dates"
                            :cls="idx % 2 === 0 ? 'at-eg-odd' : ''"></user-tasks>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style lang="css" src="./style.css"></style>

<script>
import UserTasks from './UserTasks.vue'
import UserTaskParser from './UserTaskParser'
import moment from "moment";

export default {
    data() {
        return {
            dates: [],
            isLoading: false,
            currentMonth: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
            currentDate: (new Date()),
            moment,
            firstDateInMonth: "",
            monthLength: 0
        }
    },
    props: {
        utasks: {
            type: Array,
            default: []
        },
        sdate: String,
        spinner: {
            type: String,
            default: 'default'
        }
    },
    computed: {
        egtasks() {
            let items = []
            this.utasks.forEach((obj, idx) => {
                let utp = new UserTaskParser(obj.tasks, this.firstDateInMonth, this.monthLength)
                let data = {}
                data.user = obj
                data.tasks = utp.items
                data.total = utp.total
                this.dates = utp.dates
                items.push(data)
            })
            return items
        },
        currentMonthDates() {
            const dates = [];
            const startDate = new Date(this.currentDate);
            startDate.setDate(1); // Set to first day of current month
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1); // Set to first day of next month

            let currentDate = new Date(startDate);
            while (currentDate < endDate) {
                dates.push(currentDate.toISOString().slice(0, 10));
                currentDate.setDate(currentDate.getDate() + 1);
            }
            this.firstDateInMonth = dates[0];
            this.monthLength = dates?.length;
            return dates;
        }
    },

    components: {
        UserTasks,
    },
    created() {
        this.isLoading = true
    },
    updated() {
        this.isLoading = false
    },
    methods: {
        goToPreviousMonth() {
            const newDate = new Date(this.currentDate);
            newDate.setMonth(newDate.getMonth() - 1);
            this.currentDate = newDate;
            this.updateCurrentMonth();
        },

        goToNextMonth() {
            const newDate = new Date(this.currentDate);
            newDate.setMonth(newDate.getMonth() + 1);
            this.currentDate = newDate;
            this.updateCurrentMonth();
        },
        updateCurrentMonth() {
            this.currentMonth = this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        },
        getDayInfo(dateStr) {
            const dateObj = new Date(dateStr);

            // Get the day's number within the month (1 for the 1st day, 2 for the 2nd day, ..., 31 for the 31st day)
            const dayNumber = dateObj.getDate();

            // Get the day's name
            const dayName = dateObj.toLocaleString('en-US', { weekday: 'long' });

            return [dayNumber, dayName];
        },

        getThreeLetters(word) {
            return word?.slice(0, 3) + " ";
        }
    }
}

</script>


<style>
/* tr {
    border: 1px solid;
} */

.calendar-nav {
    display: flex;
    justify-content: center;
    align-items: center;
}

.calendar-nav button {
    background-color: transparent;
    border: none;
    cursor: pointer;
}

.cal {
    display: flex;
    width: 100px;
    align-items: center;
    justify-content: center;
}
</style>