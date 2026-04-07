import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useBingoStore = defineStore('bingo', () => {
  const storage = useLocalStorage('bingoHistory', [])
  const history = ref(storage.value)
  const displayNumbers = ref(history.value.length ? [history.value[history.value.length - 1]] : [])
  const timer = ref(null)

  function pickUnique(available, count) {
    const pool = [...available]
    const picked = []
    for (let i = 0; i < count && pool.length; i++) {
      const idx = Math.floor(Math.random() * pool.length)
      picked.push(pool[idx])
      pool.splice(idx, 1)
    }
    return picked
  }

  function start() {
    if (timer.value) return
    const available = [...Array(76).keys()].filter(n => n && !history.value.includes(n))
    if (!available.length) return

    let current = available[Math.floor(Math.random() * available.length)]
    displayNumbers.value = [current]
    let loop = 0
    timer.value = setInterval(() => {
      current = available[Math.floor(Math.random() * available.length)]
      displayNumbers.value = [current]
      loop++
      if (loop > Math.floor(Math.random() * 10) + 20) {
        clearInterval(timer.value)
        timer.value = null
        history.value.push(current)
        storage.value = [...history.value]
      }
    }, 100)
  }

  function triple() {
    if (timer.value) return
    const available = [...Array(76).keys()].filter(n => n && !history.value.includes(n))
    if (!available.length) return

    const shortLoop = () => Math.floor(Math.random() * 5) + 8

    const drawCount = Math.min(3, available.length)
    const confirmed = []

    const runStep = () => {
      const remain = available.filter(n => !confirmed.includes(n))
      let current = remain[Math.floor(Math.random() * remain.length)]
      displayNumbers.value = [...confirmed, current]
      let loop = 0
      const maxLoop = shortLoop()

      timer.value = setInterval(() => {
        current = remain[Math.floor(Math.random() * remain.length)]
        displayNumbers.value = [...confirmed, current]
        loop++
        if (loop > maxLoop) {
          clearInterval(timer.value)
          confirmed.push(current)
          if (confirmed.length >= drawCount) {
            timer.value = null
            history.value.push(...confirmed)
            storage.value = [...history.value]
          } else {
            runStep()
          }
        }
      }, 80)
    }

    runStep()
  }

  function toggle(n) {
    if (history.value.includes(n)) {
      history.value = history.value.filter(v => v !== n)
    } else {
      history.value.push(n)
    }
    displayNumbers.value = history.value.length ? [history.value[history.value.length - 1]] : []
    storage.value = [...history.value]
  }

  function reset() {
    history.value = []
    displayNumbers.value = []
    timer.value = null
    storage.value = []
  }

  return { storage, history, displayNumbers, timer, start, triple, toggle, reset }
})
