<script setup lang="ts">
import { PlayCircle, SquareCheck } from '@lucide/vue';
import { useTimerStore } from '@/stores/timer';

const timer = useTimerStore()
</script>

<template>
    <div class="flex flex-col justify-between items-center w-timer h-timer mx-auto my-4 py-4  bg-surface-300 rounded-2xl">
        <div 
        class="flex gap-session-gap items-center *:text-text-muted *:bg-surface-100 *:px-session-px *:py-session-py *:rounded-xl *:border *:border-transparent *:hover:border-frosted *:hover:text-frosted *:text-session *:text-center"
        >
            <button>Work Session</button>
            <button>Short Break</button>
            <button>Long Break</button>
        </div>

        <span class="text-frosted text-timer-center">{{ timer.formattedTime }}</span>

        <div class="flex gap-timer-man-gap items-center *:flex *:items-center *:text-center *:gap-timer-man-button-gap *:bg-surface-100 *:text-text-muted *:px-timer-man-px *:py-timer-man-py *:rounded-xl *:text-timer-man">
            <button>
                <PlayCircle class=" size-(--text-timer-man)"/>
                <span>Start</span>
            </button>
            <button>
                <SquareCheck class=" size-(--text-timer-man)"/>
                <span>Done</span>
            </button>
        </div>
    </div>
</template>
