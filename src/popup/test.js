import Vue from 'vue'
import App from './App'
import Project from './components/Project'

Vue.component('Project', Project);

function getFilesList(t) {

    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      var xhr = new XMLHttpRequest();
      xhr.open('get', "https://www.googleapis.com/drive/v3/files?q='appDataFolder'+in+parents&spaces=appDataFolder");
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.responseType = 'json';
      xhr.onload = () => {
          t.projects = xhr.response.files;
      };
      xhr.send();

    });

    //setTimeout(() => console.log(files), 10000); // Привет, Джон
    //console.log(files);
}

export default {
  data () {
    return {
      projects: null,
    }
  },
  mounted: function () {
    //setTimeout(() => this.projects = files, 5000)
    getFilesList(this);
    //console.log("asda")
  }
}
