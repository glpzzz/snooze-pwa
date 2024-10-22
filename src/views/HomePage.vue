<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Snooze</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Snooze</ion-title>
        </ion-toolbar>
      </ion-header>

      <img alt="Image of Titan"
           src="https://a.storyblok.com/f/152976/1254x836/2bba06502c/chihuahuas.jpg/m/1200x630/filters:focal(585x370:586x371)"/>

      <ion-list lines="full">

        <ion-item>
          <ion-label>
            <h1>Titán</h1>
            <p>Perro / Chihuahua</p>
          </ion-label>
        </ion-item>

        <ion-item v-for="result in results" :key="result.id">
          <ion-label>{{ result.text }}</ion-label>
        </ion-item>

      </ion-list>

      <div v-if="results.length === 0" class="ion-text-center ion-padding">
        Comience a grabar para añadir notas de la consulta.
      </div>
      <ion-button v-else expand="block" @click="finish" :disabled="isProcessing || isRecording">Generar Registro</ion-button>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button
            :color="isRecording ? 'warning' : 'danger'"
            @click="toggleRecording">
          <ion-icon
              :icon="isRecording ? stop : recording"></ion-icon>
        </ion-fab-button>
      </ion-fab>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonFab,
  IonFabButton,
  IonIcon,
  IonButton,
} from '@ionic/vue';

import {
  stop,
  recording
} from 'ionicons/icons';
import {ref, computed} from "vue";
import {VoiceRecorder} from "capacitor-voice-recorder";
import {useOpenAi} from "@/composables/useOpenAi";

const {transcribeAudioBase64} = useOpenAi();
const isRecording = ref<boolean>(false);
const results = ref<{}>([]);
const isProcessing = computed(() => {
  return results.value.some(result => result.status === 'pending');
});

const toggleRecording = async () => {

  let hasPermission = await VoiceRecorder.hasAudioRecordingPermission();

  if (!hasPermission.value) {
    await VoiceRecorder.requestAudioRecordingPermission();
  }

  hasPermission = await VoiceRecorder.hasAudioRecordingPermission();
  if (!hasPermission.value) {
    alert('no permission');
    return;
  }

  isRecording.value = !isRecording.value;

  if (isRecording.value) {
    try {
      await VoiceRecorder.startRecording();
    } catch (e) {
      console.error(e);
    }
  } else {
    try {
      VoiceRecorder.stopRecording().then((result) => {

        const recordId = Date.now();
        result = {
          ...result.value,
          id: recordId,
          text: 'processing...',
          status: 'pending',
        };

        results.value.push(result);
        transcribeAudioBase64(result.id, result.recordDataBase64, result.mimeType).then((text) => {
          result.text = text;
          result.status = 'done';
          results.value = [...results.value];
        });

      });
    } catch (e) {
      console.error(e);
    }
  }
};

const finish = () => {
  console.log('finish');
  const allNotes = results.value.reduce((acc, result) => {
    acc.push(result.text);
    return acc;
  }, []).join('. ');
  alert(allNotes);
}

</script>

<style scoped>
</style>
