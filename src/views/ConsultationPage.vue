<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title v-if="data">{{ new Date(data.date).toLocaleString() }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">

      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title v-if="data" size="large">{{ new Date(data.date).toLocaleString() }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list lines="full">

        <ion-item-group>
          <ion-item-divider>
            <ion-label>Paciente</ion-label>
          </ion-item-divider>

          <ion-item v-if="!data">
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
              <h2>{{ data.patient.name }}</h2>
              <p>{{ data.patient.species }}</p>
            </ion-label>
          </ion-item>
        </ion-item-group>
      </ion-list>

      <template v-if="dataStatus || data?.state === 'Final'">
        <template v-if="dataStatus?.isRecording">
          <p v-if="dataStatus.transcriptions.length === 0" class="ion-text-center ion-padding">
            Comience a grabar para añadir notas de la consulta.
          </p>
          <ion-list v-else>
            <ion-item-group>
              <ion-item-divider>
                <ion-label>Notas de consulta</ion-label>
              </ion-item-divider>
              <ion-item v-for="result in dataStatus.transcriptions" :key="result.id">
                <ion-label>
                  {{ result.text }}
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <ion-button expand="block" @click="finishRecording">
                    Terminar grabación
                  </ion-button>
                </ion-label>
              </ion-item>
            </ion-item-group>
          </ion-list>
          <ion-fab slot="fixed" vertical="bottom" horizontal="end">
            <ion-fab-button
                :color="isRecordingAudio ? 'warning' : 'danger'"
                @click="toggleRecording">
              <ion-icon :icon="isRecordingAudio ? stop : recording"></ion-icon>
            </ion-fab-button>
          </ion-fab>
        </template>
        <p v-else-if="dataStatus?.isTranslating || (dataStatus?.isReviewAccepted && dataStatus?.isPersisting)"
           class="ion-text-center ion-padding">
          Procesando las notas de la consulta. <br>
          Estará listo en unos minutos.
        </p>
        <template v-if="dataStatus?.isReviewing">
          <p>display object editor</p>
          <ion-button expand="block" @click="sendCorrections">
            Enviar
          </ion-button>
          <ion-button color="success" expand="block" @click="closeConsultation">
            Terminar
          </ion-button>
        </template>
        <template v-else-if="dataStatus?.isCompleted || data.state=='Final'">
          <code v-if="dataStatus?.isCompleted">
            {{ JSON.stringify(dataStatus.structuredTranslation) }}
          </code>
          <code v-else>
            {{ JSON.stringify(data.file.content) }}
          </code>
        </template>
      </template>

      <ion-alert
          :is-open="currentError != null"
          :header="currentError?.header"
          :sub-header="currentError?.subHeader"
          :message="currentError?.message"
          @didDismiss="currentError = null"
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
  IonButtons,
  IonBackButton,
  IonSkeletonText,
  IonThumbnail,
  IonToast,
  IonSpinner, IonAlert, loadingController,
} from '@ionic/vue';
import {
  stop,
  recording
} from 'ionicons/icons';
import {useRoute, useRouter} from "vue-router";
import {ref, computed, onMounted, onUnmounted, watch} from "vue";
import {VoiceRecorder} from "capacitor-voice-recorder";
import VueMarkdown from "vue-markdown-render";
import {useBackend} from "@/composables/useBackend";
import {Configuration, SnoozeApiApi} from "@/generated/openapi-snooze";
import {EventSourcePolyfill} from 'event-source-polyfill';

const config = new Configuration({
  basePath: import.meta.env.VITE_BACKEND_BASE_URL,
  apiKey: import.meta.env.VITE_BACKEND_API_KEY,
});

const apiClient = new SnoozeApiApi(config);

const route = useRoute();
const router = useRouter();

const {id} = route.params;
const data = ref<any | null>(null);
const dataStatusChannel = ref<any | null>(null);
const dataStatus = ref<any | null>(null);
const isRecordingAudio = ref<boolean>(false);
const currentError = ref<any | null>(null);
const loading = ref<boolean>(false);
let loadingDialog = null;

watch(loading, async (oldValue, newValue) => {
  if (loading.value) {
    loadingDialog.present();
  } else {
    loadingDialog.dismiss();
  }
});

onMounted(async () => {
  loadingDialog = await loadingController.create({
    message: 'Please wait...',
  });

  loading.value = true;
  await apiClient.consultationDetails(id)
      .then(response => {
        data.value = response.data;
        console.log(response.data);

        if (data.value.state !== 'Final') {
          console.log('opening SSE channel');
          dataStatusChannel.value = new EventSourcePolyfill(`${config.basePath}/consultations/${id}/sse`, {
            headers: {
              'X-API-KEY': config.apiKey,
            }
          });

          dataStatusChannel.value.onmessage = (event) => {
            console.log(event, JSON.parse(event.data));
            dataStatus.value = JSON.parse(event.data);
          };

          dataStatusChannel.value.onerror = (err) => {
            console.error(err);
          }
        }
      })
      .catch(error => {
        displayError(error);
      });
  loading.value = false;
});

onUnmounted(() => {
  if (dataStatusChannel.value) {
    console.log('closing the channel');
    dataStatusChannel.value.close();
  }
});

const toggleRecording = async () => {

  let hasPermission = await VoiceRecorder.hasAudioRecordingPermission();

  if (!hasPermission.value) {
    try {
      await VoiceRecorder.requestAudioRecordingPermission();
    } catch (e) {
      displayError(e);
    }
  }

  hasPermission = await VoiceRecorder.hasAudioRecordingPermission();
  if (!hasPermission.value) {
    alert('You need to allow to record audio.');
    return;
  }

  isRecordingAudio.value = !isRecordingAudio.value;

  if (isRecordingAudio.value) {
    try {
      await VoiceRecorder.startRecording();
    } catch (e) {
      displayError(e);
    }
  } else {
    try {

      VoiceRecorder.stopRecording().then(async (result) => {

        const addRecordingDto = {
          recording: result.value.recordDataBase64
        };

        console.log(id, addRecordingDto);
        dataStatus.value.transcriptions.push({
          id: 'lolo',
          text: '...'
        });

        await apiClient.addRecording(id, addRecordingDto)
            .then(response => {
              console.log(response);
            })
            .catch(error => {
              displayError(error);
            });
      });
    } catch (e) {
      displayError(e);
    }
  }
};

const finishRecording = async () => {
  loading.value = true;
  await apiClient.finishConsultationRecordings(id)
      .then(response => {
        console.log(response);
        loading.value = false;
      })
      .catch(error => {
        loading.value = false;
        displayError(error);
      });
}

const sendCorrections = async () => {
  loading.value = true;
  await apiClient.correctConsultationTranslation(id, {
    correctedTranslation: '',
  })
      .then(response => {
        console.log(response);
        loading.value = false;
      })
      .catch(error => {
        loading.value = false;
        displayError(error);
      });
}

const closeConsultation = async () => {
  loading.value = true;
  await apiClient.closeConsultation(id)
      .then(response => {
        console.log(response);
        loading.value = false;
        router.push('/consultations');
      })
      .catch(error => {
        loading.value = false;
        displayError(error);
      });
}

const displayError = (e) => {
  currentError.value = {
    header: 'Error',
    subHeader: e.name,
    message: e.message,
  }
}

</script>

<style scoped>
</style>
