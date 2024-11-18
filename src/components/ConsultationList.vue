<template>
  <ion-list>
    <ion-list-header>
      <ion-label>
        Historial
      </ion-label>
      <ion-button @click="$emit('onBtnCreateConsultationClick')">
        <ion-icon slot="icon-only" :md="addSharp" :ios="addOutline"></ion-icon>
      </ion-button>
    </ion-list-header>
    <ConsultationListItem v-for="consultation in consultations" :key="consultation.id as string" :consultation="consultation"/>
  </ion-list>
</template>
<script setup lang="ts">
import {IonList, IonListHeader, IonLabel, IonButton, IonIcon} from "@ionic/vue";
import {addSharp, addOutline} from "ionicons/icons";
import ConsultationListItem from "@/components/ConsultationListItem.vue";
import {ConsultationDetailDto} from "@/generated/openapi-snooze";

defineProps<{
  consultations: Array<ConsultationDetailDto>
}>();

defineEmits(['onBtnCreateConsultationClick'])

</script>



