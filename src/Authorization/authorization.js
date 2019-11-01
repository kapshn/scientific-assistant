import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import MyProjects from '../MyProjects/App'
import Desk from '../Desk/App'

Vue.use(VueRouter);

let winH = 900;
let winL = 1500;

const routes = [
  {
    path: '/',
    name: 'App',
    component: App
  },
  { path: '/myprojects', name:"myprojects", component: MyProjects},
  { path: '/desk/:id', name: 'desk', component: Desk, props: true},
]

window.resizeTo(winL, winH);
window.moveTo( (screen.width - winL)/2 , (screen.height - winH)/2);

const router = new VueRouter({
  routes
})


new Vue({
  el: '#Authorization',
  router: router,
  template: '<router-view></router-view>'
})
