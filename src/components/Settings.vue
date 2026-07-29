<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTimerStore } from '@/stores/timer';

const timer = useTimerStore();

// --- STATE ---
// These refs keep the form values in a human-friendly HH:MM:SS format.
const workHours = ref(Math.floor(timer.sessions[0]!.time / 3600));
const workMinutes = ref(Math.floor((timer.sessions[0]!.time % 3600) / 60));
const workSeconds = ref(timer.sessions[0]!.time % 60);

const shortHours = ref(Math.floor(timer.sessions[1]!.time / 3600));
const shortMinutes = ref(Math.floor((timer.sessions[1]!.time % 3600) / 60));
const shortSeconds = ref(timer.sessions[1]!.time % 60);

const longHours = ref(Math.floor(timer.sessions[2]!.time / 3600));
const longMinutes = ref(Math.floor((timer.sessions[2]!.time % 3600) / 60));
const longSeconds = ref(timer.sessions[2]!.time % 60);

const sessionsBeforeLongBreak = ref(timer.numberOfSessionBeforeLongBreak);

// --- PREVIEW ---
// These computed values display the current duration in the same human-readable shape as the form inputs.
const workPreview = computed(() => formatDuration(workHours.value, workMinutes.value, workSeconds.value));
const shortPreview = computed(() => formatDuration(shortHours.value, shortMinutes.value, shortSeconds.value));
const longPreview = computed(() => formatDuration(longHours.value, longMinutes.value, longSeconds.value));

// Format a duration into a readable HH:MM:SS string.
function formatDuration(hours: number, minutes: number, seconds: number): string {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Clamp the entered values and convert them back into seconds for the timer store.
function normalizeTime(hours: number, minutes: number, seconds: number): number {
    const safeHours = Math.min(24, Math.max(0, hours));
    const safeMinutes = Math.min(59, Math.max(0, minutes));
    const safeSeconds = Math.min(59, Math.max(0, seconds));

    if (safeHours === 24) {
        return 86400;
    }

    return safeHours * 3600 + safeMinutes * 60 + safeSeconds;
}

// Update one of the stored timer presets and refresh the current timer when needed.
function updateSessionTime(sessionIndex: number, hours: number, minutes: number, seconds: number): void {
    const totalSeconds = normalizeTime(hours, minutes, seconds);

    timer.sessions[sessionIndex]!.time = totalSeconds;

    if ((timer.isStarting || timer.isPaused) && timer.sessions[sessionIndex]!.isActive) {
        timer.seconds = totalSeconds;
    }
}

// Apply the work session values to the timer store.
function updateWorkSession(): void {
    updateSessionTime(0, workHours.value, workMinutes.value, workSeconds.value);
}

// Apply the short break values to the timer store.
function updateShortBreak(): void {
    updateSessionTime(1, shortHours.value, shortMinutes.value, shortSeconds.value);
}

// Apply the long break values to the timer store.
function updateLongBreak(): void {
    updateSessionTime(2, longHours.value, longMinutes.value, longSeconds.value);
}

// Keep the number of sessions before the long break within the allowed range.
function updateSessionCount(): void {
    const nextValue = Math.min(20, Math.max(1, sessionsBeforeLongBreak.value));
    sessionsBeforeLongBreak.value = nextValue;
    timer.numberOfSessionBeforeLongBreak = nextValue;
}
</script>

<template>
    <div class="flex flex-col gap-4 py-4 *:p-8">
        <!-- The header card introduces the settings page and keeps the layout aligned with the timer view. -->
        <div class="rounded-2xl bg-surface-300 ">
            <h2 class="text-center text-settings-title font-bold text-frosted">Settings</h2>
            <p class="mt-2 text-center text-sm text-text-muted">Adjust the timer defaults to match your rhythm.</p>
        </div>

        <!-- The timer presets section contains the three duration editors for the work session and both breaks. -->
        <div class="rounded-2xl bg-surface-300">
            <div class="mb-3 flex items-center justify-between">
                <h3 class="text-lg font-semibold text-text-main">Timer presets</h3>
                <span class="rounded-full bg-surface-100 px-3 py-1 text-sm text-text-muted">HH:MM:SS</span>
            </div>

            <div class="space-y-4">
                <section class="rounded-xl border border-surface-400 bg-surface-200 p-3">
                    <div class="mb-2 flex items-center justify-between">
                        <h4 class="font-semibold text-text-main">Work Session</h4>
                        <span class="text-sm text-text-muted">{{ workPreview }}</span>
                    </div>
                    <div class="grid grid-cols-3 gap-2">
                        <label class="text-xs uppercase tracking-wide text-text-muted">
                            Hours
                            <input v-model.number="workHours" type="number" min="0" max="24" class="mt-1 w-full rounded-xl border border-surface-400 bg-surface-100 px-3 py-2 text-sm text-text-main outline-none focus:border-frosted focus:ring-1 focus:ring-frosted" @input="updateWorkSession" />
                        </label>
                        <label class="text-xs uppercase tracking-wide text-text-muted">
                            Minutes
                            <input v-model.number="workMinutes" type="number" min="0" max="59" class="mt-1 w-full rounded-xl border border-surface-400 bg-surface-100 px-3 py-2 text-sm text-text-main outline-none focus:border-frosted focus:ring-1 focus:ring-frosted" @input="updateWorkSession" />
                        </label>
                        <label class="text-xs uppercase tracking-wide text-text-muted">
                            Seconds
                            <input v-model.number="workSeconds" type="number" min="0" max="59" class="mt-1 w-full rounded-xl border border-surface-400 bg-surface-100 px-3 py-2 text-sm text-text-main outline-none focus:border-frosted focus:ring-1 focus:ring-frosted" @input="updateWorkSession" />
                        </label>
                    </div>
                </section>

                <section class="rounded-xl border border-surface-400 bg-surface-200 p-3">
                    <div class="mb-2 flex items-center justify-between">
                        <h4 class="font-semibold text-text-main">Short Break</h4>
                        <span class="text-sm text-text-muted">{{ shortPreview }}</span>
                    </div>
                    <div class="grid grid-cols-3 gap-2">
                        <label class="text-xs uppercase tracking-wide text-text-muted">
                            Hours
                            <input v-model.number="shortHours" type="number" min="0" max="24" class="mt-1 w-full rounded-xl border border-surface-400 bg-surface-100 px-3 py-2 text-sm text-text-main outline-none focus:border-frosted focus:ring-1 focus:ring-frosted" @input="updateShortBreak" />
                        </label>
                        <label class="text-xs uppercase tracking-wide text-text-muted">
                            Minutes
                            <input v-model.number="shortMinutes" type="number" min="0" max="59" class="mt-1 w-full rounded-xl border border-surface-400 bg-surface-100 px-3 py-2 text-sm text-text-main outline-none focus:border-frosted focus:ring-1 focus:ring-frosted" @input="updateShortBreak" />
                        </label>
                        <label class="text-xs uppercase tracking-wide text-text-muted">
                            Seconds
                            <input v-model.number="shortSeconds" type="number" min="0" max="59" class="mt-1 w-full rounded-xl border border-surface-400 bg-surface-100 px-3 py-2 text-sm text-text-main outline-none focus:border-frosted focus:ring-1 focus:ring-frosted" @input="updateShortBreak" />
                        </label>
                    </div>
                </section>

                <section class="rounded-xl border border-surface-400 bg-surface-200 p-3">
                    <div class="mb-2 flex items-center justify-between">
                        <h4 class="font-semibold text-text-main">Long Break</h4>
                        <span class="text-sm text-text-muted">{{ longPreview }}</span>
                    </div>
                    <div class="grid grid-cols-3 gap-2">
                        <label class="text-xs uppercase tracking-wide text-text-muted">
                            Hours
                            <input v-model.number="longHours" type="number" min="0" max="24" class="mt-1 w-full rounded-xl border border-surface-400 bg-surface-100 px-3 py-2 text-sm text-text-main outline-none focus:border-frosted focus:ring-1 focus:ring-frosted" @input="updateLongBreak" />
                        </label>
                        <label class="text-xs uppercase tracking-wide text-text-muted">
                            Minutes
                            <input v-model.number="longMinutes" type="number" min="0" max="59" class="mt-1 w-full rounded-xl border border-surface-400 bg-surface-100 px-3 py-2 text-sm text-text-main outline-none focus:border-frosted focus:ring-1 focus:ring-frosted" @input="updateLongBreak" />
                        </label>
                        <label class="text-xs uppercase tracking-wide text-text-muted">
                            Seconds
                            <input v-model.number="longSeconds" type="number" min="0" max="59" class="mt-1 w-full rounded-xl border border-surface-400 bg-surface-100 px-3 py-2 text-sm text-text-main outline-none focus:border-frosted focus:ring-1 focus:ring-frosted" @input="updateLongBreak" />
                        </label>
                    </div>
                </section>
            </div>
        </div>

        <!-- The session cycle card controls how many work sessions happen before the long break appears. -->
        <div class="rounded-2xl bg-surface-300 ">
            <h3 class="text-lg font-semibold text-text-main">Session cycle</h3>
            <label class="mt-3 block text-sm font-medium text-text-muted">
                Sessions before long break
                <input v-model.number="sessionsBeforeLongBreak" type="number" min="1" max="20" class="mt-2 w-full rounded-xl border border-surface-400 bg-surface-100 px-3 py-2 text-sm text-text-main outline-none focus:border-frosted focus:ring-1 focus:ring-frosted" @input="updateSessionCount" />
            </label>
            <p class="mt-2 text-sm text-text-muted">The long break appears after {{ sessionsBeforeLongBreak }} work session(s).</p>
        </div>
    </div>
</template>
