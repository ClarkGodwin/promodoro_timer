<script setup lang="ts">
import { useTimerStore } from '@/stores/timer';
import { formatSeconds, parseTimeToSeconds } from '@/utils/timeFormatter';
import { reactive, ref, type Reactive } from 'vue';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
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

            <div class="flex gap-3 justify-end *:w-validation-button *:bg-frosted *:text-white *:font-bold *:rounded-2xl *:py-1 *:sm:py-1.5 *:cursor-pointer">
                <button @click="test = !test">Save</button>
                <button>Reset</button>
            </div>

            <AlertDialog v-model:open="test">
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    </section>

</template>
