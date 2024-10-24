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
        <ConsultationListItem v-for="consultation in consultations" :key="consultation.id"
                              :consultation="consultation"/>
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
} from '@ionic/vue';
import {
  addOutline, addSharp,
} from 'ionicons/icons';
import {ref, onMounted} from "vue";
import {useRouter} from 'vue-router';
import {useBackend} from "@/composables/useBackend";
import ConsultationListItem from "@/components/ConsultationListItem.vue";

const clinicClinicianId = '5e6d7c8b-9a0f-1e2d-3c4b-5a6b7c8d9e0f';
const patientId = '7e8d9c0b-1a2f-3e4d-5c6b-7a8b9c0d1e2f';

const router = useRouter();
const {createConsultation, getConsultations} = useBackend();

const currentError = ref(null);
const consultations = ref([]);

onMounted(async () => {
  try {
    consultations.value = await getConsultations();
  } catch (e) {
    displayError(e)
  }
})

const onBtnCreateConsultationClick = async () => {
  console.log('onBtnCreateConsultationClick');
  try {
    const consultationId = await createConsultation(patientId, clinicClinicianId);
    if (consultationId) {
      await router.push(`/consultation/${consultationId}`);
    }
  } catch (e) {
    displayError(e)
  }
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
