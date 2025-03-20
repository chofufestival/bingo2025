<script setup>
import { ref } from 'vue';

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
    <div class="center">
        <h1>〇調Bingo</h1>
    </div>
    
    <h2>
        {{ selectedNumber !== 0 ? selectedNumber : '' }}
    </h2>

    <div class="center">
        <button @click="start" :disabled="array.length === 0">Start!</button>
    </div>
    
    <div class="number-list">
        <h3
            v-for="number in numbers" 
            :key="number"
            @click="selectManually(number)"
            :style="{ backgroundColor: selectedNumbers.includes(number) ? 'lightgreen' : 'lightgray' }"
        >
            {{ number }}
        </h3>
    </div>
    <div class="center">
        <button @click="reset">Reset</button>
    </div>

</template>

<style scoped>
.center {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 40px;
}

h1 {
    font-size: 3rem;
    font-weight: bold;
    color: #333;
    text-align: center;
}

button {
    background-color: #4CAF50;
    color: white;
    font-size: 2rem;
    padding: 20px 40px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    width: 300px;
    height: 80px;
    font-weight: bold;
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

button:hover {
    background-color: #45a049;
}

.number-list {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
    max-width: 100%;
    padding: 20px 0;
}

.number-list h3 {
    width: 60px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    font-weight: bold;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
    background-color: lightgray;
}

.number-list h3:hover {
    transform: scale(1.1);
}

h2 {
    font-size: 10rem;
    font-weight: bold;
    color: #333;
    margin-top: 30px;
    text-align: center;
}
</style>
