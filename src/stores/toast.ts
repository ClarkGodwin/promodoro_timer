import { defineStore } from "pinia";
import { ref } from "vue";

//this store is to control the display of the toast that's shown when the user save changes in the settings page. The toast is displayed in the App.vue component
export const useToastStore = defineStore('toast', () => {
    //there's a v-if attribute on the div tag around toast. Check it in App.vue 
    const toastShown = ref(false)

    //this function displays the toast and erases it after 3 seconds
    function showToast() {
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
