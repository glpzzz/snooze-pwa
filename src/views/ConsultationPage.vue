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
        <ConsultationHeader :data="data"/>
        <ion-item v-if="!dataStatus && data?.state!='Final'">
          <ion-skeleton-text :animated="true"/>
        </ion-item>
        <ConsultationTranscriptionsList
            v-if="dataStatus?.isRecording || dataStatus?.isTranslating"
            :dataStatus="dataStatus"
            @btn-finish-recordings-clicked="finishRecording"/>
        <ConsultationEditor
            v-else-if="dataStatus?.isReviewing"
            :data="data" :schema="dataSchema"
            @btn-send-corrections-clicked="sendCorrections"/>
        <ConsultationViewer
            v-else-if="dataStatus?.isCompleted || data?.state=='Final'"
            :content="dataStatus?.isCompleted ? dataStatus?.structuredTranslation : data?.file?.content"/>
      </ion-list>

      <ion-fab v-if="dataStatus?.isRecording || dataStatus?.isReviewing" slot="fixed" vertical="bottom"
               horizontal="end">
        <ion-fab-button
            v-if="dataStatus?.isRecording"
            :color="isRecordingAudio ? 'warning' : 'danger'"
            @click="toggleRecording">
          <ion-icon
              :ios="isRecordingAudio ? stopOutline : recordingOutline"
              :md="isRecordingAudio ? stopSharp : recordingSharp"/>
        </ion-fab-button>
        <ion-fab-button
            v-else-if="dataStatus?.isReviewing"
            color="success"
            @click="closeConsultation">
          <ion-icon :ios="sendOutline" :md="sendSharp"/>
        </ion-fab-button>
      </ion-fab>

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
  IonSkeletonText,
  IonFab,
  IonFabButton,
  IonIcon,
  IonButtons,
  IonBackButton,
  IonAlert,
} from '@ionic/vue';
import {
  stopOutline, stopSharp,
  recordingOutline, recordingSharp,
  sendOutline, sendSharp,
} from 'ionicons/icons';
import {useRoute, useRouter} from "vue-router";
import {ref, onMounted, onUnmounted, watch} from "vue";
import {VoiceRecorder} from "capacitor-voice-recorder";
import {Configuration, SnoozeApiApi} from "@/generated/openapi-snooze";
import {EventSourcePolyfill} from 'event-source-polyfill';
import ConsultationTranscriptionsList from "@/components/ConsultationTranscriptionsList.vue";
import ConsultationEditor from "@/components/ConsultationEditor.vue";
import ConsultationViewer from "@/components/ConsultationViewer.vue";
import ConsultationHeader from "@/components/ConsultationHeader.vue";
import {Consultation} from "@/types/Snooze";
import {useLoading} from "@/composables/useLoading";

const config = new Configuration({
  basePath: import.meta.env.VITE_BACKEND_BASE_URL,
  apiKey: import.meta.env.VITE_BACKEND_API_KEY,
});

const apiClient = new SnoozeApiApi(config);

const route = useRoute();
const router = useRouter();

const {id} = route.params;
const data = ref<Consultation | null>(null);
const dataStatusChannel = ref<EventSourcePolyfill | null>(null);
const dataStatus = ref<any | null>(null);
const dataSchema = ref<any | null>(null);
const isRecordingAudio = ref<boolean>(false);
const currentError = ref<any | null>(null);
const {loading} = useLoading();

onMounted(async () => {
  loading.value = true;
  console.log('trying to show the loading', loading.value);
  await apiClient.consultationDetails(id)
      .then(response => {
        data.value = response.data as Consultation;
        console.log(data.value);

        if (data.value.state !== 'Final') {
          console.log('opening SSE channel');
          dataStatusChannel.value = new EventSourcePolyfill(`${config.basePath}/consultations/${id}/sse`, {
            headers: {
              'X-API-KEY': config.apiKey,
            }
          });

          dataStatusChannel.value.onmessage = (event: MessageEvent) => {
            console.log(event, JSON.parse(event.data));
            dataStatus.value = JSON.parse(event.data);
          };

          dataStatusChannel.value.onerror = (err: any) => {
            if (err.status !== 204) {
              console.error(err);
            }
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

watch(dataStatus, async () => {
  if(dataStatus.value.isReviewing){
    console.log('load the schema');
    dataSchema.value = await apiClient.consultationSchema();
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
