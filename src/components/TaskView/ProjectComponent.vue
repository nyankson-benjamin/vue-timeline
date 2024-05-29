<template>
    <div class="project">
      <div class="project-owner">{{ project.owner }}</div>
      <TaskComponent v-for="task in project.tasks" :key="task.id" :task="task" :months="months" />
    </div>
  </template>
  
  <script>
  import TaskComponent from './TaskComponent.vue';
  
  export default {
    props: {
      project: Object,
      months: Array
    },
    components: {
      TaskComponent
    }
  }
  </script>
  