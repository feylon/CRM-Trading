<template>
    <div>
        <div>
        <p class="text-lg">
            <span class="text-[20px] font-bold">
          Murojaatlar
            </span>
        </p>
<div class="mx-auto select-auto mt-5 w-full lg:w-[1200px] items-center gap-4 flex flex-col">

    <div class="container">
        <n-table :bordered="false" :single-line="false">
    <thead>
      <tr>
        <th>№</th>
        <th>
            <div class="text-center">

                F.I
            </div>
        
        </th>
        
        <th><div class="text-center">Telefon raqami  </div></th>
        <th class="flex justify-center">Tasnifi</th>
        <th class="text-center"><div class="text-center">Holati</div></th>
        <th class="text-center"><div class="text-center">Vaqti</div></th>
        <th>####</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(i, j) in data" :key="new Number(i.id)">
        <td>{{++ j }}</td>
        <td class="text-center font-bold">{{i.lastname}} {{i.firstname}}</td>
        <td class="text-center">{{ i.phone }}</td>
        <td class="text-center">{{i.description}}</td>
        <td class="text-center">{{ i.statusname }}</td>
        <td class="text-center">{{ (new Date(i.created_at)).toLocaleString() }}</td>

      </tr>
      
    </tbody>
  </n-table>
    </div>

    <n-pagination v-model:page="page" :page-count="size" />

</div>
    </div>
    </div>
</template>

<script setup>
import {ref, onMounted} from "vue";
import url from "../../base/index"
let page = ref(1);
let size = ref(8);
let data = ref([])


onMounted(async () => {
    data.value = [];
    let token = localStorage.token;
    let backend = await fetch(`${url}apeal/getapeal/all?${(new URLSearchParams({page : page.value, size:size.value})).toString()}`,
        {
            method : "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                '-x-token': token
            }
        }
    );
    if(backend.status == 200) {
        backend = await backend.json();
        size.value =  Math.trunc(new  Number (backend[0].total) / 10) + 1;
        data.value = [... backend]
        console.log(data.value)
    }
});
</script>

<style lang="scss" scoped>

</style>