<template>
<div class="h-max-[10px]">
    <n-tag type="success" v-if="!endtime">
        <p>{{ formattedTime }}</p>
    </n-tag>
    <n-tag v-else type="error">
      Vaqt tugadi
    </n-tag>
</div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

// Props
const props = defineProps({
    targetDateTime: {
        type: String,
        required: true,
    },
});

const endtime = ref(false)
const timeLeft = ref(0);
const intervalId = ref(null);

const calculateTimeLeft = () => {
    const targetDate = new Date(props.targetDateTime);
    const now = new Date();
    return Math.max(Math.floor((targetDate - now) / 1000), 0);
};

const formattedTime = computed(() => {
    const days = Math.floor(timeLeft.value / (24 * 60 * 60));
    const hours = Math.floor((timeLeft.value % (24 * 60 * 60)) / 3600);
    const minutes = Math.floor((timeLeft.value % 3600) / 60);
    const seconds = timeLeft.value % 60;

    return `${days} kun ${hours} soat ${minutes} minut ${seconds < 10 ? '0' : ''}${seconds}s`;
});

const startCountdown = () => {
    intervalId.value = setInterval(() => {
        timeLeft.value = calculateTimeLeft();
        if (timeLeft.value <= 0) {
            endtime.value = true;
            clearInterval(intervalId.value);
        }
    }, 1000);
};

onMounted(() => {
    timeLeft.value = calculateTimeLeft();
    startCountdown();
});

onUnmounted(() => {
    clearInterval(intervalId.value);
    
});
</script>

<style scoped>
p {
    font-size: 10px;
    text-align: center;
}
</style>