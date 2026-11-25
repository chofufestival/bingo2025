import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useBingoStore = defineStore('bingo', () => {
  const storage = useLocalStorage('bingoHistory', [])
  const history = ref(storage.value)
  const currentResults = ref([])
  const timer = ref(null)

  function commitResults(results) {
    currentResults.value = [...results]
    history.value.push(...results)
    storage.value = [...history.value]
  }

  function start(count = 1) {
    if (timer.value) return
    count = Math.min(5, Math.max(1, Math.trunc(Number(count)) || 1))
    const available = [...Array(76).keys()].filter(num => num && !history.value.includes(num))
    if (available.length < count) return

    const select = () => {
      const pool = [...available]
      for (let i = 0; i < count; i++) {
        const randomIndex = i + Math.floor(Math.random() * (pool.length - i))
        const selected = pool[i]
        pool[i] = pool[randomIndex]
        pool[randomIndex] = selected
      }
      return pool.slice(0, count)
    }

    currentResults.value = select()
    let loop = 0
    const stopAt = Math.floor(Math.random() * 10) + 20
    timer.value = setInterval(() => {
      currentResults.value = select()
      loop++
      if (loop > stopAt) {
        clearInterval(timer.value)
        timer.value = null
        commitResults(currentResults.value)
      }
    }, 100)
  }

  function toggle(n) {
    if (timer.value) return
    if (history.value.includes(n)) {
      history.value = history.value.filter(v => v !== n)
      currentResults.value = currentResults.value.filter(v => v !== n)
      storage.value = [...history.value]
    } else {
      commitResults([n])
    }
  }

  function reset() {
    clearInterval(timer.value)
    history.value = []
    currentResults.value = []
    timer.value = null
    storage.value = []
  }

  return { storage, history, currentResults, timer, start, toggle, reset }
})
