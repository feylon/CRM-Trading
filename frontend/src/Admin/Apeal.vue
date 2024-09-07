<template>
  <div>
    <div class="overflow-x-auto custom-scroll pb-[50px]">
      <p class="text-lg">
        <span class="text-[20px] font-bold">
          Murojaatlar
        </span>
      </p>
      <div class="mx-auto select-auto mt-5 w-full lg:w-[1200px] items-center gap-4 flex flex-col">

        <div class="flex flex-wrap gap-3 w-full items-center bg-white p-3 rounded-lg shadow-sm">
          <div class="w-[260px]">
            <n-input v-model:value="search" clearable placeholder="Ism, familiya, telefon..." @keyup.enter="qidir">
              <template #prefix><i class="fas fa-magnifying-glass text-gray-400"></i></template>
            </n-input>
          </div>
          <div class="w-[170px]">
            <n-select v-model:value="status" :options="statuslar" clearable placeholder="Holati" />
          </div>
          <n-date-picker v-model:value="oraliq" type="daterange" clearable />
          <n-button type="primary" @click="qidir">Qidirish</n-button>
          <n-button @click="tozala" quaternary>Tozalash</n-button>
          <div class="flex-1"></div>
          <n-button type="success" :loading="exportLoading" @click="exportCsv">
            <i class="fas fa-file-csv me-2"></i> Yuklab olish
          </n-button>
        </div>

        <div class="container overflow-x-clip">

          <n-table v-if="!loading" :bordered="false" :single-line="false">
            <thead>
              <tr>
                <th>№</th>
                <th>
                  <div class="text-center">

                    F.I
                  </div>

                </th>

                <th>
                  <div class="text-center">Telefon raqami </div>
                </th>
                <th class="flex justify-center">Tasnifi</th>
                <th class="text-center">
                  <div class="text-center">Holati</div>
                </th>
                <th class="text-center">
                  <div class="text-center">Vaqti</div>
                </th>
                <th class="text-center">Tahrirlash</th>
                <th class="text-center">Qayta ko'rish</th>
                <th class="text-center ">
                  <div class="text-red-600">O'chirish</div>
                </th>



              </tr>
            </thead>
            <tbody>
              <tr v-for="(i, j) in data" class="bg-red-600" :key="new Number(i.id)">
                <td>{{( (j + 1) + (page - 1) * size ) }}</td>
                <td class="text-justify ps-4 font-bold"><span
                    :class="i.status == 4 ? 'line-through text-red-700' : ''">{{ i.lastname }} {{ i.firstname }}</span>
                </td>
                <td class="text-center select-text">{{ i.phone }}</td>
                <td class="text-center">{{ i.description }}</td>
                <td class="text-center"><n-tag size="small" :type="holatTur[i.statusname]">{{ holatNomi(i.statusname) }}</n-tag></td>
                <td class="text-center">{{ (new Date(i.created_at)).toLocaleString() }}</td>
                <td>
                  <div class="flex justify-center">
                    <n-badge :value="Number(i.comments)" :max="99" type="info">
                      <n-button type="tertiary" @click="editmodal(i)">
                        <i class="fas fa-pen"></i>
                      </n-button>
                    </n-badge>
                  </div>
                </td>

                <td v-if="i.reseen">
                  {{ (new Date(i.reseen)).toLocaleString() }}



                </td>
                <td v-else>Mavjud emas</td>
                <td>
                  <div class="flex justify-center">
                    <n-button type="error"
                      @click="deletemodal = true; deleteitem = i.id; deletecontent = `${i.lastname} ${i.firstname}dan kelgan taklifni o'chirasizmi ?`">
                      <i class="far fa-trash-can"></i>
                    </n-button>
                  </div>
                </td>

              </tr>

              <tr v-if="!data.length">
                <td colspan="9">
                  <n-empty description="Ma'lumot topilmadi" class="py-5" />
                </td>
              </tr>
            </tbody>
          </n-table>












          <n-table v-if="loading" :bordered="false" :single-line="false">
            <thead>
              <tr>
                <th>№</th>
                <th>
                  <div class="text-center">

                    F.I
                  </div>

                </th>

                <th>
                  <div class="text-center">Telefon raqami </div>
                </th>
                <th class="flex justify-center">Tasnifi</th>
                <th class="text-center">
                  <div class="text-center">Holati</div>
                </th>
                <th class="text-center">
                  <div class="text-center">Vaqti</div>
                </th>
                <th>####</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(i, j) in 5" :key="j">
                <td>{{+ + j + (page - 1) * size }}</td>
                <td class="text-center font-bold"><n-skeleton v-if="loading" height="40px" width="100%" /></td>
                <td class="text-center"><n-skeleton v-if="loading" height="40px" width="100%" /></td>
                <td class="text-center"><n-skeleton v-if="loading" height="40px" width="100%" /></td>
                <td class="text-center"><n-skeleton v-if="loading" height="40px" width="100%" /></td>
                <td class="text-center"><n-skeleton v-if="loading" height="40px" width="100%" /></td>
                <td class="text-center"><n-skeleton v-if="loading" height="40px" width="100%" /></td>

              </tr>

            </tbody>
          </n-table>
        </div>

        <n-pagination v-model:page="page" :page-count="sizecount" />
        <div class="font-bold"><span class="text-green-600">Barcha ma'lumotlar soni </span>: <span :title="total"> {{
          total }}</span></div>
      </div>
    </div>
  </div>


  <n-modal v-model:show="store.modals.editApeal.show" class="custom-card" preset="card" :style="{ width: '600px' }"
    :title="`${store.modals.editApeal.data.lastname} ${store.modals.editApeal.data.firstname}`" :bordered="true"
    size="huge" :segmented="{ content: 'soft', footer: 'soft' }">
    <editapeals />
  </n-modal>


  <n-modal v-model:show="deletemodal" preset="dialog" title="O'chirish" :content="deletecontent" positive-text="Ha"
    negative-text="Bekor qilindi" @positive-click="deletedata" @negative-click="cancelCallback" />



</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useMessage } from "naive-ui";
import url from "../../base/index";
import { Dean } from "../../Pinia/index.js";
import editapeals from "./Modals/editapeals.vue";


let store = Dean();

function editmodal(data) {
  store.modals.editApeal.show = true;
  store.modals.editApeal.data = data;

}
let deletecontent = ref('')
let deletemodal = ref(false);
let deleteitem = ref(null);

let deletedata = async function () {
  let token = localStorage.token;
  try {
    let backend = await fetch(`${url}apeal/edit/byid/${deleteitem.value}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        '-x-token': token
      }

    });
    if (backend.status == 200) {
      message.success("Ma'lumot korzinkaga o'tkazildi");

      callbackend(page.value);
      return;
    }
    if (backend.status == 401) {
      return router.push('/login')
    }
    if (backend.status == 400) {
      backend = await backend.json();
      message.error(backend.error)
    }
  } catch (error) {
  }

}

let cancelCallback = function () {

}



let page = ref(1);
let message = useMessage()
let size = ref(10);
let data = ref([]);
let sizecount = ref(1)
let loading = ref(false);
let total = ref(0)
let router = useRouter();

watch(page, (page, old) => {
  callbackend(page);

})

let search = ref('');
let status = ref(null);
let oraliq = ref(null);
let statuslar = ref([]);
let exportLoading = ref(false);
let holatTur = { seen: 'success', notseen: 'info', panding: 'warning', cancel: 'error' };
let holatNomi = (n) => ({ seen: "Ko'rilgan", notseen: "Ko'rilmagan", panding: "Kutilmoqda", cancel: "Bekor qilingan" }[n] || n);

let sanaStr = (t) => {
  let d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

let filterParams = () => {
  let p = {};
  if (search.value && search.value.trim()) p.search = search.value.trim();
  if (status.value) p.status = status.value;
  if (oraliq.value) {
    p.from = sanaStr(oraliq.value[0]);
    p.to = sanaStr(oraliq.value[1]);
  }
  return p;
}

let qidir = () => {
  if (page.value != 1) page.value = 1;
  else callbackend(1);
}

let tozala = () => {
  search.value = '';
  status.value = null;
  oraliq.value = null;
  qidir();
}

let timer;
watch(search, () => {
  clearTimeout(timer);
  timer = setTimeout(qidir, 500);
});
watch([status, oraliq], () => qidir());

let getStatuslar = async () => {
  try {
    let backend = await fetch(`${url}apeal/getapeal/apealstatus`, {
      headers: { '-x-token': localStorage.token }
    });
    if (backend.status == 200) {
      backend = await backend.json();
      statuslar.value = backend.map(i => ({ value: Number(i.id), label: holatNomi(i.name) }));
    }
  } catch (error) {
  }
}

let exportCsv = async () => {
  exportLoading.value = true;
  try {
    let backend = await fetch(`${url}apeal/getapeal/export?${new URLSearchParams(filterParams()).toString()}`, {
      headers: { '-x-token': localStorage.token }
    });
    if (backend.status == 401) return router.push('/login');
    if (backend.status != 200) {
      message.error("Yuklab bo'lmadi");
      return;
    }
    let blob = await backend.blob();
    let a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `murojaatlar_${sanaStr(Date.now())}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
  } catch (error) {
    message.error("Server bilan aloqa uzildi")
  } finally {
    exportLoading.value = false;
  }
}

let callbackend = async (page) => {
  data.value = [];
  loading.value = true;
  let token = localStorage.token; try {

    let backend = await fetch(`${url}apeal/getapeal/all?${(new URLSearchParams({ page: page, size: size.value, ...filterParams() })).toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          '-x-token': token
        }
      }
    );
    if (backend.status == 200) {
      backend = await backend.json();
      let jami = backend.length ? Number(backend[0].total) : 0;
      sizecount.value = Math.max(Math.ceil(jami / size.value), 1);
      data.value = [...backend]
      loading.value = false;
      total.value = jami;
      return;
    }
    loading.value = false;
    if (backend.status == 401) return router.push('/login');
  } catch (error) {
    loading.value = false;
    if (error.message == "Failed to fetch") return message.error("Server bilan aloqa uzildi")
  }
}

onMounted(async () => {
  getStatuslar();
  callbackend(1);
});

watch(
  () => store.modals.editApeal.loading,
  (data, old) => {
    if (data) {
      callbackend(page.value);
      store.modals.editApeal.loading = false;

    }


  }, { deep: true }
);



</script>

<style>
.custom-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgb(0, 20, 60) #eee;
}

.custom-scroll::-webkit-scrollbar {
  width: 8px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: rgb(0, 20, 60);
}

.custom-scroll::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 10px;
  border: 2px solid rgb(0, 20, 60);
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgb(0, 20, 60);
}


</style>