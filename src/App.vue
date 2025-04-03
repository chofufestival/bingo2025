<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import Header from './components/Header.vue'
import { useBingoStore } from './stores/bingo.js'

const store = useBingoStore()
const { history, timer } = storeToRefs(store)
const { start, toggle } = store
</script>

<template>
  <div class="flex flex-col h-screen">
    <Header />
    <div class="grow flex flex-col justify-center items-center">
      <div class="font-bold font-monospace text-[10rem] my-6">
        {{ history.length ? history[history.length - 1] : '--' }}
      </div>
      <div class="center">
        <button @click="start" :disabled="timer" class="btn btn-xl btn-primary">Start!</button>
      </div>
    </div>
    <div class="grid grid-cols-5 gap-6 p-6">
      <div v-for="col in 5" class="grid grid-cols-3 gap-2">
        <button
          v-for="n in Array.from(Array(15), (_, i) => i + 1 + (col - 1) * 15)" 
          :key="n"
          @click="toggle(n)"
          :class="`btn btn-xl text-3xl py-8 m-0 rounded-sm ${history.includes(n) && 'btn-primary'}`"
          >
          {{ n }}
        </button>
      </div>
    </div>
  </div>
</template>
