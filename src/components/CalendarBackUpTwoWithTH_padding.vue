<template>
    <button>Login</button>
    <div class="calendar">
        <div class="calendar-nav">
            <button @click="goToPreviousMonth">Previous</button>
            <h2>{{ moment(currentMonth).format("MMMM YYYY") }}</h2>
            <button @click="goToNextMonth">Next</button>
        </div>
        {{ calculateCurrentMonthDates().filter(item => item !== "Sunday" && item !== "Saturday") }}
        <div class="month-selector">
            <label for="selectedMonth">Select Month:</label>
            <input type="month" id="selectedMonth" v-model="currentDate">
        </div>
        <div v-if="showModal || viewProject" class="modal">
            <div class="modalChild">


                <div class="header-and-close">
                    <p>Modal</p>
                    <p style="cursor: pointer;" @click="closeModals">X</p>
                </div>
                <div v-if="showModal">
                    <p>Employee</p>
                    <p>{{ currentEmployee.info.name }}</p>
                </div>

                <div v-else>
                    <p>Project</p>
                    <p>{{ project.name }}</p>
                </div>
            </div>
        </div>

        <div class="modal" v-if="addEmployeeToProject">
            <div class="modalChild">
                <div class="header-and-close">
                    <h3>Add employee to project</h3>
                    <p style="cursor: pointer;" @click="closeModals">X</p>
                </div>

                <div class="add-to-project">
                    <div class="items">
                        <label for="project">Select project</label>
                        <select name="" id="project" v-model="currProject">
                            <option value="">Select Project</option>

                            <option :value="proj" v-for="proj in otherProjects(currentEmployee.projects)">
                                {{ proj.name }}
                            </option>
                        </select>
                    </div>
                    <div class="items">
                        <label for="start">Start date</label>
                        <input type="date" id="start" v-model="selectedStartDate">
                    </div>

                    <div class="items">
                        <label for="end">End date</label>
                        <input type="date" id="end" v-model="selectedEndDate">
                    </div>
                </div>

                {{ currentEmployee.id }}
                <button @click="add(currentEmployee?.id)" :disabled="!currProject.id">Add</button>

                <div v-for="project in currentEmployee.projects" class="project-style"
                    :style="{ backgroundColor: project.color }">
                    <div>
                        <span>Name: {{ project.name }}</span>
                        <span>Start date: {{ project.startDate }}</span>
                        <span>End date: {{ project.endDate }}</span>
                    </div>
                </div>
            </div>
        </div>
        <table class="timeline">

            <thead>
                <tr>
                    <th colspan="100" scope="">
                        <h2>{{ moment(currentMonth).format("MMMM YYYY") }}</h2>
                    </th>
                </tr>
                <tr>
                    <th scope="">Employee</th>
                    <th class="head" scope="row" :class="{ 'today': moment(new Date()).format('YYYY-MM-DD') === date }"
                        v-for="date in currentMonthDates" :key="date">
                        <p>{{ getThreeLetters(getDayInfo(date)[1]) }}</p>
                        <div>{{ getDayInfo(date)[0] }}</div>

                        <p style="white-space: nowrap;">{{ date }}</p>

                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(employee, index) in employees" :key="index">
                    <td class="employee-name">
                        <div style="cursor: pointer;" @click="getEmployee(employee, index)">
                            <p>{{ employee.info.name }}</p>
                            <p>{{ employee.info.employee_info.client_ready ? 'Client ready' : 'Not client ready' }}</p>
                        </div>
                    </td>
                    <td v-for="date in currentMonthDates" :key="date" colspan="" @click="addToProject(date, employee)"
                        :class="getDayInfo(date)[1][0] !== 'S' ? 'show-pointer' : ''">
                        <div class="projects">
                            <div v-for="(project, index) in employee.projects" :key="project.name"
                                :style="getProjectStyle(project, date, showProject(project, date))"
                                @click="getProjectInfo(project, date, employee)" :title="project.name">
                                <span v-if="getDayInfo(date)[1][0] !== 'S' && showProject(project, date)">
                                    {{
                                        project.name }}
                                </span>
                            </div>
                        </div>

                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
export default {
    data() {
        return {
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
            ],
            projects: [
                { name: "Project A", id: 1, managedBy: "Benjamin", startDate: "2024-05-01", endDate: "2024-06-07", color: "red" },
                { name: "Project B", id: 2, managedBy: "Miles", startDate: "2024-03-01", endDate: "2024-04-15", color: "blue" },
                { name: "Project C", id: 3, managedBy: "Nyankson", startDate: "2024-02-01", endDate: "2024-03-15", color: "green" },
                { name: "Project D", id: 4, managedBy: "Kwesi", startDate: "2025-02-05", endDate: "2026-03-15", color: "lime" },
                { name: "Project E", id: 5, managedBy: "Amalitech", startDate: "2024-05-07", endDate: "2024-05-15", color: "orange" },
                { name: "Project F", id: 6, managedBy: "Client", startDate: "2024-05-02", endDate: "2024-05-15", color: "blue" }
            ],
            currentMonth: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
            currentDate: (new Date()),
            selectedDate: this.formatDate(new Date()),
            showModal: false,
            viewProject: false,
            currentEmployee: {},
            project: {},
            selectedStartDate: "",
            selectedEndDate: "",
            addEmployeeToProject: false,
            currProject: {},
            moment
        };


    },
    computed: {
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

            return dates;
        }
    },
    // mounted() {

    //     const getData = async (url, variable) => {
    //         try {
    //             const data = await axios.get(url)
    //             // console.log(data.data);
    //             switch (variable) {
    //                 case "employees":
    //                     this.employees = data.data;
    //                     break

    //                 case "projects":
    //                     this.projects = data.data;
    //                     break
    //                 default:
    //                     console.log(data.data);
    //                     break
    //             }
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }

    //     getData("http://localhost:8000/employees", "employees");
    //     getData(" http://localhost:8000/projects", "projects");
    //     getData(" http://localhost:8000/employees/1", "");
    // },

    methods: {

        getThreeLetters(letter) {
            return letter?.slice(0, 3)
        },
        getProjectStyle(project, date, status) {

            const projectStart = (new Date(project.startDate)).getTime();
            const projectEnd = (new Date(project.endDate)).getTime();
            const currentDate = new Date(date);
            if ((currentDate).getTime() >= projectStart && (currentDate).getTime() <= projectEnd && this.getDayInfo(date)[1][0] !== 'S') {
                return {
                    backgroundColor: status ? project.color : "",
                    color: "#fff",
                    borderRadius: "4px",
                    padding: "5px",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    margin: "2px",
                    width: "100%",
                    cursor: "pointer",
                    height: "50px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                };
            } else {
                return {
                    height: "50px",
                    color: "#fff",
                    borderRadius: "4px",
                    padding: "5px",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    margin: "2px",
                    width: "100%",
                    cursor: "pointer",
                    visibility: "hidden"
                };
            }
        },

        showProject(project, date) {
            const projectStart = new Date(project.startDate);
            const projectEnd = new Date(project.endDate);
            const currentDate = new Date(date);
            if ((currentDate).getTime() >= projectStart && (currentDate).getTime() <= projectEnd) {
                return true;
            } else {
                return false;
            }
        },

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
        getDatesBetween(startDateStr, endDateStr) {
            const dates = [];
            let currentDate = moment(startDateStr);
            const endDate = moment(endDateStr);

            while (currentDate <= endDate) {
                dates.push(currentDate.format('dddd MMMM Do YYYY'));
                currentDate.add(1, 'days');
            }
            return dates;
        },
        getDayInfo(dateStr) {
            const dateObj = new Date(dateStr);

            // Get the day's number within the month (1 for the 1st day, 2 for the 2nd day, ..., 31 for the 31st day)
            const dayNumber = dateObj.getDate();

            // Get the day's name
            const dayName = dateObj.toLocaleString('en-US', { weekday: 'long' });

            return [dayNumber, dayName];
        },

        calculateCurrentMonthDates() {
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
            return [...dates?.flatMap(date => this.getDayInfo(date)[1])];
        },
        formatDate(date) {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Pad month with leading zero if necessary
            return `${year}-${month}`;
        },

        getEmployee(employee, idx) {
            this.currentEmployee = employee
            this.showModal = true
            this.viewProject = false
        },
        getProjectInfo(currentProject, date) {
            const projectInfo = this.projects.find(project => project.id === currentProject.id)
            // console.log(date);
            const start = moment(date).format("dddd MMMM Do YYYY")
            if (projectInfo) {
                console.log(start);
                console.log(this.getDatesBetween(projectInfo.startDate, projectInfo.endDate));
                this.project = projectInfo
                this.viewProject = true
                this.showModal = false;
            }
            // setTimeout(() => {
            //     this.addEmployeeToProject = false;

            // }, 0);
        },
        closeModals() {
            this.showModal = false;
            this.viewProject = false
            this.currentEmployee = {};
            this.addEmployeeToProject = false
        },
        addToProject(date, employee) {
            this.currProject = {};
            if (!moment(date).format("dddd MMMM Do YYYY")?.includes("Sun") && !moment(date).format("dddd MMMM Do YYYY")?.includes("Sat")) {
                setTimeout(() => {
                    this.selectedStartDate = date;
                    this.selectedEndDate = moment(date).add(3, "months").format("YYYY-MM-DD")
                    this.currentEmployee = employee
                    // console.log(date);
                    // console.log(moment(date).format("dddd MMMM Do YYYY"));
                    if (!this.viewProject) {
                        this.addEmployeeToProject = true

                    }
                }, 100)
            }

        },

        otherProjects(projects) {
            // console.log(projects);
            let allProjects = this.projects
            projects.forEach(project => {
                allProjects = allProjects?.filter(pro => pro.id !== project.id)
            });

            return allProjects;
        },

        async add(id) {
            try {
                const res = await axios.get("http://localhost:8000/employees/" + id)
                console.log(res.data);
            } catch (error) {

            }
        }
    },

};
</script>

<style scoped>
.calendar {
    overflow-x: auto;
}

.timeline {
    border-collapse: collapse;
    width: 200px;
    /* border: none; */
    overflow-x: scroll;
}

th,
td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: center;
    /* border: none; */
}

tr {
    border: 1px solid rgb(240, 239, 239);
}

table td:nth-child(1),
th:nth-child(1) {
    background-color: #fff;
    border-right: 1px solid rgb(240, 239, 239);
}

.employee-name {
    font-weight: bold;
}

.projects {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.project {
    margin-bottom: 5px;
}

table {
    /* height: 85vh; */
    overflow: scroll;
    width: 200px;
}

th {
    min-width: 50px;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(24, 24, 23, 0.8);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    /* opacity: 0.9; */
}

.modalChild {
    width: 400px;
    /* height: 300px; */
    border: 1px solid;
    padding: 10px;
    border-radius: 10px;
    margin: 20px auto;
    background-color: white;
}

.items {
    display: flex;
    align-items: center;
    gap: 10px;
}

.add-to-project {
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
}

.header-and-close {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    padding: 5px;
}

.show-pointer {
    cursor: pointer;
}

.calendar-nav {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.project-style {
    width: 100%;
    background-color: #e4e1e1;
    padding: 2px;
    margin: 2px;
    border-radius: 5px;
}

.project-style div {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.head {
    padding: 0 100px;
}

.today{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.today div:nth-child(2) {
    background-color: #e4e1e1;
    height: 50px;
    width: 50px;
    text-align: center;
    border-radius: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>