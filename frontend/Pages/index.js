import { createRouter, createWebHistory } from "vue-router";
import login from "../src/admin/login.vue";
import welcome from "../src/userapeal.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/login", component: login },
    { path: "/welcome", component : welcome},
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
          },
          {
            path : "/changepassword",
            component : ()=>import ("../src/Admin/changepassword.vue")
          },
          {
            path: "/",
            component: () => import("../src/admin/Notification.vue"),
          },

      ],
      
    },
  ],
});

export default router;
