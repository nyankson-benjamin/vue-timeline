<template>
    <div class="at-eg-task" :class="[classLength, classFloor]" :style="{width:task.duration *29 +'px'}">
        <div class="at-eg-task-inner" :style="{background:task.bgColor}" >
            {{ task.title }}
        </div>
    </div>
</template>

<script>

export default {
    props: {
        task: {
            type: Object,
            required: true
        },
        floorIndex: {
            type: Number,
            default: 0
        }
    },
    computed: {
        classLength() {
            return 'at-eg-lesfsf-' + this.task.duration
        },
        classFloor() {
            return 'at-eg-floor-' + this.floorIndex
        }
    }
}

</script>