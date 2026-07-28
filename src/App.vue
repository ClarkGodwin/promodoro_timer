<script setup lang="ts">
import { SettingsIcon } from '@lucide/vue';
</script>

<template>
  <header class="flex justify-between items-center w-header mx-auto py-2.5">
    <RouterLink :to="{ name: 'home' }" class=" text-frosted text-header">
      Welcome in our Promodoro Timer
    </RouterLink>
    <SettingsIcon class=" text-frosted size-(--text-header)"/>
  </header>

  <RouterView />
</template>

