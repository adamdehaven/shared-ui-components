<template>
  <main>
    <div>
      <h1>Core Sandbox</h1>
      <!-- <p v-if="loadingPackage">
        Loading...
      </p> -->
      <!-- We must use v-show here so that the kong-auth-login element exists in the DOM -->
      <div>
        <p>The component has loaded!</p>
        <PackageWrapper v-slot="{ packageComponent }">
          <component
            :is="packageComponent"
            msg="This is the button text"
          />
        </PackageWrapper>
        <!-- <kong-auth-login /> -->
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import PackageWrapper from './PackageWrapper.vue'
</script>
