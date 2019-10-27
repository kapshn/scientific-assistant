import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import MyProjects from '../popup/App'

Vue.use(VueRouter);

let winH = 900;
let winL = 1500;

const routes = [
  {
    path: '/',
    name: 'App',
    component: App
  },
  { path: '/myprojects', component: MyProjects },
]

window.resizeTo(winL, winH);
window.moveTo( (screen.width - winL)/2 , (screen.height - winH)/2);

const router = new VueRouter({
  routes // short for `routes: routes`
})

/*router.onReady(() => {
  app.$mount('#app')
})*/



new Vue({
  el: '#Authorization',
  router: router,
  template: '<router-view></router-view>'
})
