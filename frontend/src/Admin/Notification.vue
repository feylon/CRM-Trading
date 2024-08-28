<template><div>
    <p class="text-lg">
        <span class="text-[20px] font-bold">
            Bildirishnomalar
        </span>
    </p>

</div>

</template>

<script setup>
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import {ref, onMounted} from "vue";
import url from "../../base"
console.log(url);
const router = useRouter();


let data = ref([]);


let callbackend = async function(){
  const token = localStorage.token;

let backend = await fetch(`${url}notification`,
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
        console.log(backend)
      //   events.value = backend;
}
  if(backend.status == 401) router.push('/login');
}
onMounted(async() => {
    callbackend();

})
</script>
