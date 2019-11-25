import Vue from 'vue'
import App from './App'
import Project from './components/Project.vue'

Vue.component('Project', Project);

var current_token;

export default {
  data () {
    return {
      projects: null,
      profile: '',
      visible: false,
      selectedProject: null,
      deleteMark: false,
      fileName: '',
      folderId: null,
      filesFolderId: null,
      docsFolderId: null

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
    getAppFolder(this);

  },
  beforeRouteLeave  (to, from, next) {
    if (
      event.target.tagName != "I" && event.target.tagName != "INPUT"
      ||
      event.target.tagName == "I" && event.target.className == "material-icons project__img"
    ) next();

  }
}

function getAppFolder(t) {

    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      var xhr = new XMLHttpRequest();
      xhr.open('get', "https://www.googleapis.com/drive/v3/files?" + "q=name%20%3D%20'ResearchAssistantFiles'&&fields=files(id,name,thumbnailLink)");
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.response.files.length==0) {
          createFolder(t);
          getFilesList(t);
        } else {
          t.folderId = xhr.response.files[0].id;
          getChildFolders(t,t.folderId);
        }


      };
      xhr.send();

    });
}

function getChildFolders(t,parent) {
  chrome.identity.getAuthToken({ interactive: true }, function (token) {
    current_token = token;
    var xhr = new XMLHttpRequest();
    xhr.open('get', "https://www.googleapis.com/drive/v3/files?q='"+ parent + "' +in+parents");
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.responseType = 'json';
    xhr.onload = () => {
        if(xhr.response.files[0].name == "Docs") {
          t.docsFolderId = xhr.response.files[0].id;
          t.filesFolderId = xhr.response.files[1].id;
        }
        else {
          t.docsFolderId = xhr.response.files[1].id;
          t.filesFolderId = xhr.response.files[0].id;
        }
        getFilesList(t);
        //console.log(t.docsFolderId,t.filesFolderId)
    };
    xhr.send();
  });
}

function createFolder(t) {
  chrome.identity.getAuthToken({ interactive: true }, function (token) {
    let metadata = {
        'name': "ResearchAssistantFiles",
        'mimeType': 'application/vnd.google-apps.folder'
    };

    let form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));

    let xhr = new XMLHttpRequest();
    xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.responseType = 'json';
    xhr.onload = () => {
      t.folderId = xhr.response.id;
      createSubFolders(t,"Files");
      createSubFolders(t,"Docs");
      //console.log(t.folderId,t.filesFolderId,t.docsFolderId);
    };
    xhr.send(form);

  });
}

function createSubFolders(t,folderName) {
  chrome.identity.getAuthToken({ interactive: true }, function (token) {
    let metadata = {
        'name': folderName,
        'mimeType': 'application/vnd.google-apps.folder',
        'parents': [t.folderId]
    };

    let form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));

    let xhr = new XMLHttpRequest();
    xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (folderName=="Files") t.filesFolderId = xhr.response.id;
      else t.docsFolderId = xhr.response.id;

    };
    xhr.send(form);

  });
}

function getFilesList(t) {

    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      current_token = token;
      var xhr = new XMLHttpRequest();
      xhr.open('get', "https://www.googleapis.com/drive/v3/files?q='appDataFolder'+in+parents&spaces=appDataFolder");
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.responseType = 'json';
      xhr.onload = () => {
        t.projects = xhr.response.files.map(f =>
          {
            let a = {
              id: f.id,
              name: f.name,
              folderId: "",
              docId: ""
            }
            return a
          }
        )
        getAssociatedDocs(t);
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

function getAssociatedDocs(t) {
  chrome.identity.getAuthToken({ interactive: true }, function (token) {
    current_token = token;
    var xhr = new XMLHttpRequest();
    xhr.open('get', "https://www.googleapis.com/drive/v3/files?q='"+t.docsFolderId+"'+in+parents");
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.responseType = 'json';
    xhr.onload = () => {
      for (let i=0;i<xhr.response.files.length;i++) {
        let found = t.projects.find(obj =>
           obj.name == xhr.response.files[i].name
        )
        if (typeof(found) != "undefined") {
          found.docId = xhr.response.files[i].id;
          found.folderId = t.filesFolderId;
        }
      }

    };
    xhr.send();
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
        let name = t.selectedProject.name
        t.selectedProject = null;
        //setTimeout(() => alert("Проект: " + name + " успешно удалён!"), 1);
      }
      getFilesList(t);
    };
    xhr.send();

  });

}

function createFile(t) {
  let found = t.projects.find(obj =>
    obj.name == document.getElementById('fileName').value
  )
  if (typeof(found) != "undefined") {
    alert("Файл с таким названием уже существует!");
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
      //console.log(xhr.response);
      createDoc(t,document.getElementById('fileName').value);
      closeModal(t);
    };
    xhr.send(form);

  });
}

function createDoc(t,docName) {
  chrome.identity.getAuthToken({ interactive: true }, function (token) {
    let metadata = {
        'name': docName, // Filename at Google Drive
        'mimeType': 'application/vnd.google-apps.document', // mimeType at Google Drive
        'parents': [t.docsFolderId], // Folder ID at Google Drive (remove it if want upload to root folder)
    };

    let form = new FormData();

    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));

    let xhr = new XMLHttpRequest();
    xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.responseType = 'json';
    xhr.onload = () => {
      //console.log(xhr.response);
      getFilesList(t);
    };
    xhr.send(form);

  });
}

function setModalWindowMark(t) {
  t.visible = true; t.deleteMark = false;
}
