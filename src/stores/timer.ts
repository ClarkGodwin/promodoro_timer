// This is the store for the time shown in the timer, plus all the functions that help us manipulate it.

import { defineStore } from 'pinia';
import { ref, reactive, computed } from 'vue';
import { formatSeconds } from '@/utils/timeFormatter';

export const useTimerStore = defineStore('timer', () => {
  // --- STATE ---

  //the  sessions that will be rendered in the timer component
  const sessions = reactive([
    {
      id: 1,
      name: 'Work Session',
      isActive: true,
      time: 1500,
    },
    {
      id: 2,
      name: 'Short Break',
      isActive: false,
      time: 300,
    },
    {
      id: 3,
      name: 'Long Break',
      isActive: false,
      time: 900,
    },
  ]);

  //what's displayed on the timer
  const seconds = ref<number>(sessions[0]!.time);

  //the number of sessions that has to be done before the long break
  const numberOfSessionBeforeLongBreak = ref(5);

  //to track the actual session. A session is counted as 1 when  the work and the short break sessions are done
  const sessionTracker = ref(1);

  const isStarting = ref<boolean>(true);
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
      seconds.value--
      if (seconds.value === 0) {
        done()
      }
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

  function done(): void {
    if (timerInterval !== null) {
      clearInterval(timerInterval);
      timerInterval = null;
      isRunning.value = false;
      isPaused.value = true;

      if (sessionTracker.value <= numberOfSessionBeforeLongBreak.value) { //if we haven't gone yet beyond the number of sessions before long break
        if (sessions[0]!.isActive) { // if we are actually in the working session
          sessions[0]!.isActive = false;

          if (sessionTracker.value != numberOfSessionBeforeLongBreak.value) { //and we haven't reached it yet
            //we switch to the short break session
            sessions[1]!.isActive = true;

            //we give to the ref 'seconds' the value of the time reserved  for the short break session
            seconds.value = sessions[1]!.time;
          }

          else { //if not 
            //we switch to the long break session
            sessions[2]!.isActive = true;

            //we give to the ref 'seconds' the value of the time reserved  for the short break session
            seconds.value = sessions[0]!.time;

            //we then increment the session tracker because the session is done
            sessionTracker.value++;
          }

        }

        else { // if, instead, we are in the short break session and we still haven't gone beyond the numbere of sessions before  long break

          //we switch back to the work session
          sessions[1]!.isActive = false;
          sessions[0]!.isActive = true;

          //we give to the ref 'seconds' the value of the time reserved  for the work session
          seconds.value = sessions[0]!.time;

          //we then increment the session tracker because the session is done
          sessionTracker.value++;
        }

        //and we start right away the work session
        start();
      }

      else { //if  we have reached the number of session before long break

        //we switch to the work session
        sessions[0]!.isActive = true;
        sessions[2]!.isActive = false;

        //we give to the ref 'seconds' the value of the time reserved  for the work session
        seconds.value = sessions[0]!.time;
      }
    }
  }

  return {
    seconds,
    sessions,
    isStarting,
    isRunning,
    isPaused,
    formattedTime,
    start,
    pause,
    resume,
    done,
  };
});
