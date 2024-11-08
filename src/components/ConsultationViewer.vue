<template>
  <ion-item-group>
    <ion-item-divider>
      <ion-label>Notas de consulta</ion-label>
    </ion-item-divider>
    <ion-item>
      <ion-label>
        {{ JSON.stringify(content) }}
      </ion-label>
    </ion-item>
  </ion-item-group>
</template>

<script setup lang="ts">

import {IonItemGroup, IonItemDivider, IonItem, IonLabel} from "@ionic/vue";
import {defineProps} from "vue";

const props = defineProps({
  content: {
    type: String,
    required: true,
  }
})

</script>



