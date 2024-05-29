<template>
    <div class="task" :class="{ 'in-progress': task.status === 'In Progress', 'blocked': task.status === 'Blocked', 'complete': task.status === 'Complete' }" :style="taskStyle">
      {{ task.name }}
    </div>
  </template>
  
  <script>
  export default {
    props: {
      task: Object,
      months: Array
    },
    computed: {
      taskStyle() {
        const startMonthIndex = this.task.start.getMonth() - this.months[0].getMonth();
        const endMonthIndex = this.task.end.getMonth() - this.months[0].getMonth();
        const width = ((endMonthIndex - startMonthIndex + 1) * 100) / this.months.length;
        const left = (startMonthIndex * 100) / this.months.length;
        return {
          left: `${left}%`,
          width: `${width}%`
        };
      }
    }
  }
  </script>
  
  <style>
  .task {
    position: absolute;
    height: 20px;
    margin: 5px;
    padding: 10px;
    white-space: nowrap;
  }
  </style>
  