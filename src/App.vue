<script setup lang="ts">
import { SettingsIcon } from '@lucide/vue';
import Toast from '@/components/Toast.vue';
import { useToastStore } from './stores/toast';

const toast = useToastStore()

</script>

<template>
  <div v-if="toast.toastShown" class=" relative w-header mx-auto">
    <Toast/>
  </div>
  <header class="flex  justify-between  items-center w-header mx-auto py-2.5 *:text-frosted">

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

