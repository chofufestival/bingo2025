<script setup>
import { ref } from 'vue';
import Header from './components/Header.vue';

const selectedNumbers = ref([]);

let array = Array.from({ length: 75 }, (_, i) => i + 1);

const numbers = Array.from({ length: 75 }, (_, i) => i + 1);

const selectedNumber = ref(0);

function start() {
    let roopCount = 0;
    let intervalId = setInterval(() => {
        const index = Math.floor(Math.random() * array.length);
        selectedNumber.value = array[index];
        roopCount += 1;

        if (roopCount >= 20) {
            clearInterval(intervalId);
            selectedNumbers.value.push(selectedNumber.value);
            array.splice(index, 1);
        }
    }, 100);
}

function selectManually(number) {
    if (!selectedNumbers.value.includes(number)) {
        selectedNumbers.value.push(number);
        array.splice(array.indexOf(number), 1);
    }
}

function reset() {
    selectedNumbers.value = [];
    array = Array.from({ length: 75 }, (_, i) => i + 1);
    selectedNumber.value = 0;
}
</script>

<template>
  <div class="flex flex-col h-screen">
    <Header />
    <div class="grow flex flex-col justify-center items-center">
      <div class="font-bold font-monospace text-[10rem] my-6">
        {{ selectedNumber !== 0 ? selectedNumber : '--' }}
      </div>
      <div class="center">
        <button @click="start" :disabled="array.length === 0" class="btn btn-xl btn-primary">Start!</button>
      </div>
    </div>
    <div class="grid grid-cols-5 gap-6 p-6">
      <div v-for="col in 5" class="grid grid-cols-3 gap-2">
        <button
          v-for="number in Array.from({ length: 15 }, (_, i) => i + 1 + (col - 1) * 15)" 
          :key="number"
          @click="selectManually(number)"
          :class="`btn btn-xl text-3xl py-8 m-0 rounded-sm ${selectedNumbers.includes(number) && 'btn-primary'}`"
          >
          {{ number }}
        </button>
      </div>
    </div>
  </div>
</template>
