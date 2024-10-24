<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title v-if="consultation">{{ new Date(consultation.date).toLocaleString() }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">

      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title v-if="consultation" size="large">{{ new Date(consultation.date).toLocaleString() }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list lines="full">

        <ion-item-group>
          <ion-item-divider>
            <ion-label>Paciente</ion-label>
          </ion-item-divider>

          <ion-item v-if="!consultation">
            <ion-thumbnail slot="start">
              <ion-skeleton-text :animated="true"></ion-skeleton-text>
            </ion-thumbnail>
            <ion-label>
              <h3>
                <ion-skeleton-text :animated="true" style="width: 80%;"></ion-skeleton-text>
              </h3>
              <p>
                <ion-skeleton-text :animated="true" style="width: 60%;"></ion-skeleton-text>
              </p>
              <p>
                <ion-skeleton-text :animated="true" style="width: 30%;"></ion-skeleton-text>
              </p>
            </ion-label>
          </ion-item>
          <ion-item v-else>
            <ion-thumbnail slot="start">
              <img
                  src="https://docs-demo.ionic.io/assets/madison.jpg"
                  alt="The Wisconsin State Capitol building in Madison, WI at night"
              />
            </ion-thumbnail>
            <ion-label>
              <h2>{{ consultation.patientName }}</h2>
              <p>{{ consultation.species }}</p>
            </ion-label>
          </ion-item>
        </ion-item-group>

        <ion-item-group v-if="consultationStatus?.isRecording">
          <ion-item-divider>
            <ion-label>Notas de consulta</ion-label>
          </ion-item-divider>
          <ion-item v-if="!consultationStatus">
            <ion-skeleton-text :animated="true"></ion-skeleton-text>
          </ion-item>
          <ion-item v-else v-for="result in results" :key="result.id"
                    :color="result.status === 'error' ? 'danger' : ''">
            <ion-label v-if="result.status === 'pending'">
              <ion-skeleton-text v-if="result.status==='pending'" :animated="true"></ion-skeleton-text>
            </ion-label>
            <ion-label v-else>
              {{ result.text }}
            </ion-label>
          </ion-item>
        </ion-item-group>

        <ion-item-group v-if="consultation?.isCompleted">
          <ion-item-divider>
            <ion-label>Procesado</ion-label>
          </ion-item-divider>
          <ion-item>
            <ion-label>
              <code>
                {{ consultation.detailsJson }}
              </code>
            </ion-label>
          </ion-item>
        </ion-item-group>

      </ion-list>

      <template v-if="consultationStatus?.isRecording">
        <p v-if="consultationStatus && results.length === 0" class="ion-text-center ion-padding">
          Comience a grabar para añadir notas de la consulta.
        </p>

        <ion-button v-if="results.length !== 0 && consultationStatus.isRecording" expand="block" @click="finish"
                    :disabled="isProcessing || isRecording || isCompleting">
          <ion-spinner v-if="isCompleting" name="dots"></ion-spinner>
          <span v-else>Generar Registro de Consulta</span>
        </ion-button>

        <ion-fab v-if="consultationStatus?.isRecording" slot="fixed" vertical="bottom"
                 horizontal="end">
          <ion-fab-button
              :color="isRecording ? 'warning' : 'danger'"
              :disabled="!consultation"
              @click="toggleRecording">
            <ion-icon :icon="isRecording ? stop : recording"></ion-icon>
          </ion-fab-button>
        </ion-fab>
      </template>
      <p v-else-if="consultationStatus?.isTranslating" class="ion-text-center ion-padding">
        Procesando las notas de la consulta. <br>
        Estará listo en unos minutos.
      </p>

      <!-- Success Toast -->
      <ion-toast
          :is-open="isToastOpen"
          message="Notas de consulta enviadas"
          duration="3000"
          position="top"
          color="success"
          @didDismiss="onCompleteSuccess"
      />

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
  IonItemGroup,
  IonItemDivider,
  IonLabel,
  IonFab,
  IonFabButton,
  IonIcon,
  IonButton,
  IonSkeletonText,
  IonThumbnail,
  IonToast,
  IonSpinner,
} from '@ionic/vue';

import {
  stop,
  recording
} from 'ionicons/icons';
import {useRoute, useRouter} from "vue-router";
import {ref, computed, onMounted} from "vue";
import {VoiceRecorder} from "capacitor-voice-recorder";
import {useBackend} from "@/composables/useBackend";

const route = useRoute();
const router = useRouter();
const {getConsultation, getConsultationStatus, transcribeAudioBase64, completeConsultation} = useBackend();

const {id} = route.params;
const isRecording = ref<boolean>(false);
const consultation = ref<object>(null)
const consultationStatus = ref<object>(null)
const results = ref<{}>([]);
const isProcessing = computed(() => {
  return results.value.some(result => result.status === 'pending');
});

const isCompleting = ref<boolean>(false);
const isToastOpen = ref<boolean>(false);

onMounted(async () => {

  try {
    consultation.value = await getConsultation(id);

    if (!consultation.value.isCompleted) {
      consultationStatus.value = await getConsultationStatus(id);
      consultationStatus.value = consultationStatus.value ? consultationStatus.value : {}

      if (consultationStatus.value.transcriptions) {
        for (const transcription of consultationStatus.value.transcriptions) {
          results.value.push({
            id: `${consultation.value.id}-${Math.random()}`,
            text: transcription,
            status: 'done',
          })
        }
      }
    }

  } catch (e) {
    console.error(e);
  }

})

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
          text: '',
          status: 'pending',
        };

        results.value.push(result);
        transcribeAudioBase64(id, result.recordDataBase64, result.mimeType)
            .then((text) => {
              result.text = text !== null ? text : 'failed';
              result.status = text !== null ? 'done' : 'error';
              results.value = [...results.value];
            })
            .catch((e) => {
              result.text = e.message;
              result.status = 'error';
            })
            .finally(() => {
              results.value = [...results.value];
            });
      });
    } catch (e) {
      console.error(e);
    }
  }
};

const finish = async () => {
  try {
    isCompleting.value = true;
    await completeConsultation(id);
    isToastOpen.value = true;
  } catch (e) {
    console.error(e);
  }
}

const onCompleteSuccess = () => {
  router.push('/consultation');
}

</script>

<style scoped>
</style>
