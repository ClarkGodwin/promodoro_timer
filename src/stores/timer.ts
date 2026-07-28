// This is the store for the time shown in the timer, plus all the functions that help us manipulate it.

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { formatSeconds} from '@/utils/timeFormatter';

export const useTimerStore = defineStore('timer', () => {
  // --- STATE ---
  const seconds = ref<number>(0);
  const isRunning = ref<boolean>(false);
  const isPaused = ref<boolean>(false);
  let timerInterval: number | null = null;

  // --- GETTERS ---
  const formattedTime = computed<string>(() => formatSeconds(seconds.value));

  // --- ACTIONS ---

  // Start from zero or restart
  function start(): void {
    if (isRunning.value) return;

    isRunning.value = true;
    isPaused.value = false;

    timerInterval = window.setInterval(() => {
      seconds.value++;
    }, 1000);
  }

  // Pause (preserves the current seconds)
  function pause(): void {
    if (timerInterval !== null) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    isRunning.value = false;
    isPaused.value = true;
  }

  // Resume (an explicit alias to restart playback after a pause)
  function resume(): void {
    if (isPaused.value) {
      start();
    }
  }

  return {
    seconds,
    isRunning,
    isPaused,
    formattedTime,
    start,
    pause,
    resume,
  };
});
