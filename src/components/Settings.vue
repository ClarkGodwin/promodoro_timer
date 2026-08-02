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
import { useRouter } from 'vue-router';
import { useToastStore } from '@/stores/toast';

const router = useRouter()

const toast = useToastStore()

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

/**
 * I created this reactive variable to show informations to the user in a dialog modal to ask him if he's sure of the modifications he's about to register
 */
const validations = reactive([
    {
        id: 1,
        trigger: false,
        name: 'Save',
        text: computed(() => {
            let selectedTimeFormatted = '';
            //to show the selected time for each session in a human format
            sessions.map((session) => {
                const totalSeconds = session.splittedFormat.hour.valueOfIt * 3600 + session.splittedFormat.minute.valueOfIt * 60 + session.splittedFormat.second.valueOfIt;

                selectedTimeFormatted += session.name + ': ' + formatSeconds(totalSeconds) + '\n '
            });

            return 'The values you selected : \n\n ' + selectedTimeFormatted + 'Number of work sessions before long break : ' + numberOfWorkSessionBeforeLongBreak.value + '\n\n will be applied'
        }),
        action: () => save()
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
        action: () => reset(),
    },
])

function save() {
    let sessionData : number[] = [] 

    //to update the time proprety(that has the value in seconds) so that I'll be able to pass it to the sessions state in the store
    sessions.map((session) => {
        session.time = session.splittedFormat.hour.valueOfIt * 3600 + session.splittedFormat.minute.valueOfIt * 60 + session.splittedFormat.second.valueOfIt;
    });

    //it updates the values of store's sessions state but no worries, it doesn't affect the displayed timer in the home page since it's a different state that's being displayed
    for (let i = 0; i < sessions.length; i++) {
        sessionData.push(sessions[i]!.time) 
    }

    doNotRepeatYourself(sessionData, numberOfWorkSessionBeforeLongBreak.value)
}

//except for the values, the logic is pretty much the same as for the save method
function reset() {
    let sessionData : number[] = [] 

    for (let i = 0; i < sessions.length; i++) {
        sessionData.push(timer.sessions[i]!.resetValue)
    }


    doNotRepeatYourself(sessionData, 5)

}


//for the functions save() and reset() above
async function doNotRepeatYourself(sessionData : number[], numberOfWorkSessionBeforeLongBreak: number) {

    for (let i = 0; i < sessions.length; i++) {
        timer.sessions[i]!.time = sessionData[i]!
    }

    timer.numberOfWorkSessionBeforeLongBreak = numberOfWorkSessionBeforeLongBreak

    toast.showToast()

    await router.push({ name: 'home' })

    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
    })

}


</script>

<template>
    <section class="bg-surface-300 rounded-2xl p-5 flex flex-col gap-3">
        <h2 class="text-frosted text-settings-header-title text-center">Setting's page</h2>
        <p class="text-text-muted text-settings-header-text">
            <span class="text-frosted font-bold">Important Informations : </span><br> <br>

            <span class="text-frosted font-bold">* </span>Here you can modify the value the time of each session and
            even the number of work session before the long break session. <br><br>

            <span class="text-frosted font-bold">* </span>The modifications won't be applied to the session being played
            except for the number of work session before the long break. <br><br>

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
                                <AlertDialogAction @click="validation.action"
                                    class="cursor-pointer text-white bg-frosted font-bold hover:bg-frosted hover:text-white">Yes</AlertDialogAction>
                                <AlertDialogCancel @click="validation.trigger = false"
                                    class="cursor-pointer text-white bg-red-600 font-bold hover:bg-red-600 hover:text-white">No</AlertDialogCancel>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </button>
            </div>

        </div>
    </section>

</template>
