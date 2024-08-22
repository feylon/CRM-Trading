<template>
    <div>
        <p class="text-lg">
            <span class="text-[20px] font-bold">
                Profilni tahrirlash

            </span>
        </p>

    </div>


    <div class="flex xl:w-[1200px] xl:w-[900px] items-center flex-col ">
        <div class="justify-between w-[90%] mx-auto flex sm:flex-col md:flex-row">
            <div class="flex gap-3 w-[300px] items-center">
                <label for="email"><span class="text-[17px] items-center font-bold">Email</span></label>
                <n-input id='email' placeholder="Emailni kiriting" maxlength="45" clearable
                    v-model:value="formRef.email" />

            </div>



            <div class="flex gap-3 w-[300px] mt-3 items-center">
                <label for="email"><span class="text-[17px] font-bold">Ismi</span></label>
                <n-input id='email' placeholder="Ismni kiriting" maxlength="15" clearable
                    v-model:value="formRef.firstname" />

            </div>
        </div>



        <div class="flex justify-between w-[90%] mx-auto sm:flex-col md:flex-row">

            <div class="flex gap-3 w-[300px] mt-3 items-center">
                <label for="email"><span class="text-[17px] font-bold">Familiyasi</span></label>
                <n-input id='email' placeholder="Familiyani kiriting" maxlength="15" clearable
                    v-model:value="formRef.lastname" />

            </div>



            <div class="flex gap-3 w-[300px] mt-3 items-center">
                <label for="email"><span class="text-[17px] font-bold">Tug'ilgan kuni</span></label>
                <n-date-picker v-model:value="formRef.brithday" type="date" />
            </div>

        </div>



        <div class="flex justify-between w-[90%] mx-auto sm:flex-col md:flex-row">

            <div class="flex gap-3 w-[300px] mt-3 items-center">
                <label for="email"><span class="text-[17px] font-bold">Otasining ismi</span></label>
                <n-input id='email' placeholder="Familiyani kiriting" maxlength="15" clearable
                    v-model:value="formRef.Parent_Name" />

            </div>


            <div class="flex gap-5 w-[300px] mt-3 items-center">
                <label for="email"><span class="text-[17px] font-bold">Uy manzili</span></label>
                <n-input id='email' placeholder="Uy manzilini kiriting" maxlength="45" clearable
                    v-model:value="formRef.address" />

            </div>
        </div>




        
        <div class="flex justify-end w-[90%] mt-4">
            <n-button @click='submit(formRef)'>Saqlash</n-button>

        </div>
    </div>



</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useMessage } from "naive-ui"
import url from "../../base"
import { Dean } from "../../Pinia/index.js";
let store = Dean();




const formRef = ref({
    email: ref(null),
    firstname: ref(null),
    lastname: ref(null),
    brithday: ref(1723894439972),
    address: ref(null),
    Parent_Name: ref(null)
});



const message = useMessage();

let viloyatList = ref([]);
let tumanList = ref([]);

onMounted(async () => {
    

    await store.getProfil();
    formRef.value.email = store.profile.email;
    formRef.value.firstname = store.profile.firstname;
    formRef.value.lastname = store.profile.lastname;
    formRef.value.address = store.profile.address;
    formRef.value.Parent_Name = store.profile.parent_name;
    formRef.value.brithday = new Date(store.profile.brithday).getTime()
});






async function submit(e) {
    let body = {};
    let token = localStorage.token;
    for (let i in e) {
        if (!e[i]) return message.info(`${i} ni kiriting`);

        body[i] = e[i];
    }




    let date = new Date(body.brithday);
    // if(date > new Date()) message.
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');

    body.brithday = `${year}-${month}-${day}`;

    let backend = await fetch(`${url}admin/changeProfil`, {
        method: "POST",
        headers: {
            '-x-token': token,
            "Content-Type": "application/json; charset=utf-8",

        },
        body: JSON.stringify(body)
    });
    if (backend.status == 200) { store.getProfil(); return message.success("O'zgartirildi"); }
    if (backend.status == 401) return window.location.href = '/dean/login';

    if (backend.status == 400) {
        backend = await backend.json();
        message.error(backend.error);
    }
}
</script>
