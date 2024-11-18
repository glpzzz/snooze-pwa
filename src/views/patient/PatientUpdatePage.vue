<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :default-href="`/patients/{id}`"></ion-back-button>
        </ion-buttons>
        <ion-title>Actualizar Paciente</ion-title>
        <ion-progress-bar v-if="patientsStore.loading" type="indeterminate"></ion-progress-bar>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Actualizar Paciente</ion-title>
        </ion-toolbar>
      </ion-header>
      <PatientForm v-if="patient" :patient="patient" @submit="updatePatient"/>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader, IonPage,
  IonProgressBar, IonTitle, IonToolbar
} from "@ionic/vue";
import {PatientDto} from "@/generated/openapi-snooze";
import {usePatientStore} from "@/stores/patientStore";
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import PatientForm from "@/components/PatientForm.vue";

const route = useRoute();
const {id} = route.params as { id: string };

const patient = ref<PatientDto | null>(null)

const patientsStore = usePatientStore();
onMounted(async () => {
  try {
    patient.value = await patientsStore.fetchPatient(id);
  } catch (err) {
    console.error(err);
  }
});

const router = useRouter();
const updatePatient = async () => {
  try {
    const newPatient = await patientsStore.updatePatient(id, patient.value);
    console.log(newPatient);
    await router.push(`/patients/${newPatient.id}`);
  } catch (err) {
    console.error(err);
  }
}

</script>
