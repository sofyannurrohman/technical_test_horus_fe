<script setup lang="ts">
import { defineProps, defineEmits, watch, ref } from 'vue';

// Define the props and emit for two-way binding
const props = defineProps({
  label: String,
  type: String,
  placeholder: String,
  modelValue: String, // Add modelValue for v-model binding
});

const emit = defineEmits(['update:modelValue']); // Emit event when value changes

const inputValue = ref(props.modelValue);

watch(inputValue, (newValue) => {
  emit('update:modelValue', newValue); // Emit the new value to parent component
});
</script>

<template>
  <div class="mb-4">
    <label class="mb-2.5 block font-medium text-black dark:text-white">{{ props.label }}</label>
    <div class="relative">
      <input
        v-model="inputValue" 
        :type="props.type"
        :placeholder="props.placeholder"
        class="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-black dark:text-white"
      />

      <span class="absolute right-4 top-4">
        <slot></slot>
      </span>
    </div>
  </div>
</template>
