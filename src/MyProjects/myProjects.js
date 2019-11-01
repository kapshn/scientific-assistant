import Vue from 'vue'
import App from './App'
import Project from './components/Project.vue'

Vue.component('Project', Project);

var current_token;

function getFilesList(t) {

    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      current_token = token;
      var xhr = new XMLHttpRequest();
      xhr.open('get', "https://www.googleapis.com/drive/v3/files?q='appDataFolder'+in+parents&spaces=appDataFolder");
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.responseType = 'json';
      xhr.onload = () => {
          t.projects = xhr.response.files;
      };
      xhr.send();

      var x = new XMLHttpRequest();
      x.open('GET', 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json');
      x.setRequestHeader('Authorization', 'Bearer ' + token);
      x.responseType = 'json';
      x.onload = function() {
        t.profile = x.response.email;
      };
      x.send();

    });

}

function logOut() {
  var url = 'https://accounts.google.com/o/oauth2/revoke?token=' + current_token;
  window.fetch(url);
  chrome.identity.removeCachedAuthToken({ token : current_token },null);
  location.href='../Authorization/authorization.html';
}

function closeModal(t) {
  t.visible = false;
}

function deleteFile(t) {
  closeModal(t);

  chrome.identity.getAuthToken({ interactive: true }, function (token) {
    current_token = token;
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', "https://www.googleapis.com/drive/v3/files/" + t.selectedProject.id);
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status == 204) {
        alert("Проект: " + t.selectedProject.name + " успешно удалён!");
        t.selectedProject = null;
      }
      getFilesList(t);
    };
    xhr.send();

  });

}

function createFile(t) {
  if (document.getElementById('fileName').value == '') {
    alert("Введите название файла!");
  } else
  chrome.identity.getAuthToken({ interactive: true }, function (token) {
    current_token = token;

    let xml = '<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel>';

    let fileContent = xml;
    let file = new Blob([fileContent], { type: 'text/xml' });
    let metadata = {
        'name': document.getElementById('fileName').value, // Filename at Google Drive
        'mimeType': 'text/xml', // mimeType at Google Drive
        'parents': ['appDataFolder'], // Folder ID at Google Drive (remove it if want upload to root folder)
    };

    let form = new FormData();

    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    let xhr = new XMLHttpRequest();
    xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.responseType = 'json';
    xhr.onload = () => {
      console.log(xhr.response);
      getFilesList(t);
      closeModal(t);
    };
    xhr.send(form);

  });
}

function setModalWindowMark(t) {
  t.visible = true; t.deleteMark = false;
}

export default {
  data () {
    return {
      projects: null,
      profile: '',
      visible: false,
      selectedProject: null,
      deleteMark: false
    }
  },
  methods: {
    LogOut: function() {
      logOut();
    },
    CloseModal: function() { closeModal(this); },
    DeleteFile: function() { deleteFile(this); },
    SetModalWindowMark: function() { setModalWindowMark(this); },
    CreateFile: function() { createFile(this); },
    Rerender: function() { getFilesList(this); },
  },
  mounted: function() {
    getFilesList(this);
  }
}
