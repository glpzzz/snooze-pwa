<template>
  <ion-list>
    <ion-list-header>
      Historial
    </ion-list-header>
    <ConsultationListItem v-for="consultation in consultations" :key="consultation.id" :consultation="consultation"/>
  </ion-list>
</template>
<script setup lang="ts">
import {IonList, IonListHeader} from "@ionic/vue";
import {defineProps} from "vue";
import ConsultationListItem from "@/components/ConsultationListItem.vue";
import {ConsultationDetailDto} from "@/generated/openapi-snooze";

const props = defineProps<{
  consultations: Array<any>
}>();

</script>



