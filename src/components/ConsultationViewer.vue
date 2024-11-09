<template>
  <ion-item-group>
    <ion-item-divider>
      <ion-label>Notas de consulta</ion-label>
    </ion-item-divider>
        <ion-item v-for="key in Object.keys(filteredContent)" :key="key">
          <ion-label>
            <h2>{{key}}</h2>
            <p>{{content[key]}}</p>
          </ion-label>
        </ion-item>
  </ion-item-group>
</template>

<script setup lang="ts">

import {IonItemGroup, IonItemDivider, IonItem, IonLabel} from "@ionic/vue";
import {computed, defineProps} from "vue";

const props = defineProps({
  content: {
    type: Object,
    required: true,
  }
})

const filteredContent = computed(() => {
  return  Object.fromEntries(Object.entries(props.content).filter(([key, value]) => value !== null && value !== undefined && value !== ''));
});

</script>



