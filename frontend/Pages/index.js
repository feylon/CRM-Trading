import { createRouter, createWebHistory } from "vue-router";
import login from "../src/Dean/login.vue"



const router = createRouter({
  history: createWebHistory(),
  routes: [
   {path : "/login", component : login},
   {path : "/", component : ()=>import("../src/Dean/dashtboard.vue"), children :[
    {path : "/editprofil", component : ()=>import('../src/Dean/Editprofil.vue')}
   ]},
    

  ],
});

export default router;
