import { Ref } from 'vue'
export interface AppConfig {
  config: Ref<any>
  loading: Ref<boolean>
  error: Ref<boolean>
}
