<script setup lang="ts">
import { CirclePause, PlayCircle, SquareCheck } from '@lucide/vue';
import { useTimerStore } from '@/stores/timer';
import { onUnmounted } from 'vue';

const timer = useTimerStore()

//to stop the sound when the user leaves the page
onUnmounted(()=>{
    timer.stopSound()
})

</script>

<template>
    <div class="flex flex-col justify-between items-center h-timer py-4  bg-surface-300 rounded-2xl">
        <div
            class="flex gap-session-gap items-center *:px-session-px *:py-session-py *:rounded-xl *:border *:border-transparent *:text-session *:text-center">
            <!-- it displays the sessions -->
            <button v-for="session in timer.sessions" :key="session.id" :class="{
                // different styles depending on if it is an actual session
                'text-text-muted bg-surface-100 ': !session.isActive,
                'text-white bg-frosted font-bold ': session.isActive,
            }">
                {{ session.name }}
            </button>
        </div>

        <span class="text-frosted text-timer-center">{{ timer.formattedTime }}</span>

        <div
            class="flex gap-timer-man-gap items-center *:flex *:items-center *:text-center *:gap-timer-man-button-gap *:bg-surface-100 *:text-text-muted *:enabled:hover:text-frosted *:enabled:hover:cursor-pointer *:px-timer-man-px *:py-timer-man-py *:rounded-xl *:text-timer-man">

            <!-- is displayed only at the beginning and never after unless you refresh the page -->
            <button @click="timer.start()" v-if="timer.isStarting">
                <PlayCircle class=" size-(--text-timer-man)" />
                <span>Start : </span>
                <span class="text-frosted font-bold">#{{ timer.sessionTracker }}</span>
            </button>

            <!-- is displayed after either the button start or resume was clicked -->
            <button @click="timer.pause()" v-else-if="timer.isRunning">
                <CirclePause class=" size-(--text-timer-man)" />
                <span>Pause : </span>
                <span class="text-frosted font-bold">#{{ timer.sessionTracker }}</span>
            </button>

            <!-- is displayed after the button pause was clicked -->
            <button @click="timer.resume()" v-else-if="timer.isPaused">
                <PlayCircle class=" size-(--text-timer-man)" />
                <span>Resume : </span>
                <span class="text-frosted font-bold">#{{ timer.sessionTracker }}</span>
            </button>

            <button @click="timer.done()" :disabled="timer.isPaused || timer.isStarting"
                class="disabled:cursor-not-allowed">
                <SquareCheck class=" size-(--text-timer-man)" />
                <span>Done</span>
            </button>
        </div>
    </div>

    <div class="w-timer mx-auto my-9">
        <h1 class=" text-frosted text-session font-bold mb-2">Informations : </h1>
        <ul class="list-decimal *:mb-4 *:text-timer-man">
            <li>
                A sound plays everytime the timer reaches 0.
                <span class="text-red-600 font-bold">Click on Done in that case</span>
            </li>

            <li>The <span class="text-frosted">#{number}</span> part tells you at how many working sessions you are.
                <br>
                Once it hits <span class="text-frosted">{{ timer.numberOfWorkSessionBeforeLongBreak }}</span> the long
                break will start. You can modify that value in the settings
            </li>

            <li>You can't click on <span class="text-frosted">Done</span> unless the timer is running</li>

            <li>
                The default settings are :
                <ol class="list-disc text-text-muted ml-5 *:mb-2">
                    <li>25 min for the Work Session</li>
                    <li>5 min for the Short Break</li>
                    <li>15 min for the Long Break</li>
                    <li>5 work sessions before the long break</li>
                </ol>
            </li>

            <li>You can change the default settings in the settings page, click on the icon at the top</li>
        </ul>
    </div>
</template>
