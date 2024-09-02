<template>
  <div>
    <div class="overflow-x-auto custom-scroll pb-[50px]">
      <p class="text-lg">
        <span class="text-[20px] font-bold">
          Korzinka
        </span>
      </p>
      <div class="mx-auto select-auto mt-5 w-full lg:w-[1200px] items-center gap-4 flex flex-col">

        <div class="container overflow-x-clip ">
          <n-watermark content="Korzinka" cross selectable :font-size="20" :line-height="16" :width="192" :height="128"
            :x-offset="12" :y-offset="28" :rotate="-15">
            <n-table  :bordered="false" :single-line="false">
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
                  <th class="text-center">
                    <div class="text-red-600">O'chirish</div>

                  </th>
                  <th class="text-center">Qayta ko'rish</th>
                  <th class="text-center ">
                    <div class="text-green-600">Tiklash</div>
                  </th>



                </tr>
              </thead>
              <tbody>
                <tr v-for="(i, j) in data" class="bg-red-600" :key="new Number(i.id)">
                  <td>{{ ((j + 1) + (page - 1) * size) }}</td>
                  <td class="text-justify ps-4 font-bold"><span
                      :class="i.status == 4 ? 'line-through text-red-700' : ''">{{ i.lastname }} {{ i.firstname
                      }}</span>
                  </td>
                  <td class="text-center select-text">{{ i.phone }}</td>
                  <td class="text-center">{{ i.description }}</td>
                  <td class="text-center">{{ i.statusname }}</td>
                  <td class="text-center">{{ (new Date(i.created_at)).toLocaleString() }}</td>
                  <td>
                    <div class="flex justify-center">
                      <n-button type="error"
                        @click="deleteitem1 = i.id; deletecontent1 = `${i.lastname} ${i.firstname} to'liq o'chirilsinmi?`; deletedata1()">
                        <i class="far fa-trash-can"></i>
                      </n-button>
                    </div>
                  </td>

                  <td v-if="i.reseen">
                    {{ (new Date(i.reseen)).toLocaleString() }}



                  </td>
                  <td v-else>Mavjud emas</td>
                  <td>
                    <div class="flex justify-center">
                      <n-popover trigger="hover">
                        <template #trigger>

                          <n-button type="success"
                            @click="deletemodal = true; deleteitem = i.id; deletecontent = `${i.lastname} ${i.firstname} tiklansinmi ?`">
                            <i class="fas fa-arrow-rotate-left"></i>
                          </n-button>
                        </template>
                        <span> <span class="font-bold">{{ i.lastname }} {{ i.firstname }}</span>ni tiklash</span>
                      </n-popover>
                    </div>
                  </td>

                </tr>
                <tr>
                  <td colspan="9">
                    <div class="w-full flex justify-center">
                        <i>Ma'lumot mavjud emas</i>
                    </div>
                  </td>
                </tr>
              </tbody>
            </n-table>
          </n-watermark>

        </div>

        <n-pagination v-if="data.length" v-model:page="page" :page-count="sizecount" />
        <div class="font-bold"><span class="text-red-600">Barcha o'chirilgan ma'lumotlar soni </span>: <span
            :title="total"> {{
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

  <n-modal v-model:show="deletemodal1" preset="dialog" title="O'chirish" :content="deletecontent1" positive-text="Ha"
    negative-text="Bekor qilindi" @positive-click="deletedata1" @negative-click="cancelCallback" />


</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useMessage, useDialog } from "naive-ui";
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


let deletecontent1 = ref('')
let deletemodal1 = ref(false);
let deleteitem1 = ref(null);


let deletedata = async function () {
  let token = localStorage.token;
  try {
    let backend = await fetch(`${url}apeal/edit/recover/${deleteitem.value}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        '-x-token': token
      }

    });
    if (backend.status == 200) {
      message.success("Ma'lumot tiklandi");

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
const dialog = useDialog();
let size = ref(10);
let data = ref([]);
let sizecount = ref(1)
let total = ref(0)
let router = useRouter();

watch(page, (page, old) => {
  callbackend(page);

})

let callbackend = async (page) => {
  data.value = [];
  let token = localStorage.token; try {

    let backend = await fetch(`${url}apeal/getapeal/corzinca?${(new URLSearchParams({ page: page, size: size.value })).toString()}`,
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



let deletedata1 = function () {
  dialog.error({
    title: "Buni tiklashni imkoni yo'q!!!",
    content: deletecontent1.value,
    positiveText: "O'chirilsin",
    onPositiveClick: async () => {
      let token = localStorage.token;
      try {
        let backend = await fetch(`${url}apeal/edit/alldelete/${deleteitem1.value}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            '-x-token': token
          }

        });
        if (backend.status == 200) {
          message.success("Ma'lumot o'chirildi");

          callbackend(page.value);
          router.go(0);
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
  });
}

</script>

<style>
.custom-scroll {
  /* Enables vertical scrolling */
  scrollbar-width: thin;
  /* For Firefox */
  scrollbar-color: rgb(0, 20, 60) #eee;
  /* For Firefox: thumb color, track color */
}

/* Webkit Browsers (Chrome, Safari, Edge) */
.custom-scroll::-webkit-scrollbar {
  width: 8px;
  /* Width of the scrollbar */
}

.custom-scroll::-webkit-scrollbar-track {
  background: rgb(0, 20, 60);
  /* Background color of the track */
}

.custom-scroll::-webkit-scrollbar-thumb {
  background-color: #888;
  /* Scrollbar color */
  border-radius: 10px;
  /* Rounded corners for the scrollbar */
  border: 2px solid rgb(0, 20, 60);
  /* Space around the scrollbar */
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgb(0, 20, 60);
  /* Color when hovering over the scrollbar */
}
</style>