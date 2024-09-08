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
            <n-input v-model:value="formValue.location" placeholder="Masalan: Toshkent ofis" />
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
            <n-dynamic-tags  v-model:value="formValue.tags" />

        </div>
        <n-form-item label="Havola" path="url">
            <n-input v-model:value="formValue.url" placeholder="example.com">
                <template #prefix>https://</template>
            </n-input>
        </n-form-item>
        <div class="flex justify-end">
            <n-form-item>
                <n-button type="primary" :loading="loading" @click="handleValidateClick">
                    {{ props.item ? "Saqlash" : "Qo'shish" }}
                </n-button>
            </n-form-item>
        </div>
    </n-form>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Dean } from '../../../Pinia';
import url from "../../../base";
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';

const props = defineProps({
    item: {
        type: Object,
        default: null
    }
});

let message = useMessage();
let loading = ref(false);
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

onMounted(() => {
    if (!props.item) return;
    let i = props.item;
    formValue.value = {
        title: i.title || '',
        start_time: new Date(i.time.start).getTime(),
        end_time: new Date(i.time.end).getTime(),
        description: i.description,
        tags: i.tags ? i.tags.split(/\s+/).filter(Boolean) : [],
        location: i.location,
        url: i.url ? i.url.replace(/^https?:\/\//, '') : null
    };
});

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
                if (data.tags) data.tags = data.tags.map(t => t.trim()).join(' ');
                if (data.url) data.url = `https://${data.url}`;
                if (props.item) {
                    ['tags', 'location', 'url'].forEach(k => { if (!data[k]) data[k] = ''; });
                }
                loading.value = true;

                let manzil = props.item ? `${url}calendar/edit/${props.item.id}` : `${url}calendar/addcalendar`;
                let backend = await fetch(manzil, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        '-x-token': token
                    },
                    body: JSON.stringify(data)
                });

                loading.value = false;
                if (backend.status == 401) return router.push('/login');
                if (backend.status == 400 || backend.status == 404) {
                    backend = await backend.json();
                    message.error(backend.error);
                    return;
                }

                if (backend.status == 201 || backend.status == 200) {
                    message.success("Saqlandi");
                    store.modals.addcalendar.show = false;
                    store.modals.editcalendar.show = false;
                    router.go(0);
                    return;
                }

            } catch (error) {
                loading.value = false;
                message.error("Server bilan aloqa uzildi");
            }
        } else {
            message.error("Formani to'g'ri to'ldiring");
        }
    });
};

</script>

<style lang="scss" scoped></style>
