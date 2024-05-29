<template>
    <div class="gantt" ref="gantt">
      <div class="guide">
        <div class="desc">
          <span class="date">{{ props.dateText }}</span>
          <span class="item">{{ props.itemText }}</span>
        </div>
        <div class="item-name-list">
          <div
            v-for="(item, index) in data"
            :key="index"
            :class="{
              'guide-name': true,
              'last-guide-name': index === data.length - 1
            }"
            
          >
            {{ item.name}}
          </div>
        </div>
      </div>
      <div class="inner" @scroll="onScrollX($event)" ref="innerRef">
        <div class="date-list first-date-list">
          <div
            v-for="monthItem in rangeDate"
            :key="monthItem.year + '-' + monthItem.month"
            class="month-item"
          >
            <div class="month">{{ currentMonth }}</div>
            <div class="day-box">
              <div
                v-for="(dayItem, dayIndex) in monthItem"
                :key="dayItem.day + dayItem.week"
                :class="{
                  'day-item': true,
                  'first-day-item': dayIndex === 0,
                  'date-active': props.activeDate === (dayItem.year + '-' + dayItem.month + '-' + dayItem.day)
                }"
              >
                <div class="day">{{ dayItem.day }}</div>
                <div class="week">{{ dayItem.week?.slice(0,3) }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="schedule-box">
          <div
            v-for="(item, index) in data"
            :key="index"
            :class="{
              'date-box': true,
            }"
          >
            <div
              v-for="(dateItem, dateIndex) in renderWorks(item)"
              :key="dateIndex"
              :class="{
                'date-item': true,
                'date-item-work': dateItem.type === 'works',
                'date-active': dateItem.date === props.activeDate
              }"
              :style="computedStyle(item, dateItem)"
              :title="dateItem.desc"
              @mousemove="event => dateItemMove(dateItem.type, event)"
              @mouseout="event => dateItemMoveOut(dateItem.type, event)"
              @click="event => scheduleClick({ ...dateItem, event })"
            >
              <!-- <span v-if="dateItem.type === 'works'" class="work-desc">{{ props.scheduleTitle ? props.scheduleTitle(dateItem) : dateItem.name }}</span> -->
              <span v-if="dateItem.type === 'works'" class="work-desc">{{ dateItem.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import cloneDeep from 'lodash/cloneDeep'
  import { watchEffect, ref, onMounted, nextTick } from 'vue'
  import {
    computedDaysRange,
    fethDaysRange,
    splitDaysForMonth,
    todayInRange,
    fetchToday,
    workListSplitForRepeat
  } from '../VUE3-GANTT/utils/index.js'
  import html2canvas from 'html2canvas'
  import { exportExcel } from './excel.js'
  import moment from 'moment'
  
  const props = defineProps({
    data: {
      type: Array,
      required: true,
      default: []
    },
    dateRangeList: {
      type: Array,
      required: true,
      default: [],
      validator(value) {
        return value[0] && value.at(-1)
      }
    },
    dateText: {
      type: String,
      required: true
    },
    itemText: {
      type: String,
      required: true
    },
    activeDate: {
      type: String,
      default: () => fetchToday()
    },
    repeatMode: {
      // extract Extract the overlapping parts and generate independent schedules separately
      // cover The overlapping parts are sorted and covered according to the journey date.
      type: Object,
      default: () => ({ mode: 'cover', backgroundColor: '#FFFFCC', textColor: '#336666', name: 'repeated', desc: 'description' })
    },
    // The width of each schedule grid
    itemWidth: {
      type: Number,
      default: 40,
      validator(value) {
        return value >= 40
      }
    },
    itemHeight: {
      type: Number,
      default: 40,
      validator(value) {
        return value >= 40
      }
    },
    scheduleTitle: {
      type: Function,
      default: null
    },
    borderColor: {
      type: String,
      default: '#eee'
    },
    alikeName: {
      type: Function,
      default: null
    },
    currentMonth:{
      type:String
    }
  })
  
  const emit = defineEmits(['scheduleClick', 'scrollXEnd', 'scrollYEnd'])
  
  let rangeDate = ref([])
  const ganttMaxWidth = ref('2000px')
  const ganttInnerHeight = ref('0px')
  // Gantt chart dom
  const gantt = ref()
  
  let computeTimer = null
  // Calculate the height of the current chart content area
  const computedGanttInnerHeight = () => {
    clearTimeout(computeTimer)
    computeTimer = setTimeout(() => {
      if (!gantt.value) return
      ganttInnerHeight.value = 0
      nextTick(() => {
        const parent = gantt.value.parentElement || document.body
        const ganttHead = gantt.value.querySelector(`.desc`)
        const headRect = ganttHead.getBoundingClientRect()
        const parentRect = parent.getBoundingClientRect()
        // ganttInnerHeight.value = parent.clientHeight - ganttHead.clientHeight - (ganttHead.offsetTop - parent.offsetTop) - 2 + 'px'
        // gannt The rest of the content at the top is high
        const topHeight = headRect.top - parentRect.top+6
        ganttInnerHeight.value = parentRect.height - headRect.height - topHeight + 'px'
      })
    }, 200)
  }
  
  onMounted(() => {
    const itemBox = gantt.value.querySelector('.item-name-list')
    const innerBox = gantt.value.querySelector('.schedule-box')
    itemBox.addEventListener('scroll', contentScroll)
    innerBox.addEventListener('scroll', contentScroll)
    window.addEventListener('resize', computedGanttInnerHeight)
    computedGanttInnerHeight()
  })
  
  watchEffect(() => {
    rangeDate.value = splitDaysForMonth(computedDaysRange(props.dateRangeList[0], props.dateRangeList.at(-1)))
    console.log('rangeDate.value', rangeDate.value)
    ganttMaxWidth.value = props.itemWidth * (rangeDate.value.flat(1).length) + 122 + 'px'
  })
  
  const checkValidator = () => {
    const keys = ['type', 'name', 'schedule']
    const scheduleKeys = ['id', 'name', 'desc', 'backgroundColor', 'textColor', 'days']
    props.data.forEach(item => {
      if (item.type === 'normal') {
        const arr = Object.keys(item)
        const res = keys.find(v => !arr.includes(v))
        if (res) {
          throw new Error(`Item missing${res}item`)
        }
        item.schedule.forEach(v => {
          if (!v.list) {
            const arrs = Object.keys(v)
            const ress = scheduleKeys.find(val => !arrs.includes(val))
            if (ress) {
              throw new Error(`Schedule is missing${ress}item`)
            }
          }
        })
      }
    })
  }
  
  const data = ref([])
  
  const splitSchedule = data => {
    return data.map(item => {
      if (item.type === 'normal' && Array.isArray(item.schedule) && item.schedule.length) {
        item.schedule = item.schedule.filter(v => {
          const check = rangeDate.value[0][0]
          const checkTime = `${check.year}-${check.month}-${check.day}`
          return new Date(v.days.at(-1)).getTime() >= new Date(checkTime).getTime()
        })
      }
      return item
    })
  }
  
  const sortFilterData = () => {
    checkValidator()
    data.value = cloneDeep(props.data).map(item => {
      if (item.type === 'normal' && Array.isArray(item.schedule)) {
        item.schedule = item.schedule.sort((a, b) => new Date(a.days[0]).getTime() - new Date(b.days[0]).getTime())
        item.schedule = item.schedule.map(schedule => {
          if (schedule.days.length === 2) {
            schedule.days = fethDaysRange(...schedule.days)
          }
          return schedule
        })
        return item
      }
      return item
    })
    data.value = splitSchedule(data.value)
  }
  
  // Calculate the current box style
  const computedStyle = (parent, item) => {
    let res = {}
    if (parent.type === 'alike') {
      // All unified style
      res = {
        ...res,
        backgroundColor: parent.color
      }
    }
    if (item && item.type === 'works') {
      res = {
        ...res,
        backgroundColor: item.backgroundColor,
        color: item.textColor,
        width: item.width + 'px',
        marginLeft: -item.left + 'px'
      }
    }
    return res
  }
  
  // Calculate the width of the current schedule range that should be rendered in the specified date range (Assume that the schedule ranges are all legal)
  const computeWordWidth = (schedule, days) => {
    const hasFirst = todayInRange(schedule[0], [days[0].date, days[days.length - 1].date])
    const hasLast = todayInRange(schedule[schedule.length - 1], [days[0].date, days[days.length - 1].date])
    if (hasFirst && hasLast) return schedule.length * props.itemWidth
    if (!hasFirst && hasLast) {
      // No head and no tail
      return fethDaysRange(days[0].date, schedule[schedule.length - 1]).length * props.itemWidth
    } else if (hasFirst && !hasLast) {
      // Beginning without tail
      return fethDaysRange(schedule[0], days[days.length - 1].date).length * props.itemWidth
    } else if (!hasFirst && !hasLast) {
      // No head or tail. The current schedule directly covers the current display schedule range.
      return fethDaysRange(days[0].date, days.at(-1).date).length * props.itemWidth
    }
    throw new Error('computeWordwidth 宽度计算异常！')
  }
  // Checks whether the current date is on the schedule for the specified project
  const _checkTodayIsWork = (today, schedule) => {
    return schedule.days.includes(today)
  }
  // Check if the current date is on the final results list
  const _checkTodayInResult = (today, result) => {
    return !!result.find(item => item.date === today)
  }
  // Check if the current schedule has been added to the final results list
  const _checkWorkInResult = (work, result) => {
    return !!result.find(item => item.id === work.id)
  }
  // Checks whether the current date is in the specified schedule list
  const _checkTodayInWorkList = (today, workList) => {
    return !!workList.find(item => item.days.includes(today))
  }
  // Check if the current date is in the schedule list that has been added to the final result
  const _checkTodayInAllWorkList = (today, result) => {
    const res = result.filter(item => item.type === 'works')
    return !!_checkTodayInWorkList(today, res)
  }
  // Process the two-dimensional array of date range into a one-dimensional array suitable for schedule rendering
  const _flatDateRange = (dateRange) => {
    return dateRange.flat(1).map(item => {
      return {
        type: 'normal',
        date: String(item.year).padStart(4, '0') + '-' + String(item.month).padStart(2, '0') + '-' + String(item.day).padStart(2, '0')
      }
    })
  }
  // Check the overlapping range of two schedules
  const _checkWorkRepeatRange = (workA, workB) => {
    return workA.days.filter(item => workB.days.includes(item))
  }
  // Find the schedule information for the specified date from the final results
  const _findTodayForWork = (today, res) => {
    return res.find(item => item.type === 'works' && item.days.includes(today))
  }
  // Update existing schedule
  const _updateScheduleItem = (scheduleItem, result) => {
    // Check whether there is any overlap in the current schedule to be updated
    const inWorkInfo = _findTodayForWork(scheduleItem.days[0], result)
    if (inWorkInfo && scheduleItem.id !== inWorkInfo.id) {
      // Get overlapping range
      const repeatList = _checkWorkRepeatRange(inWorkInfo, scheduleItem)
      const start = scheduleItem.days.slice(repeatList.length)[0]
      const index = result.findIndex(item => item.date === start)
      result[index] = {
        type: 'works',
        date: scheduleItem.days[0],
        width: computeWordWidth(scheduleItem.days, result),
        left: repeatList.length * props.itemWidth,
        ...scheduleItem
      }
    } else {
      // Normal update (start to end)
      const index = result.findIndex(item => item.date === scheduleItem.days[0])
      result[index] = {
        type: 'works',
        date: scheduleItem.days[0],
        width: computeWordWidth(scheduleItem.days, result),
        left: 0,
        ...scheduleItem
      }
    }
    // To add a new schedule, you need to delete and update the schedule list simultaneously, and delete some of the schedules that were originally empty.
    result = result.filter(item => {
      return !(item.type === 'normal' && scheduleItem.days.includes(item.date));
    })
    return result
  }
  
  const renderWorks = (game) => {
    const dateRange = _flatDateRange(rangeDate.value)
    if (!game.schedule || !game.schedule.length) return dateRange
    let res = []
    game.schedule.forEach(scheduleItem => {
      dateRange.forEach(dayItem => {
        const isWork = _checkTodayIsWork(dayItem.date, scheduleItem)
        const todayInResult = _checkTodayInResult(dayItem.date, res)
        const todayInAllWorkList = _checkTodayInAllWorkList(dayItem.date, res)
        // 
        if (isWork) {
          if (!todayInResult && !todayInAllWorkList) {
              res.push({
                type: 'works',
                date: dayItem.date,
                width: computeWordWidth(scheduleItem.days, dateRange),
                left: 0,
                ...scheduleItem
              })
          } else if (!todayInResult && todayInAllWorkList) {
            const inWorkInfo = _findTodayForWork(dayItem.date, res)
            if (scheduleItem.id !== inWorkInfo.id) {
              // Get overlapping range
              const repeatList = _checkWorkRepeatRange(inWorkInfo, scheduleItem)
              res = _updateScheduleItem(scheduleItem, res)
            } else {
              // The schedule information is consistent with the current cycle schedule information
              // No processing required
            }
          } else if (todayInResult && !todayInAllWorkList) {
            // The current date has been added && the current schedule is not within the added schedule range (new schedule)
            // Get the location of the added date and update the current date schedule
            console.warn('The current date has been added && the current schedule is not within the added schedule range (new schedule)')
            res = _updateScheduleItem(scheduleItem, res)
          } else {
            // The current date has been added && the current date is within the added schedule range
            // No processing required
            // console.log('The current date has been added && the current date is within the added schedule range')
          }
        } else {
          // not schedule
          // The current date has not been added and is not in the added schedule range
          if (!todayInResult && !todayInAllWorkList) {
            res.push(dayItem)
          } else if (!todayInResult && todayInAllWorkList) {
            // The current date is not added && The current date is within the added schedule range
            // console.log('The current date is not added && The current date is within the added schedule range')
          } else {
            // The current date has been added
            // console.log('The current date has been added', dayItem)
          }
        }
      })
    })
    return res
  }
  
  const dateItemMove = (type, event) => {
    if (type !== 'works') return
    if (event.target.tagName === 'SPAN') {
      event.target.parentElement.style.zIndex = 2
      event.target.parentElement.style.boxShadow = '0 0 5px 0px rgba(0, 0, 0, 0.2)'
    } else {
      event.target.style.zIndex = 2
      event.target.style.boxShadow = '0 0 5px 0px rgba(0, 0, 0, 0.2)'
    }
  }
  const dateItemMoveOut = (type, event) => {
    if (type !== 'works') return
    if (event.target.tagName === 'SPAN') {
      event.target.parentElement.style.zIndex = 1
      event.target.parentElement.style.boxShadow = 'none'
    } else {
      event.target.style.zIndex = 1
      event.target.style.boxShadow = 'none'
    }
  }
  
  let timer = null
  
  const innerRef = ref(null)
  
  const contentScroll = event => {
    const target = event ? event.target : innerRef.value
    if (!target) return
    const targetClassName = target.className
    let flag = 'item-name-list'
    if (targetClassName === 'item-name-list') {
      flag = 'schedule-box'
    }
    const flagBox = gantt.value.querySelector(`.${flag}`)
    if (flagBox) {
      flagBox.scrollTop = target.scrollTop
    }
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      const height = Math.ceil(Math.max(target.clientHeight, target.scrollHeight))
      if ((target.scrollTop + target.clientHeight) >= height) {
        emit('scrollYEnd', event)
      }
    }, 200)
  }
  
  watchEffect(() => {
    sortFilterData()
    if (props.repeatMode.mode === 'extract') {
      data.value = workListSplitForRepeat(data.value, props.repeatMode)
      data.value = splitSchedule(data.value)
    }
    // console.log('Latest data', data.value)
    nextTick(() => {
      contentScroll()
    })
  })
  
  
  const scheduleClick = item => {
    emit('scheduleClick', item)
  }
  
  const onScrollX = event => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      const target = event.target
      const width = Math.ceil(Math.max(target.clientWidth, target.scrollWidth))
      if ((target.scrollLeft + target.clientWidth) >= width) {
        emit('scrollXEnd', event)
      }
    }, 200)
  }
  
  const waterMark = txt => {
    let length = txt.length * 20 // Generate canvas size based on content, 20 represents the ratio
    let canvas = document.createElement('canvas')
    canvas.width = canvas.height = length
    let context = canvas.getContext('2d')
    context.font = '14px "PingFangSC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif'
    context.fillStyle = 'rgba(0,0,0,0.5)'
    context.rotate(-25 * Math.PI / 180) // The rotation angle of the text inside the canvas
    context.fillText(txt, length / 20, length / 2) // text position
    const waterImg = canvas.toDataURL('image/png')
    canvas = context = null
    return waterImg
  }
  
  const exportImg = async (config = {}) => {
    if (typeof config === 'boolean' || typeof config !== 'object') {
      throw new Error('The exportImg parameter passing method has been changed. Please set the export configuration through Object method.')
    }
    let { download = true, waterType = 'txt', waterValue = '' } = config
    return new Promise((resolve) => {
      const guide = document.querySelector('.guide')
      ganttInnerHeight.value = 'unset'
      gantt.value.style.maxWidth = 'unset'
      innerRef.value.scrollLeft = innerRef.value.scrollWidth
      gantt.value.style.width = innerRef.value.scrollWidth + guide.clientWidth + 'px'
      nextTick(() => {
        waterValue = waterValue.trim()
        let mark = null
        if (waterValue) {
          const waterImg = waterMark(waterValue)
          mark = document.createElement('div')
          mark.style.position = 'absolute'
          mark.style.zIndex = '9999'
          mark.style.opacity = '0.1'
          mark.style.top = mark.style.left = '0'
          mark.style.width = mark.style.height = '100%'
          mark.style.backgroundImage = `url(${waterImg})`
          gantt.value.appendChild(mark)
        }
        html2canvas(gantt.value, {
          removeContainer: true,
        }).then(function(canvas) {
          const href = canvas.toDataURL()
          if (mark) {
            mark.parentNode.removeChild(mark)
          }
          gantt.value.style.maxWidth = ganttMaxWidth.value
          computedGanttInnerHeight()
          gantt.value.style.width = '100%'
          if (download) {
            const a = document.createElement('a')
            a.href = href
            a.setAttribute('download', 'schedule chart')
            a.click()
          }
          resolve(href)
        })
      })
    })
  }
  
  const exportGanttExcel = (file) => {
    const excelData = cloneDeep(data.value).map(item => {
      item.renderWorks = renderWorks(item)
      if (item.type === 'alike' && props.alikeName) {
        item.name = props.alikeName(item)
      }
      if (item.type === 'normal' && props.scheduleTitle) {
        item.renderWorks.forEach(renderItem => {
          renderItem.name = props.scheduleTitle(renderItem)
        })
      }
      return item
    })
    exportExcel(file, rangeDate.value, excelData, props.dateText, props.itemText)
  }
  
  defineExpose({
    exportImg,
    exportGanttExcel
  })
  
  </script>
  
  
  <style lang="css" scoped>
  .gantt {
    --borderWidth: 1px;
    --borderColor: v-bind(props.borderColor);
    --border: 1px solid var(--borderColor);
    --fontSize: 14px;
    --fontColor: #333;
    --itemWidth: v-bind(props.itemWidth + 'px');
    --itemHeight: v-bind(props.itemHeight + 'px');
  }
  * {
    box-sizing: border-box;
  }
  .gantt {
    width: 100%;
    max-width: v-bind(ganttMaxWidth);
    margin: 0 auto;
    height: 100vh;
    user-select: none;
    box-sizing: border-box;
    border: var(--border);
    font-size: var(--fontSize);
    color: var(--fontColor);
    display: flex;
    position: relative;
    *::-webkit-scrollbar {
      /*Overall style of scroll bar*/
      width : 5px;  /*The height and width correspond to the size of the horizontal and vertical scroll bars respectively.*/
      height: 5px;
    }
    *::-webkit-scrollbar-thumb {
      /*The small square inside the scroll bar*/
      border-radius: 2px;
      box-shadow: inset 0 0 2px rgba(10, 10, 10, 0.2);
      background:  #818181;
    }
    *::-webkit-scrollbar-track {
      /*track inside scroll bar*/
      box-shadow: inset 0 0 2px rgba(10, 10, 10, 0.2);
      border-radius: 2px;
      background: #ededed;
    }
    .guide {
      flex-shrink: 0;
      /* width: 120px; */
      height: 100vh;
      border-right: var(--border);
      .desc {
        width: 120px;
        height: 120px;
        border-bottom: var(--border);
        position: relative;
        &::after {
          content: '';
          position: absolute;
          height: 1px;
          width: 169.7056274847714px;
          background-color: var(--borderColor);
          top: 0;
          left: 0;
          transform: rotate(45deg);
          transform-origin: 0 0;
        }
        .date {
          position: absolute;
          top: 20px;
          right: 20px;
        }
        .item {
          position: absolute;
          left: 5px;
          bottom: 20px;
        }
      }
      .item-name-list {
        width: 100%;
        max-height: 100%;
        overflow-y: auto;
      }
      .guide-name {
        width: 100%;
        min-height: var(--itemHeight);
        border-bottom: var(--border);
        padding: 2px 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        &.last-guide-name {
          border-bottom: none;
        }
      }
    }
    .inner {
      width: 100%;
      overflow-x: auto;
      overflow-x: overlay;
      position: relative;
      height: 100vh;
      &::-webkit-scrollbar {
        /*Scroll bar scroll bar overall style inside track*/
        width : 5px;  /*The height and width correspond to the size of the horizontal and vertical scroll bars respectively.*/
        height: 5px;
      }
      .date-list {
        width: 100%;
        height: 120px;
        display: flex;
        .month-item {
          width: auto;
          height: 100%;
          border-bottom: var(--border);
          display: flex;
          flex-direction: column;
          .month {
            flex: 1;
            border-left: var(--border);
            border-bottom: var(--border);
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .day-box {
            flex: 2;
            display: flex;
            .day-item {
              width: var(--itemWidth);
              .day {
                width: var(--itemWidth);
                height: 50%;
                border-left: var(--border);
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .week {
                width: var(--itemWidth);
                height: 50%;
                border-left: var(--border);
                /* border-top: var(--border); */
                display: flex;
                align-items: center;
                justify-content: center;
              }
            }
          }
          &:first-child {
            .month {
              border-left: none;
            }
            .day-box {
              .first-day-item {
                .day {
                  border-left: none;
                }
                .week {
                  border-left: none;
                }
                border-left: none;
              }
            }
          }
        }
        &.first-date-list{
          border-left: none;
        }
      }
      .schedule-box {
        height: v-bind(ganttInnerHeight);
        overflow-y: hidden;
        position: absolute;
        /* left: 0;
        bottom: 0; */
      }
      .schedule-box::-webkit-scrollbar {
        /*Overall style of scroll bar*/
        width : 0;  /*The height and width correspond to the size of the horizontal and vertical scroll bars respectively.*/
        height: 0;
      }
      .date-box {
        height: var(--itemHeight);
        display: flex;
        .date-item {
          flex-shrink: 0;
          width: var(--itemWidth);
          height: var(--itemHeight);
          border-left: var(--border);
          border-bottom: var(--border);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .work-desc {
            width: 100%;
            height: 100%;
            line-height: calc(var(--itemHeight) / 2);
            text-align: center;
            font-size: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
          &.date-item-work {
            cursor: pointer;
            position: relative;
            z-index: 1;
          }
          &:first-child {
            border-left: none;
          }
        }
        
        
      }
      .date-active {
        background-color: #caf2ff;
      }
    }
  }
  </style>
  