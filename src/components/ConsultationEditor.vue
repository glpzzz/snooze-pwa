<template>
  <ion-item-group>
    <ion-item-divider>
      <ion-label>Compruebe los siguientes datos</ion-label>
    </ion-item-divider>
    <ion-item>
      <ion-label>
        Mostrar campos del consultation
      </ion-label>
    </ion-item>
    <ion-item>
      <ion-label>
        <ion-button expand="block" @click="$emit('btnSendCorrectionsClicked')">
          Enviar
        </ion-button>
      </ion-label>
    </ion-item>
  </ion-item-group>
</template>

<script setup lang="ts">
import {defineProps, defineEmits} from "vue";
import {IonItemGroup, IonItemDivider, IonItem, IonLabel, IonButton} from "@ionic/vue";

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  schema: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['btnSendCorrectionsClicked']);

</script>


