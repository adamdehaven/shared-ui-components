<template>
  <div class="sandbox-container">
    <main>
      <p>This is the component sandbox.</p>
      <{%%COMPONENT_NAME%%} />
    </main>
    <DynamicSidebar />
  </div>
</template>

<script setup lang="ts">
import {%%COMPONENT_NAME%%} from '../src'
</script>
