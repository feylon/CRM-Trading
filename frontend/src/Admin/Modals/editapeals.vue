<template>
    <div class="container">
        <div class="flex justify-around">
        <div class="flex gap-3 items-center">
            <div class="font-bold">Familiyasi</div>
            <div class="w-[150px]">
            <n-input readonly v-model:value="data.lastname"></n-input>

            </div>
        </div>
        <div class="flex gap-3 items-center">
            <div class="font-bold">Ismi</div>
            <div class="w-[150px]">
            <n-input readonly v-model:value="data.firstname"></n-input>

            </div>

        </div>


    </div>

    <div class="flex mt-4 justify-around">
        <div class="flex gap-3 items-center">
        <div class="font-bold">Telefon</div>
        <div class="w-[150px]">
        <n-input readonly v-model:value="data.phone"></n-input>

        </div>

    </div>
        <div class="flex gap-3 items-center">
            <div class="font-bold">Vaqti</div>
            <div class="w-[150px]">
            <n-input readonly v-model:value="data.created_at"></n-input>

            </div>

        </div>
        
    </div>
    <div class="mt-4">
        <div class="font-bold">
            Description
        </div>
        <n-input
        readonly
  v-model:value="data.description"
  type="textarea"
  placeholder="Basic Textarea"
/>
    </div>
    <div class="flex justify-around">
        <div class="mt-4">
        <div class="font-bold">
            Holati
        </div>
        
        <n-select v-model:value="data.status_id" :options="apeallist" />
    </div>


    <div class="mt-4">
        <div class="font-bold">
            Vaqti
        </div>
        
        <n-date-picker v-if="data.reseen" v-model:value="data.reseen" type="date" />

    </div>

    </div>  
    </div>
    
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Dean } from '../../../Pinia';
import url from "../../../base";
import DatePicker from 'primevue/datepicker';
import { useRouter } from 'vue-router';
let date = '2024-09-10'
const router = useRouter();
const store = Dean();
const data = ref({
    firstname : '',
    lastname : '',
    phone  : '',
    created_at : '',
    description : '',
    status_id : 0,
    reseen : 1038942000000
});
const apeallist = ref([])

let getapeal = async function(){
    let {id} = store.modals.editApeal.data
let token = localStorage.token;
id = new Number(id);
let backend = await fetch(`${url}apeal/getapeal/apealstatus`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                '-x-token': token
            }
        });
    
        if (backend.status == 401) {
    return router.push('/login')
}
        if (backend.status == 200) {
            backend = await backend.json();
            apeallist.value = [];
            console.log(backend)
            backend.forEach(i =>{
                apeallist.value.push({value : (i.id), label : i.name})

            })
            }
};

onMounted(async ()=>{
{
    let {id} = store.modals.editApeal.data
let token = localStorage.token;
id = new Number(id);
let backend = await fetch(`${url}apeal/getapeal/byid?id=${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                '-x-token': token
            }
        });
    
        if (backend.status == 401) {
    return router.push('/login')
}
        if (backend.status == 200) {
            backend = await backend.json();
            backend = backend[0]
            backend.created_at = (new Date(backend.created_at)).toLocaleString()
            console.log(backend);
            if(backend.reseen){
                backend.reseen = (new Date(backend.reseen)).getTime();
            }
            data.value = backend;
            
        }
};
await getapeal();
})


</script>

<style lang="scss" scoped>

</style>
