<script setup lang="ts">
import { watch } from 'vue'
import { useFileReader } from '~/composables/useFileReader'
import { useQuestions } from '~/composables/useQuestions'
import { useClipboard } from '~/composables/useClipboard'

useHead({
  title: "Conversor",
})

const { selectedFile, fileContent, readFile } = useFileReader()
const { questions, selected, namePosition, pacients, questionsComputed, convert } = useQuestions()
const { copyToClipboard } = useClipboard()

watch(selected, async () => {
  await new Promise(resolve => setTimeout(resolve, 200))
  const success = await copyToClipboard('to-copy')
  if (!success) {
    alert("Erro ao enviar para a área de transferência!")
  }
})

const handleConvert = () => {
  if (fileContent.value) {
    convert(fileContent.value)
  }
}
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" lg="8">
        <v-card elevation="2">
          <v-card-title class="text-center">Conversor TSV - Texto</v-card-title>
          <v-divider />
          <v-card-text>
            <v-form>
              <VFileInput
                v-model="selectedFile"
                density="compact"
                label="Escolher arquivo .tsv"
                accept=".tsv"
                @change="readFile"
              />
              <VTextarea
                v-model="fileContent"
                label="Ou se preferir, cole aqui o conteúdo:"
              />
              <v-btn
                :disabled="!fileContent"
                color="primary"
                block
                @click="handleConvert"
              >
                Converter
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-show="questions.length" justify="center">
      <v-col cols="12" lg="8">
        <v-card elevation="2">
          <v-card-title class="text-center">
            <h2>Resultado:</h2>
            <h4>Texto enviado para a área de transferência!</h4>
          </v-card-title>
          <v-divider />

          <v-row>
            <v-col cols="4">
              <VTextField
                label="Coluna com o nome do paciente"
                v-model.number="namePosition"
              />
            </v-col>
            <v-col>
              <v-autocomplete
                v-model="selected"
                :items="pacients"
                item-title="label"
                item-value="value"
                label="Selecione o paciente"
                no-data-text="Selecione o paciente"
              />
            </v-col>
          </v-row>

          <v-card-text id="to-copy">
            <template v-for="question in questionsComputed">
              <v-row v-for="qa in question" no-gutters>
                <v-col cols="12">
                  <h3>{{ qa.question }}</h3>
                </v-col>
                <v-col cols="12">
                  {{ qa.answer }}
                </v-col>
              </v-row>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
