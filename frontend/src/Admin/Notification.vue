<template><div>
    <p class="text-lg">
        <span class="text-[20px] font-bold">
            Bildirishnomalar
        </span>
    </p>




 <div>
    
  <div class="w-max-[1000px] w-[1000px] overflow-visible mx-auto mt-[40px]">
    <n-table :bordered="false" :single-line="false">
    <thead>
      <tr>
        <th>№</th>
        <th>Sarlavha</th>
        <th>Boshlanish vaqti</th>
        <th>Tugash vaqti</th>
        <th>Description</th>
        <th>Joylashuv</th>
        <th>Teglar</th>
        <th>Activligi</th>
    </tr>
    </thead>
    <tbody>
      <tr v-for="(i,j) in data" v-if="data.length > 0">
        <td>{{++ j}}</td>
        <td> <div class="font-bold">{{i.title}}</div></td>
        <td> {{ (new Date(i.start_time)).toLocaleString() }}</td>
        <td>
          <div class="flex justify-center flex-col">
            {{ (new Date(i.end_time)).toLocaleString() }}

<countdown :targetDateTime="i.end_time"/>

          </div>
        </td>
        <td class="w-max-[90px] w-[100px] overflow-auto text-justify"><div class="h-[40px] text-[13px]">{{i.description}}</div></td>
        <td v-if="i.location">{{ i.location }}</td>
        <td v-else><i class="">Mavjud emas</i></td>


        <td v-if="i.tags" >
            <div class="w-max-[90px] w-[100px] overflow-x-auto">

                {{ i.tags }} 
            </div>
        </td>
        <td v-else><i class="">Mavjud emas</i></td>
    
    
    
        <td>
            <n-switch @click="change_active(i.id, i.active)" v-model:value="i.active">
      <template #checked>
        Faol
      </template>
      <template #unchecked>
        Faol emas
      </template>
    </n-switch>
        </td>
    
    </tr>
      
    </tbody>
  </n-table>
  </div>

 </div>   
</div>

</template>

<script setup>
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import {ref, onMounted} from "vue";
import countdown from './component/countdown.vue';
import url from "../../base"
console.log(url);
const router = useRouter();
let value = ref(false)

let data = ref([]);
let  indeterminate = ref(false);

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
      data.value = backend;

}
  if(backend.status == 401) router.push('/login');
}
onMounted(async() => {
    callbackend();

});
async function change_active(id, active){
    console.log(id, active)
}
</script>
