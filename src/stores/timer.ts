// This is the store for the time shown in the timer, plus all the functions that help us manipulate it.

import { defineStore } from 'pinia';
import { ref, reactive, computed } from 'vue';
import { formatSeconds } from '@/utils/timeFormatter';

export const useTimerStore = defineStore('timer', () => {
  // --- STATE ---

  /**
   * This variable will contains a variant of the exact moment when a session will end; I mean that I'll use date.now() which gives the number of milliseconds that has passed since 01/01/1970 to calculate the exact moment from when the user hits start() or resume() when the session will end by adding the number of  seconds(of course, *1000) that the session will take.
   * 
   * You  might be wondering, why not just use setIntervall and decrement the seconds, well, I've tried and the issue is that the browser will stop it when you switch to other application. This method is  better to give to the user an accurate timer regardless of the memory management of any browser
   */
  const endTimer = ref(0)

  //the  sessions that will be rendered in the timer component
  const sessions = reactive([
    {
      id: 1,
      name: 'Work Session',
      isActive: true,
      time: 1500,
      resetValue: 1500,
    },
    {
      id: 2,
      name: 'Short Break',
      isActive: false,
      time: 300,
      resetValue: 300,
    },
    {
      id: 3,
      name: 'Long Break',
      isActive: false,
      time: 900,
      resetValue: 900,
    },
  ]);

  /**
   * The reason why I decided to create a distinct displayed value is because I want to be able to update the values of the state in the 'back-end', if I can call it that way, without affecting the value displayed on the screen since the user might go to the settings page while the tie 
   */

  //the number of work sessions that has to be done before the long break
  const numberOfWorkSessionBeforeLongBreak = ref(5);

  const settings = localStorage.getItem('settings');

  //if there are saved settings from the settings page, update the values of the corresponding states in this store
  if (settings) {
    const parsedSettings = JSON.parse(settings);

    for (let i = 0; i < parsedSettings.sessionData.length; i++) {
      sessions[i]!.time = parsedSettings.sessionData[i]!
    }

    numberOfWorkSessionBeforeLongBreak.value = parsedSettings.numberOfWorkSessionBeforeLongBreak
  }

  //what's displayed on the timer
  //it is declared right after the settings localstorage check so that the value displayed matches what was saved in the settings by the user
  const seconds = ref<number>(sessions[0]!.time);

  //to track the actual session. A session is counted as 1 when  the work and the short break sessions are done
  const sessionTracker = ref(1);

  //this value is true only at the begining before the user hits start. It will be true again when the user finishes the long break 
  const isStarting = ref<boolean>(true);

  const isRunning = ref<boolean>(false);
  const isPaused = ref<boolean>(false);
  let timerInterval: number | null = null;

  const alarmAudio = ref<HTMLAudioElement | null>(null)

  // --- GETTERS ---
  const formattedTime = computed<string>(() => formatSeconds(seconds.value));

  // --- ACTIONS ---

  function clearTimerInterval(): void {
    if (timerInterval != null) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  function startSound() {
    // If there's a sound playing, we stop it before starting a new one
    stopSound()

    //creation of the sound  
    alarmAudio.value = new Audio('/sounds/alarm.wav')

    //we loop it so that it keeps playing till the user stops it or goes somewhere else
    alarmAudio.value.loop = true

    alarmAudio.value.play()
  }

  function stopSound() {
    if (alarmAudio.value) {
      // 3. Pause + back at zero
      alarmAudio.value.pause()
      alarmAudio.value.currentTime = 0
      alarmAudio.value = null
    }
  }

  function secondsRemainingTillTheEndOfASession(){
    seconds.value = Math.trunc((endTimer.value - Date.now())/1000)
  }

  // Start from zero or restart
  function start(): void {
    if (isRunning.value) return;

    isStarting.value = false;
    isRunning.value = true;
    isPaused.value = false;

    endTimer.value = Date.now() + seconds.value * 1000

    timerInterval = window.setInterval(() => {
      secondsRemainingTillTheEndOfASession()
      if (seconds.value === 0) {
        clearTimerInterval()
        startSound()
      }
    }, 1000);
  }

  // Pause (preserves the current seconds)
  function pause(): void {
    clearTimerInterval()
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
    stopSound()

    clearTimerInterval()

    if (sessionTracker.value <= numberOfWorkSessionBeforeLongBreak.value) { //if we haven't gone yet beyond the number of sessions before long break
      isRunning.value = false;
      isPaused.value = true;
      if (sessions[0]!.isActive) { // if we are actually in the working session
        sessions[0]!.isActive = false;

        if (sessionTracker.value != numberOfWorkSessionBeforeLongBreak.value) { //and we haven't reached it yet
          //we switch to the short break session
          sessions[1]!.isActive = true;

          //we give to the ref 'seconds' the value of the time reserved  for the short break session
          seconds.value = sessions[1]!.time;
        }

        else { //if not 
          //we switch to the long break session
          sessions[2]!.isActive = true;

          //we give to the ref 'seconds' the value of the time reserved  for the short break session
          seconds.value = sessions[2]!.time;

          //we then increment the session tracker because the session is done
          sessionTracker.value++;
        }

      }

      else { // if, instead, we are in the short break session and we still haven't gone beyond the number of sessions before  long break

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

      isStarting.value = true;
      isRunning.value = false;
      isPaused.value = false;

      sessionTracker.value = 1;
    }
  }

  return {
    seconds,
    timerInterval,
    sessions,
    sessionTracker,
    isStarting,
    isRunning,
    isPaused,
    numberOfWorkSessionBeforeLongBreak,
    formattedTime,
    stopSound,
    start,
    pause,
    resume,
    done,
  };
});
