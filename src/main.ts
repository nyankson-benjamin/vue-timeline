
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import ganttastic from '@infectoone/vue-ganttastic'

const app = createApp(App)

app.use(createPinia())
app.use(ganttastic);
app.mount('#app')
