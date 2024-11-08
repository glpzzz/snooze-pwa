<template>
  <ion-item :router-link="`/consultations/${consultation.id}`">
    <ion-label>
      <h2>{{consultation.patient.name}} / {{consultation.patient.species}}</h2>
      <p>{{consultation.date}} - {{ consultation.clinician.name}}</p>
    </ion-label>
  </ion-item>
</template>

<script setup lang="ts">

import { defineProps } from 'vue';
import {IonItem, IonLabel} from "@ionic/vue";

// Define the prop to accept the object
const props = defineProps({
  consultation: {
    type: Object,
    required: true
  }
});

</script>

<style scoped>

</style>