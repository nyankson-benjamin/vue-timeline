<script setup lang="ts">
import CalendarView from './components/CalendarView.vue';
// import VueGanttastic from './components/VueGanttastic.vue';
// import CalendarViewBackup from './components/CalendarBackup.vue';
// import CalendarOne from './components/CalendarOne.vue';
// import CalendarTwo from './components/CalendarTwo.vue';
// import CalendarThree from './components/CalendarThree.vue';
import CalendarFour from './components/CalendarViewFour.vue';
import MonthSelect from './components/MonthSelect.vue';
import YearlyView from './components/YearlyView.vue';
import YearView from './components/YearView.vue';
// import TimeLineComponent from './components/TaskView/TimeLineComponent.vue';
// import EasyGanttDemo from "@/components/GANTT/EasyGanttDemo.vue";
import GenttComponent from "@/components/VUE3-GANTT/GenttComponent.vue";
import DATA from "@/assets/data.js";
import { reactive, ref, watch } from 'vue';
import { fethDaysRange, fetchThreeDays, fetchTodayMonthRange, fetchPrevMonthRange, fetchNextMonthRange, getMonthRange } from '@/components/VUE3-GANTT/utils/index.js'
import moment from 'moment';
import GantHome from './components/ANOTHER GANTT/GantHome.vue';


const dateRangeList = ref<string[]>([])
const activeDate = ref(moment((new Date())).format("YYYY-MM-DD"))
const currentMonth = ref(new Date().toLocaleString('default', { month: 'long', year: 'numeric' }))
const currentDate = ref((new Date()));

const currentRange = fetchThreeDays()
// dateRangeList.value = [currentRange[0], currentRange.at(-1)]
dateRangeList.value = [getMonthRange(currentMonth.value)?.startDate, getMonthRange(currentMonth.value)?.endDate]

watch(currentMonth,(val)=>{
  dateRangeList.value = [getMonthRange(val)?.startDate, getMonthRange(val)?.endDate]

})
const repeatConfig = reactive({
  mode: 'extract',
  backgroundColor: '#009999',
  textColor: '#CCFFFF',
  border:"2px solid red",
  name: list => {
    return list.map(item => item.name).join('+')
  },
  desc: list => {
    return list.map(item => item.desc).join('@@@')
  }
})

const scheduleTitle = item => {
  return item.name + 'function'
}

const width = ref(80)
const height = ref(60)


const data = ref(DATA.data2)

const onScheduleClick = (item) => {
  if (item.id) {
    console.log('item', item)
    alert(`${item.name}----${item.desc}`)
  }
}

const gantt = ref(null)

const exportImg = () => {
  console.log('gantt', gantt)
  gantt.value.exportImg({
    download: true,
    waterValue: 'Test watermark effect'
  })
}

const alikeName = item => {
  return '▶️' + item.name
}

const onScrollYEnd = e => {
  console.log(e)
}

const toggle = () => {
  activeDate.value = '2022-04-01'
  width.value = 100
  height.value = 60
  dateRangeList.value = ['2022-03-01', '2022-05-01']
  repeatConfig.backgroundColor = '#99CC33'
  repeatConfig.textColor = '#3399CC'
  data.value.pop()
}

const prev = () => {
  const arr = fetchPrevMonthRange(new Date(dateRangeList.value[0]))
  dateRangeList.value = [arr[0], arr.at(-1)]
}
const next = () => {
  const arr = fetchNextMonthRange(new Date(dateRangeList.value.at(-1)))
  dateRangeList.value = [arr[0], arr.at(-1)]
}
const today = () => {
  const now = new Date()
  const arr = fetchTodayMonthRange()
  activeDate.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  dateRangeList.value = [arr[0], arr.at(-1)]
}

const exportGanttExcel = () => {
  gantt.value.exportGanttExcel({ fileName: 'Test information' })
}


function goToPreviousMonth() {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() - 1);
  currentDate.value = newDate;
  updateCurrentMonth();
}
function goToNextMonth() {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() + 1);
  currentDate.value = newDate;
  updateCurrentMonth();
}
function updateCurrentMonth() {
  currentMonth.value = currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' });
};
</script>

<template>

  <!-- <CalendarView /> -->
  <CalendarFour/>
  <MonthSelect/>
  <YearlyView/> 

  <YearView/>
  <!-- <GantHome/> -->
  <!-- <CalendarThree /> -->
  <!-- <CalendarViewBackup /> -->
  <!-- <CalendarOne /> -->
  <!-- <CalendarTwo /> -->
  <!-- <TimeLineComponent/> -->

  <!-- <VueGanttastic/> -->

  <!-- <EasyGanttDemo/> -->

  <!-- <div class="calendar-nav">
    <button @click="goToPreviousMonth">Previous</button>
    <h2>{{ moment(currentMonth).format("MMMM YYYY") }}</h2>
    <button @click="goToNextMonth">Next</button>
  </div>
  {{ dateRangeList }}
  <GenttComponent ref="gantt" :data="data" itemText="Employees" dateText="Months" :activeDate="activeDate"
    :itemWidth="width" :itemHeight="height" :scheduleTitle="scheduleTitle" :dateRangeList="dateRangeList"
    :repeatMode="repeatConfig" :alikeName="alikeName" @scheduleClick="onScheduleClick" @scrollYEnd="onScrollYEnd"
    :currentMonth="currentMonth"
    />  -->
</template>

<style>
th,
td {
  border: 1px solid #ccc;
  padding: 5px;
  text-align: center;
  /* border: none; */

}

tr {
  border: 2px solid rgb(185, 185, 185);
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

<style scoped>
.content {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.head {
  margin: 20px 0;
}

.head button {
  margin: 0 10px;
  padding: 0 20px;
  height: 40px;
}

.box {
  flex: 1;
}

.link {
  height: 80px;
  line-height: 80px;
  background-color: #eee;
}
</style>
