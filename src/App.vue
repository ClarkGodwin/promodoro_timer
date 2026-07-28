<script setup lang="ts">
import { SettingsIcon } from '@lucide/vue';
import Timer from './components/Timer.vue';
</script>

<template>
  <header class="flex justify-between items-center w-header mx-auto py-2.5">
    <h1 class=" text-frosted text-header">
      Welcome in our Promodoro Timer
    </h1>
    <SettingsIcon class=" text-frosted size-(--text-header)"/>
  </header>

  <Timer/>
</template>

