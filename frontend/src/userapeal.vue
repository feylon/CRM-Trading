<template>
    <div class="bg-gray-900 h-[100vh]">

        <div class="max-w-screen-xl bg-gray-900 mx-auto mt-[-20px] tradingbackfull my-7 lg:px-20 " id="contact">
            <form @submit.prevent="submit({ firstname, lastname, phone, description })">
                <div
                    class="w-full tradingback p-8  pt-[-130px] pt-0 my-4 mr-auto shadow-2xl md:px-12 lg:w-9/12 lg:pl-20 lg:pr-40 rounded-2xl">
                    <div class="flex flex-col">
                        <h1 class="text-5xl text-blue-400  font-bold ">Ro'yxatdan o'ting</h1>
                        <h5 class="text-2xl text-blue-300  font-bold ">Biz siz bilan tezda bog'lanamiz</h5>

                    </div>
                    <div class="grid grid-cols-1 gap-5 mt-5 md:grid-cols-2">
                        <input required v-model="firstname"
                            class="w-full p-3 mt-2  bg-gray-900 text-blue-400 rounded-lg focus:outline-none focus:border-outline"
                            type="text" placeholder="Ismingiz" name="firstName" autocomplete="name" />
                        <input required v-model="lastname"
                            class="w-full p-3 mt-2  bg-gray-900 text-blue-400 rounded-lg focus:outline-none focus:shadow-outline"
                            type="text" placeholder="Familiyangiz" name="lastName" autocomplete="family-name" />

                        <input @input="formatPhoneNumber" required v-model="phone" maxlength="17"
                            class="w-full p-3 mt-2  bg-gray-900 text-blue-400 rounded-lg focus:outline-none focus:shadow-outline"
                            type="tel" placeholder="+998 90 123 45 67" name="phone" autocomplete="tel" />
                    </div>
                    <div class="my-4">
                        <textarea required v-model="description" placeholder="Message"
                            class="w-full h-32 p-3 mt-2 bg-gray-900 text-blue-400 bg-gray-100 rounded-lg focus:outline-none focus:shadow-outline"
                            name="message" autocomplete="message"></textarea>
                    </div>
                    <div class="flex justify-end w-[100%]">
                        <div class="w-1/2 my-2 lg:w-1/4">
                            <button type="submit" :disabled="yuborilmoqda"
                                class="disabled:opacity-50 w-full p-3 text-sm font-bold tracking-wide text-gray-100 uppercase bg-gray-800 rounded rounded-xl hover:bg-blue-700 transition-all duration-300-md focus:outline-none focus:shadow-outline">
                                {{ yuborilmoqda ? "Yuborilmoqda..." : "Yuborish" }}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            <div class="w-full px-8 py-12 ml-auto bg-[#1B6485] lg:-mt-96 lg:w-2/6 rounded-2xl">
                <div class="flex flex-col text-white">
                    <div class="flex w-2/3 my-4 lg:w-1/2">
                        <img class="pt-2 pr-2 h-7 w-7" src="/office.png"
                            alt="location">
                        <div>
                            <h2 class="text-2xl">Office</h2>
                            <p class="text-gray-200" style="white-space: nowrap;">27B Grassfield, Lumely</p>
                        </div>
                    </div>
                    <div class="flex w-2/3 my-4 lg:w-1/2">
                        <img class="pt-2 pr-2 h-7 w-7 " src="/office.png" alt="call us">
                        <div>
                            <h2 class="text-2xl">Call</h2>
                            <p class="text-gray-200" style="white-space: nowrap;">Tel:+232-79-15-39-15</p>
                        </div>
                    </div>
                    <div class="flex w-2/3 my-4 lg:w-1/2">
                        <img class="pt-2 pr-2 h-7 w-7" src="/office.png" alt="Email us">
                        <div>
                            <h2 class="text-2xl">Email</h2>
                            <p class="text-gray-200" style="white-space: nowrap;">Email:kanujosephmelvin@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import url from "../base";
import { useMessage } from "naive-ui";
import { ref } from "vue";
let message = useMessage();
let firstname = ref('');
let lastname = ref('');
let phone = ref('');
let description = ref('');
let yuborilmoqda = ref(false);

let submit = async function (obj) {
    let raqam = obj.phone.replace(/\D/g, '');
    if (raqam.length != 12) return message.warning("Telefon raqamni to'liq kiriting");
    yuborilmoqda.value = true;
    try {
        let backend = await fetch(`${url}addApeal`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(obj)
        });
        
        if (backend.status == 201) {
            firstname.value = '';
            lastname.value = '';
            phone.value = '';
            description.value = '';
            message.success("Siz bilan tez orada bog'lanamiz");
            return;
        }
        let javob = await backend.json();
        message.error(javob.error || "Xatolik yuz berdi");
    } catch (error) {
        message.error("Server bilan aloqa yo'q, keyinroq urinib ko'ring");
    } finally {
        yuborilmoqda.value = false;
    }
}



let  formatPhoneNumber = function () {
    let r = phone.value.replace(/\D/g, '');
    if (!r.startsWith('998')) r = '998' + r;
    r = r.slice(0, 12);
    let t = '+' + r.slice(0, 3);
    if (r.length > 3) t += ' ' + r.slice(3, 5);
    if (r.length > 5) t += ' ' + r.slice(5, 8);
    if (r.length > 8) t += ' ' + r.slice(8, 10);
    if (r.length > 10) t += ' ' + r.slice(10, 12);
    phone.value = t;
  }

</script>

<style>
.tradingback {
    background-image: url('./tradingback1.png');
    background-size: cover;
}
</style>