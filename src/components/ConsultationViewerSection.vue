<template>
  <dl>
    <div v-for="key in Object.keys(filteredContent)" :key="key">
      <dt class="ion-text-capitalize">{{ key }}</dt>
      <dd>

        <ul v-if="Array.isArray(content[key])">
          <li v-for="item in content[key]" :key="item">
            <template v-if="typeof item === 'string'">{{ item }}</template>
            <dl v-else-if="typeof item === 'object' && !Array.isArray(item)">
              <template v-for="key in Object.keys(item)" :key="key">
                <dt>{{ key }}</dt>
                <dd>{{ item[key] }}</dd>
              </template>
            </dl>
          </li>
        </ul>

        <ConsultationViewerSection
            v-else-if="typeof content[key] === 'object' && !Array.isArray(content[key])"
            :content="content[key]"
            :level="props.level + 1"/>

        <p v-else>{{ filteredContent[key] }}</p>

      </dd>
    </div>
  </dl>
</template>

<script setup lang="ts">

import {computed} from "vue";

const props = defineProps({
  content: {
    type: Object,
    required: true,
  },
  level: {
    type: Number,
    required: false,
    default: 2,
  }
})

const filteredContent = computed(() => {
  const output = Object.fromEntries(Object.entries(props.content).filter(([key, value]) => value !== null && value !== undefined && value !== ''));
  console.log(output);
  return output;
});

</script>

<style scoped>
dt {
  font-weight: bold;
  margin-top: 1rem;
  text-transform: capitalize;
}
dd {
  margin-left: 0;
}
dd > dl {
  margin-left: 1rem;
}
</style>



