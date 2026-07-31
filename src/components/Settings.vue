<script setup lang="ts">
import { useTimerStore } from '@/stores/timer';
import { formatSeconds, parseTimeToSeconds } from '@/utils/timeFormatter';
import { reactive, type Reactive } from 'vue';
import type { V } from 'vue-router/dist/index-BN0B0y8a.js';

const timer = useTimerStore();

/*  - first use the formatSeconds function from /utils folder. Check its documentation 

    - secondly I splited it using the character ':'

    - thirdly I must return an array of numbers with 3 values, hour, minute, second. Except second, the value of the two others can be undefined  which is why you see push(0,0,s)
*/

function splitFormatSeconds(seconds : number) : number[] {
    const unsplittedFormat : string = formatSeconds(seconds); 
    const stringSplittedFormat : string[] = unsplittedFormat.split(':');
    const numberSplittedFormat : number [] = [];

    switch (stringSplittedFormat.length) {
        case 1 :
            numberSplittedFormat.push(0,0, parseInt(stringSplittedFormat[0]!));
            break;

        case 2 :
            numberSplittedFormat.push(0, parseInt(stringSplittedFormat[0]!), parseInt(stringSplittedFormat[1]!));
            break;

        case 3 :
            numberSplittedFormat.push( parseInt(stringSplittedFormat[0]!), parseInt(stringSplittedFormat[1]!), parseInt(stringSplittedFormat[2]!));
            break;
    }

    return numberSplittedFormat;
}

const sessions = reactive(timer.sessions.map(session => ({ ...session })))

sessions[0]!.id = 6


console.log(timer.sessions[0]!.id)

</script>

<template>
    <section class="bg-surface-300 rounded-2xl p-5 flex flex-col gap-3">
        <h2 class="text-frosted text-settings-header-title text-center">Setting's page</h2>
        <p class="text-text-muted text-settings-header-text">
            Here you can modify the value the time of each session and even the number of work session before the long break session
        </p>

    </section>

    <section>
        <div class="bg-surface-300 rounded-2xl p-5 flex flex-col gap-3 mt-5">
            <div 
            v-for="session in timer.sessions" 
            :key="session.id"
            >
                Time for the 
                <span class="text-frosted">{{ session.name }} : </span>
                <div>
                    <label for="hours.{{ session.id }}">Hours : </label>
                    <input type="number" name="hours.{{ session.id }}" id="">
                </div>
            </div>
        </div>
    </section>

</template>
