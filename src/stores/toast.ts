import { defineStore } from "pinia";
import { ref } from "vue";

export const useToastStore = defineStore('toast', () => {
    const toastShown = ref(false)

    function showToast() {
        toastShown.value = true
        setTimeout(() => {
            toastShown.value = false
        }, 3000);
    }

    setTimeout(() => {
        showToast()
    }, 4000);

    return {
        toastShown,
        showToast,
    }
})
