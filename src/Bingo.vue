<script setup>
import { ref } from 'vue';

const selectedNumbers = ref([]);

let array = Array.from({ length: 75}, (_, i) => i + 1);

const numbers = Array.from({ length: 75}, (_, i) => i + 1);


function start() {
    const index = Math.floor(Math.random() * array.length);
    const selectedNumber = array[index];

    selectedNumbers.value.push(selectedNumber);

    array.splice(index, 1);
}


function selectManually(number) {
    if (!selectedNumbers.value.includes(number)) {
        selectedNumbers.value.push(number);
    }
}

function reset() {
    selectedNumbers.value = [];
    array = Array.from({ length: 75}, (_, i) => i + 1);
}
</script>

<template>
    <h1>Bingo</h1>
    <button @click="start" :disabled="array.length === 0">Start!</button>
    
    <h2>{{ selectedNumbers.length > 0 ? selectedNumbers[selectedNumbers.length - 1] : 'なし' }}</h2>

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
    <button @click="reset">Reset</button>
</template>

<style scoped>
.number-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
    max-width: 100%;
}

.number-list h3 {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.number-list h3:hover {
    background-color: lightblue;
}
</style>
