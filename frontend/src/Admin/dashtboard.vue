<template>
    <div class="bg-gray-200  overflow-hidden w-[100vw] h-[100vh]">
        <div class="w-full h-[50px] flex justify-between items-center bg-gray-900">
            <Router-link to="/" class="text-white">
                <span
                    class="me-5 flex justify-center w-[240px]  block absolute text-white select-none text-[28px] flex items-center gap-1 top-[10px] left-[10px] font-semibold">
                    <!-- <span class="text-[13px] rotate-45 duration-100"><i class="fas fa-square"></i></span> -->
                    <img src="/aileet.png" class="w-[40px]" alt="">
                    {{ ('Aileet') }}
                </span>
            </Router-link>

            <div class="flex gap-3 items-center">
                <ring />
                <n-dropdown disabled trigger="hover" :options="options_lang" @select="changeLang">
                    <n-button>
                        <img :src="toggle == 'uz' ? '/1670868198_grizly-club-p-flag-uzbekistana-png-9.png' : '/EM7LidKw8aA.jpg'"
                            class="w-[25px]" lt="">
                    </n-button>
                </n-dropdown>

                <div class="h-full w-[200px] cursor-pointer me-4">
                    <n-dropdown trigger="hover" :options="options" @select="handleSelect">
                        <div class="h-full ps-3 flex items-center w-full border-s-[1px]">
                            <img :src="`${url}/${data.profil_url}`" class="w-[40px] h-[40px] rounded-[50%]" alt="">
                            <div class="flex flex-col">
                                <span class="text-white font-bold ps-3">{{ data.lastname }} {{ data.firstname }}</span>
                                <span class="text-white text-[12px] text-center">Admin</span>
                            </div>
                        </div>
                    </n-dropdown>
                </div>

            </div>
        </div>




        <n-layout class="h-full" has-sider>
            <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="240" show-trigger
                :inverted="inverted" :collapsed="collapsed" @collapse="collapsed = true" @expand="collapsed = false">
                <n-menu class="" :inverted="inverted" :collapsed-width="64" :collapsed-icon-size="22"
                    :options="menuOptions" />
            </n-layout-sider>
            <n-layout>
                <div class="p-3 pb-[100px] ">

                    <RouterView></RouterView>

                </div>
            </n-layout>
        </n-layout>
    </div>


    <n-modal v-model:show="showModal" class="custom-card" preset="card" :style="bodyStyle"
        title=" Profil rasmini o'zgartirish" :bordered="false" size="huge" :segmented="segmented">
        <template #header-extra>

        </template>
        <form @submit.prevent="handleSubmit">
            <label for="picture">
                <div v-if="!showsend" class="w-[500px] cursor-pointer flex justify-center text-teal-500">
                    <i class="fas fa-cloud-arrow-up text-[40px] text-center"></i>
                </div>
            </label>
            <input type="file" id="picture" class="hidden" accept="image/*" @change="handleFileChange" />

            <img v-if="imageUrl" class="w-[300px] h-[300px] block mx-auto rounded-[50%]" :src="imageUrl" alt="">
            <div class='flex w-[600px] mx-auto mt-3 justify-around items-baseline'>



                <label for="picture">
                    <div v-if="showsend" id="bt"
                        class="rounded pe-3 ps-3 px-5 py-3 min-w-max overflow-hidden shadow  relative bg-teal-500 text-white hover:bg-opacity-90">
                        <i class="fas fa-camera"></i>
                    </div>
                </label>

                <button v-if="showsend" type="submit" id="bt"
                    class="rounded px-5 py-3 min-w-max overflow-hidden shadow block relative bg-teal-500 text-white hover:bg-opacity-90">
                    Almashtirish
                </button>

            </div>
        </form>
        <template #footer>
            ###
        </template>
    </n-modal>
</template>

<script setup>
import { ref, h, onUnmounted, onMounted, watch } from 'vue';
import url from "../../base"
import { RouterLink, useRouter } from "vue-router";
import { useMessage } from "naive-ui";
import { Dean } from "../../Pinia/index.js";
import ring from "./component/ring.vue"


let store = Dean();

let bodyStyle = {
    width: "600px"
};
let segmented = {
    content: "soft",
    footer: "soft"
};
let showModal = ref(false)
    ;

let sendfile = ref(null);
let form;
const imageUrl = ref(null);
let showsend = ref(false)
const handleFileChange = (event) => {
    const file = event.target.files[0];
    sendfile.value = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        form = new FormData();
        form.append('image', file);
        showsend.value = true;
        const reader = new FileReader();
        reader.onload = () => {
            imageUrl.value = reader.result;
        };
        reader.readAsDataURL(file);
    } else {
        message.error('Please select a valid image file.');
        event.target.value = '';
    }
};

const handleSubmit = async () => {
    let token = localStorage.token;
    if (showsend.value) {





        let backend = await fetch(`${url}admin/changePhoto`, {
            method: "POST",
            headers: {
                '-x-token': token
            },
            body: form
        });
        if (backend.status == 200) {
            showsend.value = false;
            imageUrl.value = null;
            showModal.value = false;
            getProfil();
            return;
        }
        if (backend.status == 401) return router.push('/login');
        if (backend.status == 400) {
            backend = await backend.json();


            message.error(backend.error);

            return;
        }
        imageUrl.value = null;
        backend = await backend.json();

        showsend.value = false;
    } else {
        message.error('No image selected.');
    }
};







// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////










let data = ref({
    profil_url: '',
    lastname: '',
    firstname: ''
})
const router = useRouter();
async function getProfil() {
    let status = await store.getProfil();
    if (status == 401) router.push('/login')

    data.value = store.profile;
}
onMounted(async () => {
    await getProfil();
});
let toggle = ref('uz');
let options_lang = [{ label: "O'zb", key: "uz" }, { label: "En", key: 'en' }];



function changeLang(key) {
    if (String(key) == 'en') { localStorage.setItem('lang', 'en'); toggle.value = 'en'; }
    if (String(key) == 'uz') { localStorage.setItem('lang', 'uz'); toggle.value = 'uz'; }
}
function renderIcon(className) {
    return () => h("i", { class: className });
}

function renderIconSpan(name) {
    return () => h("span", { class: "material-symbols-outlined" }, { default: () => name });
}

let inverted = ref(true)
const menuOptions = [

    {
        label: "Murojaatlar",
        key: "pinball-1973",
        icon: renderIconSpan("group"),
        disabled: false,
        children: [
            {
                label: () => h(
                    RouterLink,
                    {
                        to: "/allApeals"
                    },
                    { default: () => ('Murojaatlar') }),
                key: "addWorker",
                icon: renderIconSpan("group_add")
            },
            {
                label: () => h(
                    RouterLink,
                    {
                        to: "/Notification_apeal"
                    },
                    { default: () => "Kutilyotgan murojaatlar" }),
                key: "Notification_apeal ",
                icon: renderIcon("fas fa-clock-rotate-left")
            },
            {
                label: () => h(
                    RouterLink,
                    {
                        to: "/Kalindar"
                    },
                    { default: () => "Kalindar" }),
                key: "issues ",
                icon: renderIcon("fas fa-receipt")
            },


        ]
    },
    {
        label: "Tizim",
        key: "Tizim",

        icon: renderIconSpan("engineering"),
        children: [
            {
                label: () => h(
                    RouterLink,
                    {
                        to: "/editprofil"
                    },
                    { default: () => "Profilni tahrirlash" }),
                key: "Davomat",
                icon: renderIcon("fas fa-user-pen")
            },

            {
                label: () => h(
                    RouterLink,
                    {
                        to: "/changepassword"
                    },
                    { default: () => "Parolni almashtirish" }),
                key: "changepassword",
                icon: renderIcon("fas fa-lock")
            }

        ]
    },
    {
        label: () => h(
            RouterLink,
            {
                to: "/korzinka"
            },
            { default: () => "Korzinka" }),
        key: "kontrakt",
        icon: renderIcon("far fa-trash-can"),

    },
    {
        label: () => h(
            RouterLink,
            {
                to: "/login"
            },
            { default: () => "Tizimdan chiqish" }),
        key: "reihufhjcnvxm",
        icon: renderIcon("fas fa-arrow-right-from-bracket"),


    }
];

const message = useMessage();

const options = ref([

    {
        key: "header",
        type: "render",
        render: () => h("div", { class: "flex p-3 pb-0 ps-2 w-[215px]" },
            [
                h("div", { class: "flex items-center select-none" }, [
                    h("img", {
                        round: true,
                        style: "margin-right: 8px;",
                        src: `${url}/${data.value.profil_url}`,
                        class: "w-[60px] rounded-md m-3",
                        title: `${data.value.lastname} ${data.value.firstname}`
                    }),

                    h('div',
                        [
                            h("div", { class: "text-[13px] font-bold" }, h("div",
                                { innerHTML: `${data.value.lastname} ${data.value.firstname}` }
                            )),

                            h("div", { class: "text-[13px] text-center" }, h("div",
                                { innerHTML: `Admin ` }
                            )),
                        ])
                ])

            ]
        )
    },
    {
        key: "header-divider",
        type: "divider"
    },


    {
        key: "Own_info",
        type: "render",
        label: "salom",
        render: () => {
            return h("div", { class: "ps-4 duration-700 flex items-center hover:bg-blue-200 cursor-pointer flex border-t-[1px] border-solid" }, [
                h("span",

                    { innerHTML: `<span class="text-[20px] text-blue-950"><i class="fas fa-user-check"></i></span>` },
                    { class: "" }
                ),
                h("div",
                    { class: "text-black ps-3" },
                    { default: () => "Shaxsiy ma'lumotlar" }
                )
            ])
        },
        props: {
            onClick: () => {
                router.push('/editprofil')
            }
        }
    },
    {
        key: "update_photo",
        type: "render",
        label: "salom",
        render: () => {
            return h("div", { class: "ps-4 duration-700 flex items-center hover:bg-blue-200 cursor-pointer flex border-t-[1px] border-solid" }, [
                h("span",

                    { innerHTML: `<span class="text-[20px] text-blue-950"><i class="fas fa-camera-rotate"></i></span>` },
                    { class: "" }
                ),
                h("div",
                    { class: "text-black ps-3" },
                    // { innerHTML: () => "Profil rasmini yangilash" },
                    [h("label", { innerHTML: "Profil rasmini yangilash" }, { class: "text-red-600 ps-3" })]
                )
            ])
        },
        props: {
            onClick: () => {
                showModal.value = true;
            }
        }
    },
    {
        key: "sign_out",
        type: "render",
        label: "salom",
        render: () => {
            return h("div", { class: "ps-4 duration-700 flex items-center hover:bg-red-200 cursor-pointer flex border-t-[1px] border-solid" }, [
                h("span",

                    { innerHTML: `<span class="text-[20px] text-red-800"><i class="fas fa-arrow-right-from-bracket"></i></span>` },
                    { class: "" }
                ),
                h("div",
                    { class: "text-red-800 ps-3" },
                    { default: () => "Tizimdan chiqish" }
                )
            ])
        },
        props: {
            onClick: async() => {
                 
  try {
    const response = await fetch(`${url}admin/logout`, {
      method: 'POST',
      credentials: 'include', // Include cookies in the request
    });

    if (response.ok) {
      // Clear any client-side stored data, if necessary
      // e.g., localStorage.removeItem('token');

      // Redirect to the login page or homepage
      router.push('/login');
    } else {
      console.error('Logout failed:', await response.text());
      // Handle the case where the server responded with an error
    }
  } catch (error) {
    console.error('Logout failed:', error);
    // Handle any network errors, etc.
  }
}
            }
        }
    
]);

function handleSelect(key) {
    message.info(String(key));

}

let collapsed = ref(localStorage.collapsed == "true" ? true : false);
watch(collapsed, (collapsed, old) => {
    if (collapsed)
        localStorage.setItem("collapsed", "true")
    else
        localStorage.setItem("collapsed", "false")
})
</script>

<style>
.material-symbols-outlined {
    font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24
}

::-webkit-scrollbar-track {
    border: 1px solid white;

    background-color: #b2bec3;
}

::-webkit-scrollbar {
    width: 8px;
    background-color: #dfe6e9;
}

::-webkit-scrollbar-thumb {
    background-color: rgb(0, 20, 40);
    border-radius: 5px;
}
</style>