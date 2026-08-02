<script setup>
import { CircleCheck } from '@lucide/vue';
</script>

<template>
    <div class="absolute top-0 left-toast flex gap-1 items-center text-white font-bold bg-frosted w-toast mx-auto p-p-toast rounded-2xl text-toast">
        <CircleCheck class="size-(--text-toast)"/>
        <span>Changes were saved</span>
    </div>
</template>
