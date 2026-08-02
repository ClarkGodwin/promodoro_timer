import { defineStore } from "pinia";
import { ref } from "vue";
import { useTimerStore } from "./timer";

//this store is to control the display of the toast that's shown when the user save changes in the settings page. The toast is displayed in the App.vue component
export const useToastStore = defineStore('toast', () => {
    //there's a v-if attribute on the div tag around toast. Check it in App.vue 
    const toastShown = ref(false)

    const timer = useTimerStore()

    //this function displays the toast and erases it after 3 seconds. It also updates the seconds state from usetimestore in case the user hasn't started the timer yet
    function showToast() {
        const settings = localStorage.getItem('settings');

        if (settings) {
            const parsedSettings = JSON.parse(settings);
            if(timer.isStarting){ // I check if the user hasn't started the timer yet.
                timer.seconds = parsedSettings.sessionData[0]
            }
        }


        toastShown.value = true
        setTimeout(() => {
            toastShown.value = false
        }, 3000);
    }

    return {
        toastShown,
        showToast,
    }
})
