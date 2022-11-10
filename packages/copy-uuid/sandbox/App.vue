<template>
  <div class="sandbox-container">
    <main>
      <div>
        <h3>Default</h3>
        <CopyUuid :uuid="uuid" />
      </div>
      <div>
        <h3>truncated=false</h3>
        <CopyUuid
          :uuid="uuid"
          :truncated="false"
        />
      </div>
      <div>
        <h3>use-mono=false</h3>
        <CopyUuid
          :uuid="uuid"
          :use-mono="false"
        />
      </div>
      <div>
        <h3>is-hidden=true</h3>
        <CopyUuid
          :uuid="uuid"
          is-hidden
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const uuid = '1234567890ABCDEFG'
</script>
