<template>
  <ion-item>
    <ion-label v-if="transcription.text === '...'">
      <ion-skeleton-text :animated="true"></ion-skeleton-text>
    </ion-label>
    <ion-label v-else>
      {{ transcription.text }}
    </ion-label>
  </ion-item>
</template>

<script setup lang="ts">

import {IonItem, IonLabel, IonSkeletonText} from "@ionic/vue";
import { defineProps } from "vue";

const props = defineProps({
  transcription: {
    type: Object,
    required: true
  }
})
</script>