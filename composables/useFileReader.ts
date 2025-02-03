import { ref } from 'vue'

export function useFileReader() {
  const selectedFile = ref<File | null>(null)
  const fileContent = ref('')

  const readFile = () => {
    if (selectedFile.value) {
      const reader = new FileReader()
      reader.onload = (event) => {
        fileContent.value = event.target?.result as string
      }
      reader.readAsText(selectedFile.value)
    }
  }

  return {
    selectedFile,
    fileContent,
    readFile
  }
}
