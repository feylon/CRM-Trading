<template>
   <audio v-show="false" ref="audioElement" controls>
    <source src="../../../1.mp3" type="audio/mpeg">
  </audio>
    <div>
        <n-dropdown trigger="hover" :options="notification_list" @select="changeLang">
                    <n-badge class="me-3" :value="notification" :max="100">
                        <span class="text-white material-symbols-outlined">
                            notifications
                        </span>

                    </n-badge>
                </n-dropdown>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import url from "../../../base"
import { useRouter } from 'vue-router';
let router = useRouter();
const audioElement = ref(null);

let notification = ref(0);
let notification_list = ref([]);





let changeLang = function (){
    router.push("/")
}
let callbackend = async function () {
  const token = localStorage.token;
  try {
    let backend = await fetch(`${url}notification/status`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          '-x-token': token
        }
      }
    );
    if (backend.status == 200) {
      backend = await backend.json();
      if (backend.length > notification.value && audioElement.value)
        audioElement.value.play().catch(() => {});

      notification.value = backend.length;
      notification_list.value = backend.map(i => ({
        label: `${i.title} : ${(new Date(i.start_time)).toLocaleString()} - ${(new Date(i.end_time)).toLocaleString()}`,
        key: `${uuidv4()}`
      }));
      if (!backend.length) notification_list.value = [{ label: "Hozircha bildirishnoma yo'q", key: 'bosh', disabled: true }];
    }
    if (backend.status == 401) router.push('/login');
  } catch (error) {
  }
}

let interval;
onMounted(async () => {
    callbackend();
    interval = setInterval(callbackend, 60000);
});

onUnmounted(() => clearInterval(interval));
</script>
