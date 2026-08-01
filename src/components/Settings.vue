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

function splitFormatSeconds(seconds: number): number[] {
    const unsplittedFormat: string = formatSeconds(seconds);
    const stringSplittedFormat: string[] = unsplittedFormat.split(':');
    const numberSplittedFormat: number[] = [];

    switch (stringSplittedFormat.length) {
        case 1:
            numberSplittedFormat.push(0, 0, parseInt(stringSplittedFormat[0]!));
            break;

        case 2:
            numberSplittedFormat.push(0, parseInt(stringSplittedFormat[0]!), parseInt(stringSplittedFormat[1]!));
            break;

        case 3:
            numberSplittedFormat.push(parseInt(stringSplittedFormat[0]!), parseInt(stringSplittedFormat[1]!), parseInt(stringSplittedFormat[2]!));
            break;
    }

    return numberSplittedFormat;
}

const sessions = reactive(
  timer.sessions.map((session) => {
    const numberSplittedFormat = splitFormatSeconds(session.time);

    return {
      ...session, 
      splittedFormat: {
        hour: {
          id: 1,
          name: 'Hour',
          valueOfIt: numberSplittedFormat[0] ?? 0,
        },
        minute: {
          id: 2,
          name: 'Minute',
          valueOfIt: numberSplittedFormat[1] ?? 0,
        },
        second: {
          id: 3,
          name: 'Second',
          valueOfIt: numberSplittedFormat[2] ?? 0,
        },
      },
    };
  })
);

console.log(sessions)

</script>

<template>
    <section class="bg-surface-300 rounded-2xl p-5 flex flex-col gap-3">
        <h2 class="text-frosted text-settings-header-title text-center">Setting's page</h2>
        <p class="text-text-muted text-settings-header-text">
            <span class="text-frosted font-bold">Important Informations : </span>Here you can modify the value the time of each session and even the number of work session before the long break session. <br><br>
            The modifications won't be applied to the session being played. <br><br>
            Click on <span class="text-frosted font-bold">save</span> to the save the modifications or on <span class="text-frosted font-bold">reset</span> to come back to the original values
        </p>

    </section>

    <section>
        <div class="bg-surface-300 rounded-2xl px-5 py-8 flex flex-col gap-8 mt-6 text-settings-input">
            <div v-for="session in sessions" :key="session.id">
                Time for the
                <span class="text-frosted">{{ session.name }} : </span>
                <div class="flex gap-3 min-w-0 mt-2">
                    <div v-for="split in session.splittedFormat" :key="split.id">
                        <label >{{ split.name }} : </label>
                        <input 
                        type="number" 
                        v-model="split.valueOfIt"
                        class="bg-surface-100 min-w-0 w-full rounded-2xl py-1 px-3"
                        >
                    </div>
                </div>
            </div>
        </div>
    </section>

</template>
