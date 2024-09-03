<template>
    <n-form ref="formRef" inline :label-width="80" :model="formValue" :rules="rules" :size="size" class="flex flex-wrap justify-center">
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
            <!-- <n-form-item label="Tags" path="tags">
                <n-input type="textarea" :autosize="{
                    minRows: 3,
                    maxRows: 5,
                }" v-model:value="formValue.tags" @keydown.space.prevent="spacekey" placeholder="Teglar" />
            </n-form-item> -->
            <n-dynamic-tags  v-model:value="formValue.tags" />

        </div>
        <n-form-item label="Havola" path="url">
            <n-input v-model:value="formValue.url" placeholder="Title" />
        </n-form-item>
        <div class="flex justify-end">
            <n-form-item>
                <n-button @click="handleValidateClick">
                    Qo'shish
                </n-button>
            </n-form-item>
        </div>
    </n-form>
</template>

<script setup>
import { ref } from 'vue';
import { Dean } from '../../../Pinia';
import url from "../../../base";
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';

let message = useMessage();
const router = useRouter();
const store = Dean();

const formRef = ref(null);
const size = ref('small');
const formValue = ref({
    title: '',
    start_time: null,
    end_time: null,
    description: null,
    tags: [],
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
    // tags: {
    //     required: false,
    //     trigger: ["blur", "change"],
    //     message: "Taglarni kiriting"
    // },
    location: {
        required: false,
        trigger: ["blur", "change"],
        message: "Joylashuvni kiriting"
    },
    url: {
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
                if(data.tags) {
                    // data.tags.forEach((let i, let j)=> {data.tags[j] = data.tags[j].trim()})
                    
                    
                    data.tags = data.tags.join('');
                }
                if (data.url) data.url = `https://${data.url}`;
                    
                
                let backend = await fetch(`${url}calendar/addcalendar`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        '-x-token': token
                    },
                    body: JSON.stringify(data)
                });

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
                
            }
        } else {
            message.error('Invalid');
        }
    });
};

let spacekey = function () {
    if (formValue.value.tags) {
        formValue.value.tags = formValue.value.tags.trim();
        formValue.value.tags = formValue.value.tags
            .split(' ')
            .map(word => `#${word}`)
            .join(' ') + ' ';
        formValue.value.tags = formValue.value.tags.replace(/#{2,}/g, '#');
    }
};
</script>

<style lang="scss" scoped></style>
