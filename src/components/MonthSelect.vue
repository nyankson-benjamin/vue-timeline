<template>
    <div>
        <button @click="openMonthPicker">
            <img src="../assets/DateSvg.svg" alt="">
        </button>
        <input v-model="currentDate" type="month" ref="monthInput" @input="updateMonth"
            style="visibility: hidden; width: 1px;" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, } from 'vue';
const emit = defineEmits(["select"]);
const monthInput = ref<HTMLInputElement | null>(null);
const selectedMonth = ref<string>(new Date().toISOString().substring(0, 7));
const me = "weAre";
const we = me.startsWith("we")
const props = defineProps({
    month: {
        type: Number,
    },
    year: {
        type: Number
    }
})
const openMonthPicker = () => {
    if (monthInput.value) {
        monthInput.value.showPicker();
    }
};

const updateMonth = (event: Event) => {
    const target = event.target as HTMLInputElement;
    selectedMonth.value = target.value;
    emit("select", target.value)
};

// const currentDate = ref("2025-04")

const currentDate = computed(() => {
    return `${props.year}-${props.month+1}`
})
</script>

<style scoped>
button {
    border: none;
    padding: 2px;
    cursor: pointer;
    border-radius: 10px;
}

button:hover {
    background-color: #eaeaeb;
}
</style>