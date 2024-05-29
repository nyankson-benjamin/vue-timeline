<template>
    <div class="demo">
        <easy-gantt :sdate="sdate" :utasks="utasks" ref="easyGantt"></easy-gantt>
    </div>
</template>

<script>
import moment from 'moment'
import EasyGantt from '@/components/GANTT/EasyGantt.vue'
import demoData from '@/assets/data.json'
import axios from 'axios'

export default {
    data() {
        return {
            sdate: null,
            utasks: []
        }
    },
    name: 'demo',
    components: {
        EasyGantt
    },
    mounted() {
        axios.get('http://localhost:8000/data').then(res => {
            // set data on vm
            console.log(res.data.items);
            this.utasks = res.data.items
            this.sdate = res.data.sdate

        }, res => {
            //error
            this.utasks = demoData.items
            this.sdate = demoData.sdate
        })
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.demo {
    margin-bottom: 50px;
    margin-left: auto;
    margin-right: auto;
    max-width: 1440px;
    padding: 2em 1em;
    overflow: auto;
}
</style>