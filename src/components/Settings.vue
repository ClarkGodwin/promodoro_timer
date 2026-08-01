<script setup lang="ts">
import { useTimerStore } from '@/stores/timer';
import { formatSeconds, parseTimeToSeconds } from '@/utils/timeFormatter';
import { computed, reactive, ref, type Reactive } from 'vue';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

/**
 * Here I didn't want the modifications to immediately be applied in the sessions state in the store for logic issues, which is why I created another reactive variable with the value of the session state in the store plus the splitted format of the time property so that it'll be easier to display it with v-for on the inputs using a v-model  
 */
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

const numberOfWorkSessionBeforeLongBreak = ref(timer.numberOfWorkSessionBeforeLongBreak);

function save() { }

function reset() { }

const validations = reactive([
    {
        id: 1,
        trigger: false,
        name: 'Save',
        text: computed(() => {
            let selectedTimeFormatted = '';
            sessions.map((session) => {
                const totalSeconds = session.splittedFormat.hour.valueOfIt * 3600 + session.splittedFormat.minute.valueOfIt * 60 + session.splittedFormat.second.valueOfIt;

                selectedTimeFormatted += session.name + ': ' + formatSeconds(totalSeconds) + '\n '
            });

            return 'The values you selected : \n\n ' + selectedTimeFormatted + 'Number of work sessions before long break : ' + numberOfWorkSessionBeforeLongBreak.value + '\n\n will be applied'
        }),
        action: save(),
    },
    {
        id: 2,
        trigger: false,
        name: 'Reset',
        text: computed(() => {
            let selectedTimeFormatted = '';
            sessions.map((session) => {
                selectedTimeFormatted += session.name + ': ' + formatSeconds(session.resetValue) + '\n '
            });

            numberOfWorkSessionBeforeLongBreak.value = 5

            return 'The default values : \n\n ' + selectedTimeFormatted + 'Number of work sessions before long break : ' + 5 + '\n\n will be applied'
        }),
        action: reset(),
    },
])

console.log(validations[0]?.text)

const test = ref(false)

</script>

<template>
    <section class="bg-surface-300 rounded-2xl p-5 flex flex-col gap-3">
        <h2 class="text-frosted text-settings-header-title text-center">Setting's page</h2>
        <p class="text-text-muted text-settings-header-text">
            <span class="text-frosted font-bold">Important Informations : </span><br> <br>
            <span class="text-frosted font-bold">* </span>Here you can modify the value the time of each session and
            even the number of work session before the long break session. <br><br>
            <span class="text-frosted font-bold">* </span>The modifications won't be applied to the session being
            played. <br><br>
            <span class="text-frosted font-bold">* </span>Due to logic, the limit for hours is 10, 59 for the minutes
            and seconds. I don't think someone will ever need up to 11 hours for each work session. <br><br>
            <span class="text-frosted font-bold">* </span>The limit for the number of work sessions before the long
            break is 30. <br><br>
            <span class="text-frosted font-bold">* </span>Click on <span class="text-frosted font-bold">save</span> to
            the save the modifications or on <span class="text-frosted font-bold">reset</span> to come back to the
            original values
        </p>

    </section>

    <section>
        <div class="bg-surface-300 rounded-2xl px-5 py-8 flex flex-col gap-8 mt-6 mb-20 text-settings-input">
            <div v-for="session in sessions" :key="session.id">
                Time for the
                <span class="text-frosted font-bold">{{ session.name }} : </span>
                <div class="flex gap-3 mt-2">
                    <div v-for="split in session.splittedFormat" :key="split.id" class="flex-1 min-w-0">
                        <label>{{ split.name }} : </label>
                        <input type="number" min="0" :max="split.name == 'Hour' ? 10 : 59" v-model="split.valueOfIt"
                            class="bg-surface-100 min-w-0 w-full rounded-2xl py-1 px-3">
                    </div>
                </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-3 sm:items-center">
                <label class="text-frosted font-bold">Number of work sessions before the long break: </label>
                <input type="number" class="bg-surface-100 rounded-2xl py-1 px-3"
                    v-model="numberOfWorkSessionBeforeLongBreak">
            </div>

            <div
                class="flex gap-3 justify-end *:w-validation-button *:bg-frosted *:text-white *:font-bold *:rounded-2xl *:py-1 *:sm:py-1.5 *:cursor-pointer">
                <button v-for="validation in validations" :key="validation.id" @click="validation.trigger = true">
                    {{ validation.name }}
                    <AlertDialog v-model:open="validation.trigger">
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription class="whitespace-pre-line">
                                    {{ validation.text }}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogAction @click="validation.action" class="cursor-pointer text-white bg-frosted font-bold">Yes</AlertDialogAction>
                                <AlertDialogCancel @click="validation.trigger = false" class="cursor-pointer text-white bg-red-600 font-bold">No</AlertDialogCancel>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </button>
            </div>

        </div>
    </section>

</template>
