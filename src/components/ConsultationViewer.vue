<template>
  <ion-item-group>
    <ion-item-divider>
      <ion-label>Notas de consulta</ion-label>
    </ion-item-divider>
    <ion-item>
      <ion-label>
        <ConsultationViewerSection :content="content" />
      </ion-label>
    </ion-item>
  </ion-item-group>
</template>

<script setup lang="ts">

import {IonItemGroup, IonItemDivider, IonItem, IonLabel} from "@ionic/vue";
import ConsultationViewerSection from "@/components/ConsultationViewerSection.vue";

defineProps({
  content: {
    type: Object,
    required: true,
  },
})

</script>



