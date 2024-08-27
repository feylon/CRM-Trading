<template>
    <div>
        salom
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Dean } from '../../../Pinia';
import url from "../../../base";
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';


let message = useMessage();
const router = useRouter();
const store = Dean();


// setTimeout(() => {
//     store.modals.addcalendar.show = false;
// }, 3000);


</script>

<style lang="scss" scoped>

</style>