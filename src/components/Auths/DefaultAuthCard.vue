<script setup lang="ts">
const props = defineProps(['subtitle', 'title', 'customClasses']);
</script>

<template>
  <!-- ====== Forms Section Start -->
  <div
    class="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 mx-2"
  >
    <div
      class="rounded-lg border w-full max-w-lg p-10 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
    >
      <div class="">
        <span class="mb-1.5 block font-medium">{{ subtitle }}</span>
        <h2 class="mb-6 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
          {{ title }}
        </h2>
        <slot></slot>
      </div>
    </div>
  </div>
  <!-- ====== Forms Section End -->
</template>
