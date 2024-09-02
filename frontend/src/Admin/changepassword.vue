<template>
    <div>
        
        <p class="text-lg">
            <span class="text-[20px] font-bold">
                Parolni almashtirish
            </span>
          </p>
    </div>
    <div class="container mt-4 flex space-x-7">

        <div >
            <p class="font-bold">
                Eski parol
            </p>
<div class="w-[250px] mt-2"> 
    <n-input type="password"
      show-password-on="mousedown"
      placeholder="Password"
      :maxlength="18"
      v-model:value="oldpassword"
      ></n-input>
</div>
        </div>



        <div>
            <p class="font-bold">
                Yangi parol
            </p>
<div class="w-[250px] mt-2"> 
    <n-input type="password"
        v-model:value="newpassword"
      show-password-on="mousedown"
      placeholder="Password"
      :maxlength="18"></n-input>
</div>
        </div>


        <div>
            <p class="font-bold">
                Yagi  parol (qayta)
            </p>
<div class="w-[250px] mt-2"> 
    <n-input type="password"
    v-model:value="confirmpassword"
      show-password-on="mousedown"
      placeholder="Password"
      :maxlength="18"></n-input>
</div>
        </div>
    </div>


    <div class="flex justify-end mx-auto w-[75%] mt-5">
        <n-button @click="submit({oldpassword, newpassword, confirmpassword})">O'zgartirish</n-button>
    </div>


</template>

<script setup>
import url from "../../base";
import { useRouter } from "vue-router";
import { useMessage } from "naive-ui";
import {ref} from "vue";

let router = useRouter();
let oldpassword = ref("");
let newpassword = ref("");
let confirmpassword = ref("");
const message = useMessage();

const submit = async function (obj){
    try {
        let token = localStorage.token;
        let backend = await fetch(`${url}admin/changepassword`,
            {
                method : "POST",
                headers: {
          "Content-Type": "application/json; charset=utf-8",
          "-x-token": token,
        },
        body:JSON.stringify(obj)
            }
        );
       if(backend.status == 400){
        backend = await backend.json();
        message.error(backend.error);
        return
       }     
       if(backend.status == 401) {router.push("/login"); return;}

       if(backend.status == 201){
        oldpassword.value = '';
        newpassword.value = '';
        confirmpassword.value = '';
        message.success("Parol almashtrildi");
        return;
       }
    } catch (error) {

    }
}
</script>

