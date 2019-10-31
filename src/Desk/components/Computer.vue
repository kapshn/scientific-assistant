<template>
  <div id="computer">
    <router-link :to="{ name: 'uploadselect' }" class="drive__return">
      <i class="material-icons">keyboard_backspace</i>
    </router-link>
    <h3 class="drive__title">Загрузить файл:</h3>
    <div class="" v-if="folderId!=null">
      <input id="test" type="file" >
      <button v-on:click="UploadFile()">Submit</button>
      <p>{{message}}</p>
    </div>

    <h1 v-else>Загрузка папки проекта</h1>
  </div>
</template>

<script type="text/javascript">

export default {
  data () {
    return {
      folderId: null,
      message: ''
    }
  },
  methods: {
    UploadFile: function() {
      uploadFile(this);
    }
  },
  mounted: function() {
    getAppFolder(this);
  }
}

function uploadFile(t) {
  let file = document.getElementById('test').files[0];

  chrome.identity.getAuthToken({ interactive: true }, function (token) {
    let metadata = {
        'name': file.name, // Filename at Google Drive
        'mimeType': file.type, // mimeType at Google Drive
        'parents': [t.folderId], // Folder ID at Google Drive (remove it if want upload to root folder)
    };

    let form = new FormData();

    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    t.message = "Загрузка файла на диск..."

    let xhr = new XMLHttpRequest();
    xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name');
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.responseType = 'json';
    xhr.onload = () => {
      t.$emit('FileSelected',xhr.response);
    };
    xhr.send(form);

  });

}


function getAppFolder(t) {

    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      var xhr = new XMLHttpRequest();
      xhr.open('get', "https://www.googleapis.com/drive/v3/files?" + "q=name%20%3D%20'ResearchAssistantFiles'");
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.response.files.length==0) {
          createFolder(t)
        } else {
          t.folderId = xhr.response.files[0].id;
        }

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
      console.log(xhr.response.id);
    };
    xhr.send(form);

  });
}

</script>

<style lang="scss" scoped>

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

#drive {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.drive {

  &__return {
    text-decoration: none;
  }

  &__error {

  }


}

.drivelist {
  height: 100%;
  border: 1px solid black;
  overflow-y: scroll;
  border: 1px solid black;
  border-radius: 5px;
  padding: 10px;

  &-item {
    border: 1px solid black;
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    padding: 10px;
    margin-bottom: 10px;
    align-items: center;
    cursor: pointer;

    &__name {
      font-size: 18px;
      margin-left: 10px;
    }

    &__img {
      height: 50px;
      width: 50px;
      background-color: red;
      border: 1px solid black;
    }
  }
}


</style>
