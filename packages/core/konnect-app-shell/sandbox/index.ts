import { createApp } from 'vue'
import App from './App.vue'
import KonnectAppShell from '../src'
import router from './router'
import Kongponents from '@kong/kongponents'
import '@kong/kongponents/dist/style.css'

const app = createApp(App)

app.use(Kongponents)
app.use(router)
app.use(KonnectAppShell)

app.mount('#app')
