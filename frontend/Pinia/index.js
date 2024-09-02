import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import url from "../base/index.js";

const Dean = defineStore("counter", {
  state: () => ({
    count: 0,
    modals: {
      editApeal: {
        show: false,
        loading: false,
        data: {},
      },
      addcalendar: {
        show: false
      },
    },
    profile: {},
  }),
  getters: {
    doubleCount: (state) => {
      state.count * 2;
      console.log(1);
    },
  },
  actions: {
    increment() {
      this.count++;
    },
    async getProfil() {
      let token = localStorage.token;
      let backend = await fetch(`${url}admin/getprofile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "-x-token": token,
        },
      });

      if (backend.status == 401) {
        //  window.location.href = '/dean/login';
        return 401;
      }
      if (backend.status == 200) {
        backend = await backend.json();
        this.profile = backend;
      }
    },
  },
});

const Student = defineStore("counter11", {
  state: () => ({
    count: 1,
  }),
  getters: {
    doubleCount: (state) => {
      state.count * 2;
      console.log(1);
    },
  },
  actions: {
    increment() {
      this.count++;
    },
  },
});
export { Dean, Student };
