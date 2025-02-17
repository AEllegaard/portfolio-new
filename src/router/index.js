import { createRouter, createWebHashHistory } from 'vue-router';
import homeview from '../components/homeview.vue';
import aboutview from '../components/aboutview.vue';
import workview from '../components/workview.vue';
import contactview from '../components/contactview.vue';

const routes = [
  { path: '/', component: homeview },
  { path: '/about', component: aboutview },
  { path: '/work', component: workview },
  { path: '/contact', component: contactview },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
