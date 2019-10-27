import Vue from 'vue'
import App from './App'

console.log('TEST');

var app = new Vue({
  data () {
    return {
        text: 'Hello, World'
    };
  }
}).$mount("#app")
