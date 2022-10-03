<template>
  <main>
    <TestButton msg="You did it!" />
    <hr>
    <RedButton custom-text="This text goes under the button" />
  </main>
</template>

<script setup lang="ts">
import { TestButton, RedButton } from '../src'
</script>
