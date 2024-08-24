import { createRouter, createWebHistory } from "vue-router";
import login from "../src/admin/login.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/login", component: login },
    {
      path: "/",
      component: () => import("../src/admin/dashtboard.vue"),
      children: [
        {
          path: "/editprofil",
          component: () => import("../src/admin/Editprofil.vue"),
        },
        
          {
            path : "/allApeals",
            component : () => import ("../src/Admin/Apeal.vue")
          },
          {
            path : "/Kalindar",
            component : () => import ("../src/Admin/Kundalik/Calendar.vue")
          }
      ],
      
    },
  ],
});

export default router;
