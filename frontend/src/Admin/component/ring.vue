<template>
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
import { ref, onMounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import url from "../../../base"
import { useRouter } from 'vue-router';
let router = useRouter();

let delete1 = ref(0);
let notification = ref(0);
let notification_list = ref([]);





let changeLang = function (){
    router.push("/")
}
let callbackend = async function () {
  const token = localStorage.token;

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
    
    notification_list.value = [];
    backend.forEach(i => {
    notification.value++;

    notification_list.value.push({ label: `${i.title} : ${(new Date(i.start_time)).toLocaleString()} ${(new Date(i.end_time)).toLocaleString()}`, key: `${uuidv4()}` });
      
    });

  }
  if (backend.status == 401) router.push('/login');
}

onMounted(async () => {
    callbackend();
});

setInterval(() => {
    callbackend();
    notification.value = 0;
}, 60000);
</script>
