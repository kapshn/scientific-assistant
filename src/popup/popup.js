import Vue from 'vue'
import App from './App'





/* eslint-disable no-new */
new Vue({
  el: '#app',
  
  
  render: h => h(App)
})

window.onload = function () {
  document.getElementById('sign-in-button').addEventListener('click', function () {
      chrome.identity.getAuthToken({ interactive: true }, function (token) {
          // код работы с полученым токеном

          //проверка получения токена
          console.log("token: ", token);
      });
  });
};