<script setup lang="ts">
import { ref } from "vue";

useHead({
  title: "Conversor",
});

const selectedFile = ref<File | null>(null);
const fileContent = ref("");

const readFile = () => {
  if (selectedFile.value) {
    const reader = new FileReader();
    reader.onload = (event) => {
      fileContent.value = event.target?.result as string;
    };
    reader.readAsText(selectedFile.value);
  }
};

const questions = ref<Array<Array<{ question: string; answer: string }>>>([]);

const pacients = computed(() =>
  questions.value.map((v, i) => ({ label: `Paciente ${i + 1}`, value: i })),
);

const questionsComputed = computed(() => [questions.value[selected.value]]);

const convert = () => {
  const lines = fileContent.value.split("\n");
  const headers = lines[0].split("\t");

  lines.splice(0, 1);
  questions.value = lines
    .map((line) => line.split("\t"))
    .map((answers) =>
      answers
        .map((answer, i) => ({ question: headers[i], answer }))
        .filter((v) => !!v.answer),
    );

  setTimeout(() => copyText(), 500);
};
const selected = ref(0);
const copyText = async () => {
  try {
    // Obtém o HTML interno da div
    const html = document.getElementById("to-copy")!.innerHTML;

    // Cria um novo Blob com o conteúdo HTML
    const blob = new Blob([html], { type: "text/html" });
    const clipboardItem = new ClipboardItem({ "text/html": blob });

    // Usa a API Clipboard para copiar o HTML
    await navigator.clipboard.write([clipboardItem]);
  } catch (err) {
    alert("Erro ao enviar para a área de transferência!");
  }
};
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" lg="8">
        <v-card elevation="2">
          <v-card-title class="text-center">
            Conversor TSV - Texto
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col>
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
                    @click="convert"
                    >Converter</v-btn
                  >
                </v-form>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center" v-show="questions.length">
      <v-col cols="12" lg="8">
        <v-card elevation="2">
          <v-card-title class="text-center">
            <h2>Resultado:</h2>
            <h4>Texto enviado para a área de transferência!</h4></v-card-title
          >
          <v-divider></v-divider>
          <v-select
            v-model="selected"
            item-title="label"
            item-value="value"
            label="Selecione o paciente"
            :items="pacients"
          />
          <v-card-text id="to-copy">
            <template v-for="(question, i) in questionsComputed">
              <v-row v-for="qa in question" no-gutters>
                <v-col cols="12">
                  <h3>
                    {{ qa.question }}
                  </h3>
                </v-col>
                <v-col cols="12">
                  {{ qa.answer }}
                </v-col>
                <v-divider class="my-2" />
              </v-row>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
