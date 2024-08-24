<template>
  <div>
    <div>
      <p class="text-lg">
        <span class="text-[20px] font-bold">
          Murojaatlar
        </span>
      </p>
      <div class="mx-auto select-auto mt-5 w-full lg:w-[1200px] items-center gap-4 flex flex-col">

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
                <td class="text-center">{{ i.statusname }}</td>
                <td class="text-center">{{ (new Date(i.created_at)).toLocaleString() }}</td>
                <td>
                  <div class="flex justify-center">
                    <n-button type="tertiary" @click="editmodal(i)">
                      <i class="fas fa-pen"></i>
                    </n-button>
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

  <!-- Modal section -->

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
// modal

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
      message.success("Ma'lumot o'chirilid");

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



// *modal
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

let callbackend = async (page) => {
  data.value = [];
  loading.value = true;
  let token = localStorage.token; try {

    let backend = await fetch(`${url}apeal/getapeal/all?${(new URLSearchParams({ page: page, size: size.value })).toString()}`,
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
      sizecount.value = Math.ceil(new Number(backend[0].total) / 10);
      data.value = [...backend]
      loading.value = false;
      total.value = backend[0].total;
      return;
    }
    if (backend.status == 401) return router.push('/login');
  } catch (error) {

    if (error.message == "Failed to fetch") return message.error("Server bilan aloqa uzildi")
  }
}

onMounted(async () => {
  callbackend(1);
});

watch(
  () => store.modals.editApeal.loading,
  (data, old) => {
    if (data) {
      callbackend(page.value);

    }


  }, { deep: true }
);



</script>
