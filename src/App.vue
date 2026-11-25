<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import Header from './components/Header.vue'
import { useBingoStore } from './stores/bingo.js'

const store = useBingoStore()
const { storage, history, currentResults, timer } = storeToRefs(store)
const { start, toggle } = store
const strong = ref(false)
const drawCount = ref(1)
let animation = null

function handleKeydown(event) {
  if (event.repeat || event.isComposing || event.metaKey || event.ctrlKey || event.altKey) return
  if (['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'].includes(event.target?.tagName)) return
  if (timer.value) return

  if (event.code === 'Space') {
    event.preventDefault()
    start(drawCount.value)
    return
  }

  if (/^[1-5]$/.test(event.key)) {
    drawCount.value = Number(event.key)
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  clearInterval(animation)
})

watch(storage, (updated, old) => {
  if (updated.length >= old.length) {
    clearInterval(animation)
    let count = 0
    strong.value = true
    animation = setInterval(() => {
      count++
      if (count > 4) {
        clearInterval(animation)
        animation = null
        strong.value = false
        return
      }
      strong.value = !strong.value
    }, 250)
  }
})
</script>

<template>
  <div class="relative isolate flex h-screen flex-col overflow-hidden">
    <img
      src="./assets/images/background.png"
      alt=""
      class="pointer-events-none absolute inset-0 -z-10 size-full object-cover"
    />
    <Header />
    <div class="grow flex justify-around items-center">
      <div>
        <img src="./assets/images/logo.png" class="opacity-75 w-[20rem]" />
      </div>
      <div class="relative flex-none h-[20rem] w-[50rem]">
        <div class="flex h-[12rem] items-center justify-center gap-6">
          <div
            v-for="number in currentResults"
            :key="number"
            :class="`font-bold text-[7.2rem] transition-all ${strong ? 'text-red-500 text-[8.4rem]' : 'text-white'}`"
          >
            {{ number }}
          </div>
          <div v-if="!currentResults.length" class="font-bold text-[7.2rem] text-white">
            --
          </div>
        </div>
        <div class="absolute bottom-0 left-0 flex w-full flex-col items-center gap-2">
          <button @click="start(drawCount)" :disabled="timer" class="btn btn-xl btn-primary w-[10rem]">Start!</button>
          <select v-model.number="drawCount" :disabled="timer" class="select w-[5.5rem] border-white/20 bg-black/20 px-2 text-white/70 shadow-none disabled:border-white/20 disabled:bg-black/20 disabled:text-white/70 disabled:opacity-100">
            <option v-for="count in 5" :key="count" :value="count">
              {{ count }}個
            </option>
          </select>
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
          :class="`btn btn-xl text-3xl py-8 m-0 rounded-sm ${history.includes(n) || (timer && currentResults.includes(n)) ? 'btn-primary' : ''} ${timer ? 'pointer-events-none' : ''}`"
          >
          {{ n }}
        </button>
      </div>
    </div>
  </div>
</template>
