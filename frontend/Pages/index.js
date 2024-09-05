import { createRouter, createWebHashHistory } from "vue-router";
import login from "../src/Admin/login.vue";
import welcome from "../src/userapeal.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/login", component: login },
    { path: "/welcome", component: welcome },
    {
      path: "/",
      component: () => import("../src/Admin/dashtboard.vue"),
      children: [
        {
          path: "/editprofil",
          component: () => import("../src/Admin/Editprofil.vue"),
        },

        {
          path: "/allApeals",
          component: () => import("../src/Admin/Apeal.vue"),
        },
        {
          path: "/Kalindar",
          component: () => import("../src/Admin/Kundalik/Calendar.vue"),
        },
        {
          path: "/changepassword",
          component: () => import("../src/Admin/changepassword.vue"),
        },
        {
          path: "/",
          component: () => import("../src/Admin/Notification.vue"),
        },
        {
          path: "/Notification_apeal",
          component: () => import("../src/Admin/Notification_apeal.vue"),
        },
        {
          path: "/korzinka",
          component: () => import("../src/Admin/Corzina.vue"),
        },
      ],
    },
  ],
});

export default router;
