<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>

        <ion-buttons slot="primary">
          <ion-button @click="onBtnCreateConsultationClick">
            <ion-icon slot="icon-only" :ios="addOutline" :md="addSharp"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>Consultas</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Consultas</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list>
        <ConsultationListItem v-for="consultation in data" :key="consultation.id" :consultation="consultation"/>
      </ion-list>

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
  IonIcon,
  IonButton,
  IonButtons,
  IonAlert,
  loadingController,
} from '@ionic/vue';
import {
  addOutline, addSharp,
} from 'ionicons/icons';
import {ref, onMounted, watch} from "vue";
import {Configuration, SnoozeApiApi} from '@/generated/openapi-snooze';
import {useRouter} from 'vue-router';
import ConsultationListItem from "@/components/ConsultationListItem.vue";

const clinicClinicianId = import.meta.env.VITE_DEFAULT_CLINIC_CLINICIAN_ID;
const patientId = import.meta.env.VITE_DEFAULT_PATIENT_ID;

const router = useRouter();

const data = ref<any | null>(null);
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

const config = new Configuration({
  basePath: import.meta.env.VITE_BACKEND_BASE_URL,
  apiKey: import.meta.env.VITE_BACKEND_API_KEY,
});

const apiClient = new SnoozeApiApi(config);

onMounted(async () => {
  loadingDialog = await loadingController.create({
    message: 'Please wait...',
  });

  loading.value = true;
  await apiClient.consultationsList()
      .then(response => {
        data.value = response.data;
      })
      .catch(error => {
        displayError(error);
      });
  loading.value = false;
});

const onBtnCreateConsultationClick = async () => {
  console.log('onBtnCreateConsultationClick');
  loading.value = true;
  await apiClient.createConsultation({
    clinicClinicianId: clinicClinicianId,
    patientId: patientId
  })
      .then(response => {
        router.push(`/consultations/${response.data}`);
      })
      .catch(error => {
        displayError(error);
      });
  loading.value = false;
}

const displayError = (e) => {
//   console.log(e, e.response.data);

  currentError.value = {
    header: 'Error',
    subHeader: e.name,
    message: e.message,
  }
}

</script>

<style scoped>
</style>
