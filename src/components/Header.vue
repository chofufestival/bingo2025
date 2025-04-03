<script setup>
import { Icon } from '@iconify/vue'
import { useBingoStore } from '../stores/bingo.js'

const { reset } = useBingoStore()
</script>

<template>
  <div class="flex p-6 justify-center relative">
    <h1 class="font-bold text-3xl">○調Bingo</h1>
    <div class="absolute top-0 right-0 flex items-center h-full p-6">
      <button @click="reset" class="btn btn-ghost px-2">
        <Icon icon="mdi:autorenew" class="size-8" />
      </button>
    </div>
  </div>
</template>
