<template>
  <div class="sandbox-container">
    <main>
      <p>This is the Global Search that is always refreshing the page when search resuslt is selected</p>
      <KonnectGlobalSearch
        active-geo-code="us"
        search-api-url="/kong-api/us/konnect-api"
      />

      <br>
      <hr>
      <br>

      <p>This is the Global Search that fires 'selected' event and lets application do deal with refresh versus router.push</p>
      <KonnectGlobalSearch
        active-geo-code="us"
        search-api-url="/kong-api/us/konnect-api"
        :should-navigate="false"
        @selected="resultSelected"
      />
      <br>
      <KCodeBlock
        v-if="selResult"
        id="search-result"
        :code="selResult"
        is-single-line
        language="json"
        :show-copy-button="false"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { KonnectGlobalSearch } from '../src'
import type { SelectedSearchItem } from '../src/types'

const selResult = ref('')
const resultSelected = (res: SelectedSearchItem) => {
  selResult.value = JSON.stringify(res)
}
</script>

<style lang="scss" scoped>

.sandbox-container {
  color: white;
  padding: 20px;
  background: linear-gradient(180deg, #001740 0%, #073382 100%);
}
</style>

<style lang="scss">
body, html, #app, .sandbox-container {
  height: 100%;
}
</style>
