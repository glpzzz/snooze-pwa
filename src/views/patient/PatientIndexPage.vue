<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="primary">
          <ion-button router-link="/patients/create">
            <ion-icon slot="icon-only" :ios="addOutline" :md="addSharp"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Pacientes</ion-title>
        <ion-progress-bar v-if="patientsStore.loading" type="indeterminate"></ion-progress-bar>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Pacientes</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-list :inset="true">
        <ion-item
            v-for="patient in patientsStore.patients"
            :key="patient.id as string"
            :router-link="`patients/${patient.id}`"
            detail>
          <ion-avatar aria-hidden="true" slot="start">
            <img alt="" src="https://ionicframework.com/docs/img/demos/avatar.svg"/>
          </ion-avatar>
          <ion-label>
            <h2>{{ patient.name }}</h2>
            <p>{{ patient.species }} - {{ patient.breed }}</p>
          </ion-label>
        </ion-item>
      </ion-list>

    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">

import {addOutline, addSharp} from "ionicons/icons";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  IonAvatar,
  IonList,
  IonItem,
  IonLabel,
  IonProgressBar,
} from "@ionic/vue";
import {onMounted} from 'vue'
import {usePatientStore} from "@/stores/patientStore";

const patientsStore = usePatientStore();

onMounted(() => {
  console.log('mounted');
  patientsStore.fetchPatients();
});

</script>
