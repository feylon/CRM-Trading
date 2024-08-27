<template>
<<<<<<< HEAD
=======



>>>>>>> 0e2964ed275a97c2f0cf0b22b2ce68a888363237
    <n-form ref="formRef" inline :label-width="80" :model="formValue" :rules="rules" :size="size"
        class="flex flex-wrap justify-center">

        <n-form-item label="Boshlanish vaqti" path="start_time">
            <n-date-picker v-model:value="formValue.start_time" type="datetime" />
        </n-form-item>


        <n-form-item label="Tugash vaqti" path="end_time">
            <n-date-picker v-model:value="formValue.end_time" type="datetime" />
        </n-form-item>


        <n-form-item label="Title" path="title">
            <n-input v-model:value="formValue.title" placeholder="Title" />
        </n-form-item>

        <n-form-item label="Joylashuv" path="location">
            <n-input v-model:value="formValue.location" placeholder="Title" />
        </n-form-item>


        <div class="w-[600px]">

            <n-form-item label="Description" path="description">
                <n-input v-model:value="formValue.description" placeholder="Textarea" type="textarea" :autosize="{
                    minRows: 3,
                    maxRows: 5,
                }" />
            </n-form-item>
        </div>

        <div class="w-[600px]">

            <n-form-item label="Tags" path="tags">
                <n-input type="textarea" :autosize="{
                    minRows: 3,
                    maxRows: 5,
                }" v-model:value="formValue.tags" @keydown.space.prevent="spacekey" placeholder="Teglar" />
            </n-form-item>
        </div>

        <n-form-item label="Havola" path="url">
            <n-input v-model:value="formValue.url" placeholder="Title" />
        </n-form-item>

        <div class="flex justify-end">

            <n-form-item>
<<<<<<< HEAD
                
=======

>>>>>>> 0e2964ed275a97c2f0cf0b22b2ce68a888363237
                <n-button @click="handleValidateClick">
                    Qo'shish
                </n-button>
            </n-form-item>
        </div>
    </n-form>

<<<<<<< HEAD
=======
    <pre>{{ JSON.stringify(formValue, null, 2) }}</pre>
>>>>>>> 0e2964ed275a97c2f0cf0b22b2ce68a888363237
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


<<<<<<< HEAD

const formRef = ref(null);

=======
// setTimeout(() => {
//     store.modals.addcalendar.show = false;
// }, 3000);
const formRef = ref(null);

>>>>>>> 0e2964ed275a97c2f0cf0b22b2ce68a888363237
const size = ref('small');
const formValue = ref({


    title: '',
    start_time: null,
    end_time: null,
    description: null,
    tags: null,
    location: null,
    url: null
});

const rules = {


    title: {
        required: true,
        message: 'Titleni kiriting',
        trigger: ['input']
    },
    start_time: {
        type: "number",
        required: true,
        trigger: ["blur", "change"],
        message: "Boshlanish vaqtni belgilang"
    },

    end_time: {
        type: "number",
        required: true,
        trigger: ["blur", "change"],
        message: "Tugash vaqtini belgilang"
    },


    description: {
        required: true,
        trigger: ["blur", "input"],
        message: "Descriptionni kiriting"
    },
    tags: {
<<<<<<< HEAD

=======
        // type: "number",
>>>>>>> 0e2964ed275a97c2f0cf0b22b2ce68a888363237
        required: false,
        trigger: ["blur", "change"],
        message: "Taglarni kiriting"
    },
    location: {
<<<<<<< HEAD

=======
        // type: "number",
>>>>>>> 0e2964ed275a97c2f0cf0b22b2ce68a888363237
        required: false,
        trigger: ["blur", "change"],
        message: "Joylasuhvni kiriting"
    },

    url: {
<<<<<<< HEAD

=======
        // type: "number",
>>>>>>> 0e2964ed275a97c2f0cf0b22b2ce68a888363237
        required: false,
        trigger: ["blur", "change"],
        message: "Havolani kiriting"
    }
};

const handleValidateClick = async (e) => {
    e.preventDefault();
    formRef.value?.validate(async (errors) => {
        if (!errors) {
            try {
                let token = localStorage.token;
                let data = {};
                for (let i in formValue.value) {
                    if (formValue.value[i]) {
                        data[i] = formValue.value[i];
                    }

                }
<<<<<<< HEAD
                if (data.url) data.url = `https://${data.url}`;
=======
                console.log(data)
>>>>>>> 0e2964ed275a97c2f0cf0b22b2ce68a888363237

                let backend = await fetch(`${url}calendar/addcalendar`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        '-x-token': token
                    },
                    body: JSON.stringify(data)
                });

<<<<<<< HEAD
=======
                console.log(backend.status);
>>>>>>> 0e2964ed275a97c2f0cf0b22b2ce68a888363237
                if (backend.status == 400) {
                    backend = await backend.json();
                    message.error(backend.error);
                    return;
                }

                if (backend.status == 201) {
                    backend = await backend.json();
                    message.success("Saqlandi");
                    store.modals.addcalendar.show = false;
                    router.go(0);


                    return;
                }

            } catch (error) {
<<<<<<< HEAD

            }
        } else {

            message.error('Formani to`ldiring');
=======
                console.log(error)
            }
        } else {
            console.log(errors);
            message.error('Invalid');
>>>>>>> 0e2964ed275a97c2f0cf0b22b2ce68a888363237
        }
    });
};


let spacekey = function () {
<<<<<<< HEAD

=======
    console.log('space');
>>>>>>> 0e2964ed275a97c2f0cf0b22b2ce68a888363237
    if (formValue.value.tags) {
        formValue.value.tags = formValue.value.tags.trim();

        formValue.value.tags = formValue.value.tags
<<<<<<< HEAD
            .split(' ')
            .map(word => `#${word}`)
            .join(' ') + ' ';
        formValue.value.tags = formValue.value.tags.replace(/#{2,}/g, '#');


    }

=======
            .split(' ')        // Split the string by spaces into an array
            .map(word => `#${word}`)  // Add '#' to each word
            .join(' ') + ' ';
        formValue.value.tags = formValue.value.tags.replace(/#{2,}/g, '#');

        // Join the array back into a string with spaces
    }
    console.log(formValue.value.tags);
>>>>>>> 0e2964ed275a97c2f0cf0b22b2ce68a888363237



}

</script>
<<<<<<< HEAD
=======

<style lang="scss" scoped></style>
>>>>>>> 0e2964ed275a97c2f0cf0b22b2ce68a888363237
