<template>
  <div>
    <p class="text-lg">
      <span class="text-[20px] font-bold">
        Bildirishnomalar
      </span>
    </p>




    <div>

      <div class="w-max-[1000px] w-[1000px] overflow-visible mx-auto mt-[40px]">
        <n-table :bordered="false" :single-line="false">
          <thead>
            <tr>
              <th>№</th>
              <th>Sarlavha</th>
              <th>Boshlanish vaqti</th>
              <th>Tugash vaqti</th>
              <th>Description</th>
              <th>Joylashuv</th>
              <th>Teglar</th>
              <th>Activligi</th>
              <th>O'chirish</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(i, j) in data" v-if="data.length > 0">
              <td>{{+ + j }}</td>
              <td>
                <div class="font-bold">{{ i.title }}</div>
              </td>
              <td> {{ (new Date(i.start_time)).toLocaleString() }}</td>
              <td>
                <div class="flex justify-center flex-col">
                  {{ (new Date(i.end_time)).toLocaleString() }}

                  <countdown :targetDateTime="i.end_time" />

                </div>
              </td>
              <td class="w-max-[90px] w-[100px] overflow-auto text-justify">
                <div class="h-[40px] text-[13px]">{{ i.description }}</div>
              </td>
              <td v-if="i.location">{{ i.location }}</td>
              <td v-else><i class="">Mavjud emas</i></td>


              <td v-if="i.tags">
                <div class="w-max-[90px] w-[100px] overflow-x-auto">

                  {{ i.tags }}
                </div>
              </td>
              <td v-else><i class="">Mavjud emas</i></td>



              <td>
                <n-switch @click="change_active({ id: i.id, active: i.active })" v-model:value="i.active">
                  <template #checked>
                    Faol
                  </template>
                  <template #unchecked>
                    Faol emas
                  </template>
                </n-switch>
              </td>



              <td>
                <div class="flex justify-center">
                  <n-button @click="showModal = true; deleteitemtext = i.title; deleteitem = i.id" type="error"><i
                      class="far fa-trash-can"></i></n-button>
                </div>
              </td>
            </tr>
            <tr v-else>
              <td colspan="9">
                <span class="flex w-full flex-col justify-center h-[100px] items-center block">
                  <i class="far fa-circle-xmark text-[40px] text-green-600"></i>
                  <div>
                    <span class="mt-4 block"> Ma'lumot topilmadi</span>

                  </div>

                </span>
              </td>
            </tr>
          </tbody>
        </n-table>
      </div>

    </div>
  </div>


  <!-- Modal -->

  <n-modal v-model:show="showModal" preset="dialog" title="O'chirish"
    :content="`''${deleteitemtext}'' element o'chirilsinmi ?`" positive-text="O'chirish" negative-text="Bekor qilish"
    @positive-click="submitCallback" @negative-click="cancelCallback" />
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import { ref, onMounted } from "vue";
import countdown from './component/countdown.vue';
import url from "../../base"
const router = useRouter();
let value = ref(false);
const message = useMessage();

let data = ref([]);

let showModal = ref(false);
let deleteitemtext = ref('');
let deleteitem = ref(null);



let callbackend = async function () {
  const token = localStorage.token;

  let backend = await fetch(`${url}notification`,
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
    
    //   events.value = backend;
    data.value = backend;

  }
  if (backend.status == 401) router.push('/login');
}
onMounted(async () => {
  callbackend();

});
async function change_active(obj) {
  let token = localStorage.token;
  try {
    let backend = await fetch(`${url}calendar/active`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        '-x-token': token
      },
      body: JSON.stringify(obj)

    });
    if (backend.status == 200) {
      message.success("Ma'lumot o'chirildi");
      router.go(0)

      // callbackend(page.value);
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
    console.log(error)
  }
}


const cancelCallback = async function () {

}

const submitCallback = async function () {
  console.log(deleteitem.value);
  let token = localStorage.token;
  try {
    let backend = await fetch(`${url}calendar/delete/${deleteitem.value}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        '-x-token': token
      }

    });
    if (backend.status == 200) {
      message.success("Ma'lumot o'chirildi");
      router.go(0)

      // callbackend(page.value);
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
    console.log(error)
  }
}


</script>
