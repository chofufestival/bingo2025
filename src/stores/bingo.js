import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useBingoStore = defineStore('bingo', () => {
  const storage = useLocalStorage('bingoHistory', [])
  const history = ref(storage.value)
  const timer = ref(null)

  function start() {
    if (timer.value) return
    const available = [...Array(76).keys()].filter(n => n && !history.value.includes(n))
    if (!available.length) return
    history.value.push(available[Math.floor(Math.random() * available.length)])
    let loop = 0
    timer.value = setInterval(() => {
      history.value[history.value.length - 1] = available[Math.floor(Math.random() * available.length)]
      loop++
      if (loop > Math.floor(Math.random() * 10) + 20) {
        clearInterval(timer.value)
        timer.value = null
        storage.value = history.value
      }
    }, 100)
  }

  function toggle(n) {
    if (history.value.includes(n)) {
      history.value = history.value.filter(v => v !== n)
    } else {
      history.value.push(n)
    }
    storage.value = history.value
  }

  function reset() {
    history.value = []
    timer.value = null
    storage.value = []
  }

  return { storage, history, timer, start, toggle, reset }
})
