<template>
  <ion-item :router-link="`/consultations/${consultation.id}`" :detail="true">
    <template v-if="itemType === 'history'">
      <ion-label>
        <h2>{{ new Date(consultation.date).toLocaleString() }}</h2>
      </ion-label>
    </template>
    <template v-else>
      <ion-thumbnail slot="start">
        <img
            src="https://docs-demo.ionic.io/assets/madison.jpg"
            alt="The Wisconsin State Capitol building in Madison, WI at night"
        />
      </ion-thumbnail>
      <ion-label>
        <h2>{{ consultation.patient.name }} / {{ consultation.patient.species }}</h2>
        <p>{{ consultation.date }} - {{ consultation.clinician.name }}</p>
      </ion-label>
    </template>
  </ion-item>
</template>

<script setup lang="ts">

import {Consultation} from "@/types/Snooze";
import {IonItem, IonLabel, IonThumbnail} from "@ionic/vue";

// Define the prop to accept the object
defineProps<{
  consultation: {
    type: Consultation,
    required: true
  },
  itemType: string,
}>();

</script>