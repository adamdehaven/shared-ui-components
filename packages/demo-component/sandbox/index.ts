import { createApp } from 'vue'
import App from './App.vue'

import TestButton from '@/index'

const app = createApp(App)

app.use(TestButton)

app.mount('#app')
