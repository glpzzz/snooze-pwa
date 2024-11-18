<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/patients"></ion-back-button>
        </ion-buttons>
        <ion-title>Detalles del Paciente</ion-title>
        <ion-progress-bar v-if="patientsStore.loading" type="indeterminate"></ion-progress-bar>
        <ion-buttons slot="primary">
          <ion-button :router-link="`/patients/${id}/update`">
            <ion-icon slot="icon-only" :ios="pencilOutline" :md="pencilSharp"></ion-icon>
          </ion-button>
          <ion-button id="present-delete-alert" color="danger">
            <ion-icon slot="icon-only" :ios="trashOutline" :md="trashSharp"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-alert
        trigger="present-delete-alert"
        header="¿Eliminar paciente?"
        message="Se eliminarán los datos del paciente así como los registros de consultas realizadas."
        :buttons="deleteAlertButtons"
    ></ion-alert>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Detalles del Paciente</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-card>
        <template v-if="patient">
          <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
          <ion-card-header>
            <ion-card-title>{{ patient.name }}</ion-card-title>
            <ion-card-subtitle>{{ patient.species }} / {{ patient.breed }}</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <ion-list lines="full">
              <ion-item>
                <ion-label>
                  <strong>Sexo:</strong> {{ patient.sex ? "Hembra" : "Macho" }}
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <strong>Edad:</strong> {{ formatTimeAgo(new Date(patient.dayOfBirth)) }}
                </ion-label>
              </ion-item>
              <ion-item v-if="patient.description">
                <ion-label>
                  {{ patient.description }}
                </ion-label>
              </ion-item>
            </ion-list>
            <ion-list v-if="patient?.owner">
              <ion-list-header>
                <ion-label>
                  Propietario
                </ion-label>
                <ion-button @click="isOwnerVisible = !isOwnerVisible">
                 <ion-icon slot="icon-only"
                           :md="isOwnerVisible ? eyeSharp : eyeOffSharp"
                           :ios="isOwnerVisible ? eyeOutline : eyeOffOutline "
                 ></ion-icon>
                </ion-button>
              </ion-list-header>
              <template v-if="isOwnerVisible">
                <ion-item>
                  <ion-label>
                    <strong>Nombre</strong><br>{{ patient.owner.name }}
                  </ion-label>
                </ion-item>
                <ion-item v-if="patient.owner.phoneNumber">
                  <ion-label>
                    <strong>Teléfono</strong><br>{{ patient.owner.phoneNumber }}
                  </ion-label>
                  <ion-button shape="round" fill="clear" slot="end" :href="toPhoneLink(patient.owner.phoneNumber)">
                    <ion-icon aria-hidden="true" :ios="callOutline" :md="callSharp" slot="icon-only"></ion-icon>
                  </ion-button>
                  <ion-button shape="round" fill="clear" color="success" slot="end"
                              :href="toWhatsAppLink(patient.owner.phoneNumber)">
                    <ion-icon aria-hidden="true" :ios="logoWhatsapp" :md="logoWhatsapp" slot="icon-only"></ion-icon>
                  </ion-button>
                </ion-item>
                <ion-item v-if="patient.owner.email">
                  <ion-label>
                    <strong>Email</strong><br>{{ patient.owner.email }}
                  </ion-label>
                  <ion-button shape="round" fill="clear" slot="end" :href="toMailtoLink(patient.owner.email)">
                    <ion-icon aria-hidden="true" :ios="mailOutline" :md="mailSharp" slot="icon-only"></ion-icon>
                  </ion-button>
                </ion-item>
              </template>
            </ion-list>
          </ion-card-content>
        </template>
      </ion-card>
      <ConsultationList v-if="consultations" :consultations="consultations"/>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">

import {
  pencilOutline, pencilSharp,
  mailOutline, mailSharp,
  callOutline, callSharp,
  logoWhatsapp,
  trashOutline, trashSharp, eyeOffSharp, eyeOutline, eyeSharp, eyeOffOutline
} from "ionicons/icons";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonListHeader,
  IonAlert,
  IonBackButton, IonProgressBar,
} from "@ionic/vue";
import {ref, onMounted} from 'vue'
import {useRoute, useRouter} from "vue-router";
import {ConsultationDetailDto, PatientDto} from "@/generated/openapi-snooze";
import {useSnoozeApi} from "@/composables/useSnoozeApi";
import {usePatientStore} from "@/stores/patientStore";
import {formatTimeAgo} from "@vueuse/core";
import {useSpecialLinks} from "@/composables/useSpecialLinks";
import ConsultationList from "@/components/ConsultationList.vue";
import {useConsultationStore} from "@/stores/consultationStore";

const {apiClient} = useSnoozeApi();

const route = useRoute();
const {id} = route.params as { id: string };

const {toPhoneLink, toWhatsAppLink, toMailtoLink} = useSpecialLinks();

const patient = ref<PatientDto | null>(null)
const consultations = ref<Array<ConsultationDetailDto>>([])
const isOwnerVisible = ref<boolean>(false);

const patientsStore = usePatientStore();
const consultationsStore = useConsultationStore();
onMounted(async () => {
  try {
    patient.value = await patientsStore.fetchPatient(id);
    consultations.value = (await apiClient.consultationsList()).data;
  } catch (err) {
    console.error(err);
  }
});

const router = useRouter();
const deleteAlertButtons = [
  {
    text: 'Cancelar',
    role: 'cancel',
  },
  {
    text: 'Eliminar',
    role: 'destructive',
    handler: async () => {
      try {
        if (await patientsStore.deletePatient(id)) {
          await router.push('/patients');
        }
      } catch (err) {
        console.error(err);
      }
    },
  },
];

const createConsultation = async () => {
  console.log('onBtnCreateConsultationClick');
  try {
    const consultation = await consultationsStore.createConsultation(id, import.meta.env.VITE_DEFAULT_CLINIC_CLINICIAN_ID);
    await router.push(`/consultations/${consultation.id}`);
  } catch (err) {
    console.error(err);
  }
}

</script>
