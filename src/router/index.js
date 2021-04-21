import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import ApplyHome from '../views/ApplyHome.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/Home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/',
    name: 'ApplyHome',
    component: ApplyHome,
  },
  {
    path: '/applyBasicInfo',
    name: 'ApplyBasicInfo',
    component: () => import(/* webpackChunkName: "applystep1" */ '../views/ApplyBasicInfo.vue'),
  },
  {
    path: '/applyAnoInfo',
    name: 'ApplyAnoInfo',
    component: () => import(/* webpackChunkName: "applystep2" */ '../views/ApplyAnoInfo.vue'),
  },
  {
    path: '/applyServiceInfo',
    name: 'ApplyServiceInfo',
    component: () => import(/* webpackChunkName: "applystep3" */ '../views/ApplyServiceInfo.vue'),
  },
  {
    path: '/applyEnd',
    name: 'ApplyEnd',
    component: () => import(/* webpackChunkName: "applyend" */ '../views/ApplyEnd.vue'),
  },
  {
    path: '/approvalList',
    name: 'ApprovalList',
    component: () => import(/* webpackChunkName: "cardlist" */ '../views/ApprovalList.vue'),
  },
  {
    path: '/queryList',
    name: 'QueryProgress',
    component: () => import(/* webpackChunkName: "querylist" */ '../views/QueryProgress.vue'),
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
