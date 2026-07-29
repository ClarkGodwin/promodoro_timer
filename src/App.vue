<script setup lang="ts">
import { SettingsIcon } from '@lucide/vue';
</script>

<template>
  <header class="flex justify-between items-center w-header mx-auto py-2.5 *:text-frosted">
    <RouterLink :to="{ name: 'home' }" class="text-header">
      Welcome in our Promodoro Timer
    </RouterLink>
    <RouterLink :to="{name: 'settings'}">
      <SettingsIcon class="size-(--text-header)"/>
    </RouterLink>
  </header>

  <div class="w-timer mx-auto my-4">
    <RouterView />
  </div>
</template>

