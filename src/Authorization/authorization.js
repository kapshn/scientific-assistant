import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import MyProjects from '../MyProjects/App'
import Desk from '../Desk/App'
import Upload_Select from '../Desk/components/Upload_Select.vue'
import Drive from '../Desk/components/Drive.vue'
import Computer from '../Desk/components/Computer.vue'

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
  { path: '/desk/:id', name: 'desk', component: Desk, props: true,
  redirect: { name: 'uploadselect' },
  children: [
        {
          path: 'uploadselect',
          name: 'uploadselect',
          component: Upload_Select
        },
        {
          path: 'drive',
          name: 'drive',
          component: Drive
        },
        {
          path: 'computer',
          name: 'computer',
          component: Computer
        },
      ]},
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
