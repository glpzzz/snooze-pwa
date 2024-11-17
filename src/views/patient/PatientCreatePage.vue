<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Nuevo Paciente</ion-title>
        <ion-progress-bar v-if="patientsStore.loading" type="indeterminate"></ion-progress-bar>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Nuevo Paciente</ion-title>
        </ion-toolbar>
      </ion-header>
      <PatientForm :patient="patient" @submit="createPatient"/>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader, IonPage,
  IonProgressBar, IonTitle, IonToolbar,
} from "@ionic/vue";
import {PatientDto} from "@/generated/openapi-snooze";
import {usePatientStore} from "@/stores/patientStore";
import {ref} from "vue";
import {useRouter} from "vue-router";
import PatientForm from "@/components/PatientForm.vue";

const patientsStore = usePatientStore();
const patient = ref<PatientDto>({
  name: '',
  species: '',
  breed: '',
  sex: undefined,
  dayOfBirth: '',
  description: '',
  owner: {
    name: '',
    phoneNumber: '',
    email: ''
  }
});

const router = useRouter();
const createPatient = async () => {

  console.log(patient.value);

  // try {
  //   const newPatient = await patientsStore.createPatient(patient.value);
  //   console.log(newPatient);
  //   await router.push(`/patients/${newPatient.id}`);
  // } catch (err) {
  //   console.error(err);
  // }
}

</script>
