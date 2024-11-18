<template>
  <form @submit.prevent="$emit('submit', patient)">
    <ion-list>
      <ion-item-group>
        <ion-item-divider>
          <ion-label>Datos del paciente</ion-label>
        </ion-item-divider>
        <ion-item>
          <ion-input label="Nombre" label-placement="floating" v-model="patient.name" name="PatientDto[name]"></ion-input>
        </ion-item>
        <ion-item>
          <ion-select label="Sexo" label-placement="floating" v-model="patient.sex" :compare-with="compareWithSex" name="PatientDto[sex]">
            <ion-select-option value="1">Hembra</ion-select-option>
            <ion-select-option value="0">Macho</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-input label="Fecha de nacimiento" label-placement="floating" v-model="patient.dayOfBirth"
                     type="date" name="PatientDto[dayOfBirth]"></ion-input>
        </ion-item>
        <ion-item>
          <ion-input label="Especie" label-placement="floating" v-model="patient.species" name="PatientDto[species]"></ion-input>
        </ion-item>
        <ion-item>
          <ion-input label="Raza" label-placement="floating" v-model="patient.breed" name="PatientDto[breed]"></ion-input>
        </ion-item>
        <ion-item lines="none">
          <ion-textarea label="Descripción" label-placement="floating" v-model="patient.description" name="PatientDto[description]"></ion-textarea>
        </ion-item>
      </ion-item-group>
      <ion-item-group>
        <ion-item-divider>
          <ion-label>Datos del propietario</ion-label>
        </ion-item-divider>
        <ion-item>
          <ion-input label="Nombre" label-placement="floating" type="text" v-model="patient.owner.name" name="PatientDto[owner][name]"></ion-input>
        </ion-item>
        <ion-item>
          <ion-input label="Número de teléfono" label-placement="floating" type="tel"
                     v-model="patient.owner.phoneNumber" name="PatientDto[owner][phoneNumber]"></ion-input>
        </ion-item>
        <ion-item>
          <ion-input label="Correo electrónico" label-placement="floating" type="email"
                     v-model="patient.owner.email" name="PatientDto[owner][email]"></ion-input>
        </ion-item>
      </ion-item-group>
      <ion-item>
        <ion-label>
          <ion-button type="submit" expand="block">Guardar</ion-button>
        </ion-label>
      </ion-item>
    </ion-list>
  </form>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonInput,
  IonItem,
  IonItemDivider,
  IonItemGroup, IonLabel,
  IonList,
  IonSelect,
  IonSelectOption, IonTextarea
} from "@ionic/vue";
import {PatientDto} from "@/generated/openapi-snooze";

defineProps<{
  patient: PatientDto
}>();

defineEmits(['submit']);

const compareWithSex = (v1: string | number, v2: string | number) => {
  return (typeof v1 == 'number' ? v1 : parseInt(v1)) === (typeof v2 == 'number' ? v2 : parseInt(v2 as string));
}

</script>
