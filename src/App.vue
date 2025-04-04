<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import Header from './components/Header.vue'
import { useBingoStore } from './stores/bingo.js'

const store = useBingoStore()
const { storage, history, timer } = storeToRefs(store)
const { start, toggle } = store
const strong = ref(false)

watch(storage, (updated, old) => {
  if (updated.length >= old.length) {
    let count = 0
    strong.value = true
    const animation = setInterval(() => {
      count++
      if (count > 4) {
        clearInterval(animation)
      }
      strong.value = strong.value ? false : true
    }, 250)
  }
})
</script>

<template>
  <div class="flex flex-col h-screen">
    <Header />
    <div class="grow flex justify-around items-center">
      <div>
        <img src="./assets/images/logo.png" class="opacity-75 w-[20rem]" />
      </div>
      <div class="flex-none flex flex-col justify-center items-center w-[10rem]">
        <div :class="`font-bold font-monospace text-[10rem] mb-6 transition-all ${strong && 'text-red-500 text-[12.5rem]'}`">
          {{ history.length ? history[history.length - 1] : '--' }}
        </div>
        <div>
          <button @click="start" :disabled="timer" class="btn btn-xl btn-primary">Start!</button>
        </div>
      </div>
      <div>
        <img src="./assets/images/charactors.png" class="opacity-75 w-[20rem]" />
      </div>
    </div>
    <div class="grid grid-cols-5 gap-6 p-6">
      <div v-for="col in 5" class="grid grid-cols-3 gap-2">
        <button
          v-for="n in Array.from(Array(15), (_, i) => i + 1 + (col - 1) * 15)" 
          :key="n"
          @click="toggle(n)"
          :class="`btn btn-xl text-3xl py-8 m-0 rounded-sm font-monospace ${history.includes(n) && 'btn-primary'}`"
          >
          {{ n }}
        </button>
      </div>
    </div>
  </div>
</template>
