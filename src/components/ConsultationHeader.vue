<template>
  <ion-item-group>
    <ion-item-divider>
      <ion-label>Generales del Paciente</ion-label>
    </ion-item-divider>
    <ion-item v-if="!data">
      <ion-thumbnail slot="start">
        <ion-skeleton-text :animated="true"></ion-skeleton-text>
      </ion-thumbnail>
      <ion-label>
        <h1>
          <ion-skeleton-text :animated="true" style="width: 80%;"></ion-skeleton-text>
        </h1>
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
        <h1>{{ data.patient.name }}</h1>
        <p>{{ data.patient.species }} / {{ data.patient.breed }}</p>
      </ion-label>
    </ion-item>
  </ion-item-group>
</template>

<script setup lang="ts">

import {defineProps} from "vue";
import {IonItem, IonItemDivider, IonItemGroup, IonLabel, IonSkeletonText, IonThumbnail} from "@ionic/vue";

const props = defineProps({
  data: {
    type: Object,
  }
})

</script>



