import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';
import Login from './components/Login.vue';
import Registration from './components/Registration.vue';
import { supabase } from './lib/supabaseClient';

// Create a promise that resolves when the session is checked
const routes = [
  { path: '/login', component: Login, meta: { guestOnly: true } },
  { path: '/register', component: Registration, meta: { guestOnly: true } },
  { path: '/', component: Home, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const { data } = await supabase.auth.getSession();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const guestOnly = to.matched.some((record) => record.meta.guestOnly);
  if (requiresAuth && !data?.session) {
    console.log('no session');
    next('/login');
  } else if (guestOnly && data?.session) {
    console.log('session exists');
    next('/');
  } else {
    next();
  }
});

export default router;
