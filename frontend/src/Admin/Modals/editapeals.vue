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
        <n-button type="primary" @click="save({status : data.status_id, id :((store.modals.editApeal.data.id)), panding : panding, reseen : reseen })">Saqlash</n-button>
    </div>

    <n-divider title-placement="left">Izohlar ({{ izohlar.length }})</n-divider>
    <div class="flex gap-2 items-start">
        <n-input v-model:value="izoh" type="textarea" maxlength="1000" show-count
            :autosize="{ minRows: 1, maxRows: 4 }" placeholder="Masalan: qo'ng'iroq qilindi, ertaga qayta bog'lanish kerak" />
        <n-button type="info" :loading="izohLoading" :disabled="!izoh.trim()" @click="izohQosh">
            <i class="fas fa-paper-plane"></i>
        </n-button>
    </div>
    <div class="max-h-[220px] overflow-auto mt-3 pe-1">
        <n-empty v-if="!izohlar.length" size="small" description="Hali izoh yo'q" />
        <div v-for="i in izohlar" :key="i.id" class="bg-gray-100 rounded-lg p-2 mb-2 group">
            <div class="flex justify-between text-[12px] text-gray-500">
                <span class="font-bold text-teal-700">{{ i.lastname }} {{ i.firstname }}</span>
                <span class="flex gap-2 items-center">
                    {{ new Date(i.created_at).toLocaleString() }}
                    <n-popconfirm @positive-click="izohOchir(i.id)" positive-text="Ha" negative-text="Yo'q">
                        <template #trigger>
                            <i class="far fa-trash-can text-red-500 cursor-pointer"></i>
                        </template>
                        Izoh o'chirilsinmi?
                    </n-popconfirm>
                </span>
            </div>
            <div class="text-[14px] whitespace-pre-wrap break-words">{{ i.text }}</div>
        </div>
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
const router = useRouter();
const store = Dean();

const today = new Date();
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
let izohlar = ref([])
let izoh = ref('')
let izohLoading = ref(false)

let getIzohlar = async () => {
    let id = store.modals.editApeal.data.id;
    if (!id) return;
    try {
        let backend = await fetch(`${url}apeal/comment/${id}`, {
            headers: { '-x-token': localStorage.token }
        });
        if (backend.status == 401) return router.push('/login');
        if (backend.status == 200) izohlar.value = await backend.json();
    } catch (error) {
    }
}

let izohQosh = async () => {
    let id = store.modals.editApeal.data.id;
    izohLoading.value = true;
    try {
        let backend = await fetch(`${url}apeal/comment/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8", '-x-token': localStorage.token },
            body: JSON.stringify({ text: izoh.value })
        });
        if (backend.status == 401) return router.push('/login');
        if (backend.status == 201) {
            izoh.value = '';
            await getIzohlar();
            store.modals.editApeal.loading = true;
        } else {
            backend = await backend.json();
            message.error(backend.error);
        }
    } catch (error) {
        message.error("Server bilan aloqa uzildi")
    }
    izohLoading.value = false;
}

let izohOchir = async (cid) => {
    try {
        let backend = await fetch(`${url}apeal/comment/byid/${cid}`, {
            method: "DELETE",
            headers: { '-x-token': localStorage.token }
        });
        if (backend.status == 200) {
            izohlar.value = izohlar.value.filter(i => i.id != cid);
            store.modals.editApeal.loading = true;
        }
    } catch (error) {
    }
}
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
await getIzohlar();
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
