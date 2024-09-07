<template>
  <div>
    <div class="flex justify-between items-center">
      <span class="text-[20px] font-bold">Statistika</span>
      <div class="flex gap-2 items-center">
        <n-radio-group v-model:value="days" size="small">
          <n-radio-button :value="7">7 kun</n-radio-button>
          <n-radio-button :value="14">14 kun</n-radio-button>
          <n-radio-button :value="30">30 kun</n-radio-button>
        </n-radio-group>
        <n-button size="small" @click="callbackend" :loading="loading">
          <i class="fas fa-rotate"></i>
        </n-button>
      </div>
    </div>

    <n-spin :show="loading">
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
      <div v-for="i in kartalar" :key="i.label" class="bg-white rounded-xl shadow p-4 flex items-center gap-4 cursor-pointer hover:shadow-lg duration-300" @click="i.to && router.push(i.to)">
        <div :class="i.rang" class="w-[50px] h-[50px] rounded-xl flex items-center justify-center text-white text-[20px]">
          <i :class="i.icon"></i>
        </div>
        <n-statistic :label="i.label" :value="i.value" />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
      <div class="bg-white rounded-xl shadow p-4 lg:col-span-2">
        <div class="font-bold mb-3">Kunlik murojaatlar</div>
        <div class="flex items-end gap-[3px] h-[200px] border-b border-gray-300">
          <n-tooltip v-for="i in data.kunlik" :key="i.kun" trigger="hover">
            <template #trigger>
              <div class="flex-1 bg-teal-500 hover:bg-teal-700 rounded-t duration-200 min-h-[2px]"
                :style="{ height: (i.soni / maxKun * 100) + '%' }"></div>
            </template>
            {{ i.kun }} : {{ i.soni }} ta
          </n-tooltip>
        </div>
        <div class="flex justify-between text-[11px] text-gray-500 mt-1">
          <span>{{ data.kunlik.length ? data.kunlik[0].kun : '' }}</span>
          <span>{{ data.kunlik.length ? data.kunlik[data.kunlik.length - 1].kun : '' }}</span>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow p-4">
        <div class="font-bold mb-3">Holatlar bo'yicha</div>
        <div v-for="i in data.holatlar" :key="i.id" class="mb-3">
          <div class="flex justify-between text-[13px]">
            <span>{{ holatNomi(i.name) }}</span>
            <span class="font-bold">{{ i.soni }}</span>
          </div>
          <n-progress type="line" :percentage="foiz(i.soni)" :color="holatRang[i.name]" :show-indicator="false" />
        </div>
        <div class="text-[12px] text-gray-500 mt-4">Korzinkada: {{ data.apeal.korzinka }} ta</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
      <div class="bg-white rounded-xl shadow p-4">
        <div class="font-bold mb-3 flex justify-between">
          <span>Oxirgi murojaatlar</span>
          <router-link to="/allApeals" class="text-teal-600 text-[13px]">Barchasi</router-link>
        </div>
        <n-empty v-if="!data.oxirgilar.length" description="Murojaat yo'q" />
        <div v-for="i in data.oxirgilar" :key="i.id" class="flex justify-between items-center border-b py-2 text-[14px]">
          <div>
            <div class="font-bold">{{ i.lastname }} {{ i.firstname }}</div>
            <div class="text-gray-500 text-[12px]">{{ i.phone }}</div>
          </div>
          <div class="text-right">
            <n-tag size="small" :color="{ color: holatRang[i.statusname], textColor: '#fff' }">{{ holatNomi(i.statusname) }}</n-tag>
            <div class="text-gray-500 text-[11px]">{{ new Date(i.created_at).toLocaleString() }}</div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow p-4">
        <div class="font-bold mb-3 flex justify-between">
          <span>Yaqin tadbirlar</span>
          <router-link to="/Kalindar" class="text-teal-600 text-[13px]">Kalindar</router-link>
        </div>
        <n-empty v-if="!data.yaqinTadbirlar.length" description="Tadbir yo'q" />
        <div v-for="i in data.yaqinTadbirlar" :key="i.id" class="flex justify-between items-center border-b py-2 text-[14px]">
          <div>
            <div class="font-bold">{{ i.title }}</div>
            <div class="text-gray-500 text-[12px]">{{ i.location || 'Joylashuv yo\'q' }}</div>
          </div>
          <div class="text-right text-[12px]">
            <div>{{ new Date(i.start_time).toLocaleString() }}</div>
            <div class="text-gray-500">{{ new Date(i.end_time).toLocaleString() }}</div>
          </div>
        </div>
      </div>
    </div>
    </n-spin>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import url from "../../base";

const router = useRouter();
const message = useMessage();
let loading = ref(false);
let days = ref(14);

let data = ref({
  apeal: { jami: 0, korzinka: 0, bugun: 0, hafta: 0, oy: 0, kechikkan: 0 },
  holatlar: [],
  kunlik: [],
  tadbir: { jami: 0, hozir: 0, yaqin: 0 },
  oxirgilar: [],
  yaqinTadbirlar: []
});

let holatRang = {
  seen: '#16a34a',
  notseen: '#2563eb',
  panding: '#f59e0b',
  cancel: '#dc2626'
};

let holatNomi = (n) => ({ seen: "Ko'rilgan", notseen: "Ko'rilmagan", panding: "Kutilmoqda", cancel: "Bekor qilingan" }[n] || n);

let kartalar = computed(() => [
  { label: "Jami murojaatlar", value: data.value.apeal.jami, icon: "fas fa-users", rang: "bg-teal-500", to: "/allApeals" },
  { label: "Bugun", value: data.value.apeal.bugun, icon: "fas fa-calendar-day", rang: "bg-blue-500", to: "/allApeals" },
  { label: "Shu oy", value: data.value.apeal.oy, icon: "fas fa-chart-line", rang: "bg-indigo-500" },
  { label: "Kechikkan", value: data.value.apeal.kechikkan, icon: "fas fa-clock-rotate-left", rang: "bg-red-500", to: "/Notification_apeal" },
  { label: "Shu hafta", value: data.value.apeal.hafta, icon: "fas fa-calendar-week", rang: "bg-cyan-600" },
  { label: "Hozirgi tadbirlar", value: data.value.tadbir.hozir, icon: "fas fa-bell", rang: "bg-amber-500", to: "/" },
  { label: "7 kunlik tadbirlar", value: data.value.tadbir.yaqin, icon: "fas fa-calendar-plus", rang: "bg-lime-600", to: "/Kalindar" },
  { label: "Jami tadbirlar", value: data.value.tadbir.jami, icon: "fas fa-receipt", rang: "bg-gray-700", to: "/Kalindar" },
]);

let maxKun = computed(() => Math.max(1, ...data.value.kunlik.map(i => i.soni)));

let foiz = (n) => {
  let jami = data.value.holatlar.reduce((a, b) => a + b.soni, 0);
  if (!jami) return 0;
  return Math.round(n / jami * 100);
}

let callbackend = async () => {
  loading.value = true;
  try {
    let backend = await fetch(`${url}stats?days=${days.value}`, {
      headers: { "Content-Type": "application/json; charset=utf-8", '-x-token': localStorage.token }
    });
    if (backend.status == 401) return router.push('/login');
    if (backend.status == 200) {
      data.value = await backend.json();
    }
  } catch (error) {
    message.error("Server bilan aloqa uzildi")
  }
  loading.value = false;
}

watch(days, () => callbackend());
onMounted(() => callbackend());
</script>
