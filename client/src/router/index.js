import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: HomeView
    }
  ]
});

router.beforeEach((to, from) => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  if(to.name == 'home' && userData == null) {
    console.log(userData);
    console.log(to);
    console.log(from);
    return false;
  }
  //return true;
});

export default router
