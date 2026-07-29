<script setup lang="ts">
import { ref, computed } from 'vue';
import { CirclePause, PlayCircle, SquareCheck } from '@lucide/vue';
import { useTimerStore } from '@/stores/timer';

const timer = useTimerStore()

</script>

<template>
    <div class="flex flex-col justify-between items-center w-timer h-timer mx-auto my-4 py-4  bg-surface-300 rounded-2xl">
        <div 
        class="flex gap-session-gap items-center *:px-session-px *:py-session-py *:rounded-xl *:border *:border-transparent *:text-session *:text-center"
        >
            <!-- it displays the sessions -->
            <button
            v-for="session in timer.sessions"
            :key="session.id"
            :class="{
                // different styles depending on if it is an actual session
                'text-text-muted bg-surface-100 ': !session.isActive,
                'text-white bg-frosted font-bold ': session.isActive,
            }"
            >
                {{ session.name }}
            </button>
        </div>

        <span class="text-frosted text-timer-center">{{ timer.formattedTime }}</span>

        <div class="flex gap-timer-man-gap items-center *:flex *:items-center *:text-center *:gap-timer-man-button-gap *:bg-surface-100 *:text-text-muted *:hover:text-frosted *:hover:cursor-pointer *:px-timer-man-px *:py-timer-man-py *:rounded-xl *:text-timer-man">

            <!-- is displayed only at the beginning and never after unless you refresh the page -->
            <button @click="timer.start()" v-if="timer.isStarting">
                <PlayCircle class=" size-(--text-timer-man)"/>
                <span>Start</span>
            </button>

            <!-- is displayed after either the button start or resume was clicked -->
            <button @click="timer.pause()" v-else-if="timer.isRunning">
                <CirclePause class=" size-(--text-timer-man)"/>
                <span>Pause</span>
            </button>

            <!-- is displayed after the button pause was clicked -->
            <button @click="timer.resume()" v-else-if="timer.isPaused">
                <PlayCircle class=" size-(--text-timer-man)"/>
                <span>Resume</span>
            </button>

            <button @click="timer.done()">
                <SquareCheck class=" size-(--text-timer-man)"/>
                <span>Done</span>
            </button>
        </div>
    </div>
</template>
