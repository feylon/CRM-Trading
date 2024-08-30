<template>
    <div>
      <n-tag type="error" >
        <p>{{ countupText }}</p>
    </n-tag>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, computed } from 'vue';
  
  // Define props
  const props = defineProps({
    startDate: {
      type: String,
      required: true,
    },
  });
  
  const startTimestamp = computed(() => new Date(props.startDate).getTime());
  const countupText = ref('');
  
  const updateCountup = () => {
    const now = new Date().getTime();
    const timeElapsed = now - startTimestamp.value;
  
    if (timeElapsed < 0) {
      countupText.value = 'hali vaqt mavjud';
      clearInterval(interval);
      return;
    }
  
    const days = Math.floor(timeElapsed / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeElapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeElapsed % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeElapsed % (1000 * 60)) / 1000);
    
countupText.value = `${days} kun ${hours} : ${minutes} : ${seconds}s`;
 
};
  
  let interval;
  
  onMounted(() => {
    updateCountup();
    interval = setInterval(updateCountup, 1000);
  });
  
  onUnmounted(() => {
    clearInterval(interval);
  });
  </script>
  