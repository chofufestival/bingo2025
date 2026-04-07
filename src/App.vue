<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import Header from './components/Header.vue'
import QuizModal from './components/QuizModal.vue'
import { useBingoStore } from './stores/bingo.js'

const store = useBingoStore()
const { storage, history, displayNumbers, timer } = storeToRefs(store)
const { start, triple, toggle } = store
const strong = ref(false)
const showTriple = ref(false)
const showQuiz = ref(false)
const quizModal = ref(null)

function openQuizModal() {
  quizModal.value?.open()
}

watch(storage, (updated, old) => {
  if (updated.length > old.length) {
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
        <img
          src="./assets/images/logo.png"
          class="opacity-85 w-[20rem] cursor-pointer"
          @click="showTriple = !showTriple"
        />
      </div>
      <div class="flex-none flex flex-col justify-center items-center w-[24rem]">
        <div :class="`font-bold font-monospace mb-6 transition-all whitespace-nowrap leading-none flex items-center gap-4 text-[10rem] ${strong ? 'text-red-500 text-[12.5rem]' : ''}`">
          <template v-if="displayNumbers.length">
            <template v-for="(n, i) in displayNumbers" :key="`${n}-${i}`">
              <span>{{ n }}</span>
              <span v-if="i < displayNumbers.length - 1" class="opacity-70">/</span>
            </template>
          </template>
          <span v-else>--</span>
        </div>
        <div class="flex gap-4">
          <button @click="start" :disabled="timer" class="btn btn-xl btn-primary">Start!</button>
          <button v-if="showTriple" @click="triple" :disabled="timer" class="btn btn-xl btn-accent">Triple</button>
          <button v-if="showQuiz" @click="openQuizModal" class="btn btn-xl btn-secondary">quiz!</button>
        </div>
      </div>
      <div>
        <img
          src="./assets/images/qrcode.png"
          class="opacity-100 w-[20rem] cursor-pointer"
          @click="showQuiz = !showQuiz"
        />
      </div>
    </div>

    <QuizModal ref="quizModal" />

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
