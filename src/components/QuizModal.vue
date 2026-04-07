<script setup>
import { computed, ref } from 'vue'
import quizList from '../quiz.json'

const modal = ref(null)
const currentQuiz = ref(null)
const currentIndex = ref(0)
const selectedOption = ref('')
const choiceResult = ref('')
const incorrectOptions = ref([])
const answeredCorrectly = ref(false)
const showFreeAnswer = ref(false)

const isMultipleChoice = computed(() => currentQuiz.value?.type === 'multiple-choice')
const isFreeResponse = computed(() => currentQuiz.value?.type === 'free-response')

function pickQuiz() {
  if (!quizList.length) {
    currentQuiz.value = null
    return
  }
  currentQuiz.value = quizList[currentIndex.value]
}

function resetChoiceState() {
  selectedOption.value = ''
  choiceResult.value = ''
  incorrectOptions.value = []
  answeredCorrectly.value = false
  showFreeAnswer.value = false
}

function open() {
  if (!currentQuiz.value) {
    currentIndex.value = 0
    pickQuiz()
  }
  resetChoiceState()
  modal.value?.showModal()
}

function selectOption(option) {
  if (!isMultipleChoice.value || answeredCorrectly.value) return
  if (incorrectOptions.value.includes(option)) return

  if (option === currentQuiz.value.answer) {
    selectedOption.value = option
    answeredCorrectly.value = true
    choiceResult.value = '正解！'
    return
  }

  incorrectOptions.value.push(option)
  choiceResult.value = '不正解'
}

function revealFreeAnswer() {
  if (!isFreeResponse.value) return
  showFreeAnswer.value = true
}

function nextQuiz() {
  if (!quizList.length) return
  currentIndex.value = (currentIndex.value + 1) % quizList.length
  resetChoiceState()
  pickQuiz()
}

defineExpose({ open })
</script>

<template>
  <dialog ref="modal" class="modal">
    <div class="modal-box w-[94vw] max-w-6xl max-h-[86vh] overflow-y-auto">

      <div v-if="currentQuiz" class="space-y-5">
        <p class="text-5xl leading-relaxed font-semibold">{{ currentQuiz.question }}</p>

        <div v-if="isMultipleChoice" class="grid grid-cols-1 gap-3">
          <button
            v-for="option in currentQuiz.options"
            :key="option"
            class="btn btn-outline justify-start text-3xl py-10"
            :class="[
              incorrectOptions.includes(option) ? 'btn-disabled opacity-60' : '',
              selectedOption === option && choiceResult === '正解！' ? 'btn-primary text-primary-content' : ''
            ]"
            :disabled="incorrectOptions.includes(option) || answeredCorrectly"
            @click="selectOption(option)"
          >
            {{ option }}
          </button>
          <div v-if="choiceResult === '正解！'" class="alert alert-success">
            <span class="text-3xl font-bold">正解！</span>
          </div>
          <div v-else-if="choiceResult === '不正解'" class="alert alert-error">
            <span class="text-3xl font-bold">不正解</span>
          </div>
        </div>

        <div v-else-if="isFreeResponse" class="space-y-3">
          <button class="btn btn-outline text-3xl py-10" @click="revealFreeAnswer">答えを見る</button>
          <div v-if="showFreeAnswer" class="alert alert-info">
            <span class="text-3xl font-bold">正解: {{ currentQuiz.answer }}</span>
          </div>
        </div>
      </div>

      <div v-else class="alert alert-warning mt-2">
        <span>クイズデータがありません。</span>
      </div>

      <div class="modal-action mt-6">
        <button class="btn btn-ghost text-2xl" @click="nextQuiz">次の問題</button>
        <form method="dialog">
          <button class="btn btn-primary text-2xl">閉じる</button>
        </form>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop bg-black/60">
      <button>close</button>
    </form>
  </dialog>
</template>
