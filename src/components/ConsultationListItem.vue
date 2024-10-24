<template>
  <ion-item :router-link="`/consultation/${consultation.id}`">
    <ion-label>
      <h2>{{consultation.patientName}} / {{consultation.species}}</h2>
      <p>{{consultation.date}} - {{ consultation.clinicianName}}</p>
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