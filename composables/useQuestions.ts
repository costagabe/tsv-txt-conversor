import { ref, computed } from 'vue'

interface QA {
  question: string
  answer: string
}

export function useQuestions() {
  const questions = ref<Array<Array<QA>>>([])
  const selected = ref<number>()
  const namePosition = ref(3)

  const validNamePosition = computed(() => namePosition.value - 1 || 0)

  const pacients = computed(() =>
    questions.value.map((v, i) => ({
      label: v[validNamePosition.value].answer,
      value: i,
    }))
  )

  const questionsComputed = computed(() => 
    selected.value !== undefined ? [questions.value[selected.value]] : []
  )

  const convert = (content: string) => {
    const lines = content.split("\n")
    const headers = lines[0].split("\t")

    lines.splice(0, 1)
    questions.value = lines
      .filter((line) => line.trim() !== "")
      .map((line) => line.split("\t"))
      .map((answers) =>
        answers
          .map((answer, i) => ({ question: headers[i], answer }))
          .filter((v) => !!v.answer)
      )
  }

  return {
    questions,
    selected,
    namePosition,
    validNamePosition,
    pacients,
    questionsComputed,
    convert
  }
}
