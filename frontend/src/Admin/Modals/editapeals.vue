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
        <div v-if="panding || data.status_id.id == 3" class="font-bold">
            Vaqti
        </div>
        
        <n-date-picker v-if="panding || data.status_id.id == 3 " v-model:value="reseen" type="date" />

    </div>

    </div>  
    <div class="flex justify-end mt-5">
        <n-button @click="save({status : data.status_id, id :((store.modals.editApeal.data.id)), panding : panding, reseen : reseen })">Saqlash</n-button>
    </div>
    </div>
    
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Dean } from '../../../Pinia';
import url from "../../../base";
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';


let message = useMessage();
let date = '2024-09-10'
const router = useRouter();
const store = Dean();

const today = new Date();  // Gets today's date and time
let timestamp = today.getTime();


const data = ref({
    firstname : '',
    lastname : '',
    phone  : '',
    created_at : '',
    description : '',
    status_id : 0,
    reseen : timestamp
});

watch(
    ()=>data,
    (data, old)=>{
        if(data['_value'].status_id == 3)
        panding.value = true;
        else
        panding.value = false;


    }, {deep : true}
)


const apeallist = ref([])
let reseen = ref(timestamp)
let panding = ref(false)

let getapeal = async function(){
    let id = store.modals.editApeal.data.id;
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
            if(backend.reseen){
                panding.value = true;
                reseen.value = (new Date(backend.reseen)).getTime();
            }
            data.value = backend;
            
        }
};
await getapeal();
})


async function save(data) {
    const timestamp = data.reseen; 
const date = new Date(timestamp);

const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0'); 
const day = String(date.getDate()).padStart(2, '0');

data.reseen = `${year}-${month}-${day}`;
let token = localStorage.token;
if(!data.panding){
    const { status, id} = data;
    try {
        let backend = await fetch(`${url}apeal/edit/byid/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                '-x-token': token
            },
            body :JSON.stringify({
                status 
            })

        });
        if(backend.status == 200){
            message.success("Ma'lumotlar muvaqiyatli saqlandi");  
  store.modals.editApeal.show = false;  
  store.modals.editApeal.data = {};
  store.modals.editApeal.loading = true;

            return
        }
        if (backend.status == 401) {
    return router.push('/login')
}
    } catch (error) {
        
    }

}
else{
    const { status, id, reseen} = data;
    try {
        let backend = await fetch(`${url}apeal/edit/byid/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                '-x-token': token
            },
            body :JSON.stringify({
                status , reseen
            })

        });
        if(backend.status == 200){
            message.success("Ma'lumotlar muvaqiyatli saqlandi");  
  store.modals.editApeal.show = false;  
  store.modals.editApeal.data = {};
  store.modals.editApeal.loading = true;
            return
        }
        if (backend.status == 401) {
    return router.push('/login')
}
    if(backend.status == 400){
        backend = await backend.json();
        message.error(backend.error)
    }
    } catch (error) {
        
    }

}
}



</script>

<style lang="scss" scoped>

</style>
