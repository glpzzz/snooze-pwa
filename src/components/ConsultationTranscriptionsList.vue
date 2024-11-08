<template>
  <ion-item-group>
    <ion-item-divider>
      <ion-label>Notas de consulta</ion-label>
    </ion-item-divider>
    <template v-if="dataStatus.isRecording">
      <ion-item v-if="dataStatus.transcriptions.length === 0" class="ion-text-center ion-padding">
        <ion-label>
          Comience a grabar para añadir notas de la consulta.
        </ion-label>
      </ion-item>
      <template v-else>
        <ConsultationTranscriptionListItem
            v-for="transcription in dataStatus.transcriptions"
            :key="transcription.id"
            :transcription="transcription"/>
        <ion-item>
          <ion-label>
            <ion-button expand="block" @click="$emit('btnFinishRecordingsClicked')">
              Terminar grabación
            </ion-button>
          </ion-label>
        </ion-item>
      </template>
    </template>
    <ion-item v-else-if="dataStatus.isTranslating">
      <ion-label>
        Procesando las notas de su consulta...
      </ion-label>
    </ion-item>
  </ion-item-group>
</template>

<script setup lang="ts">

import {IonButton, IonItem, IonItemDivider, IonItemGroup, IonLabel} from "@ionic/vue";
import {defineProps} from "vue";
import ConsultationTranscriptionListItem from "@/components/ConsultationTranscriptionListItem.vue";

const props = defineProps({
  dataStatus: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['btnFinishRecordingsClicked'])

</script>