<template>
  <div id="drive">
    <router-link :to="{ name: 'uploadselect' }" class="drive__return">
      <i class="material-icons">keyboard_backspace</i>
    </router-link>
    <h3 class="drive__title">Мои файлы:</h3>
    <div class="drivelist" v-if="folderId!=null">
      <div class="drivelist-item"
      v-for="driveFile in driveFiles"
      v-on:click="SelectDriveFile(driveFile)"
      >
        <div class="drivelist-item__img"></div>
        <div class="drivelist-item__name">
          {{driveFile.name}}
        </div>

      </div>
    </div>
    <h1 class="drive__error" v-else>
      {{message}}
    </h1>
  </div>
</template>

<script type="text/javascript">

export default {
  data () {
    return {
      folderId: null,
      message: "Загрузка файлов...",
      driveFiles: null
    }
  },
  methods: {
    SelectDriveFile: function(file) {
      selectDriveFile(file,this)
    }
  },
  mounted: function() {
    getAppFolder(this);
  }
}

function selectDriveFile(file,t) {
  t.$emit('FileSelected',file);
}

function getAppFolder(t) {

    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      var xhr = new XMLHttpRequest();
      xhr.open('get', "https://www.googleapis.com/drive/v3/files?" + "q=name%20%3D%20'ResearchAssistantFiles'");
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.response.files.length==1) {
          t.folderId = xhr.response.files[0].id;
          getDriveFiles(t);
        } else {
          t.message = 'Файлы еще не были созданы'
        }

      };
      xhr.send();

    });
}

function getDriveFiles(t) {
  chrome.identity.getAuthToken({ interactive: true }, function (token) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', "https://www.googleapis.com/drive/v3/files?q='" + t.folderId + "'+in+parents");
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.responseType = 'json';
    xhr.onload = () => {
      t.driveFiles = xhr.response.files;
    };
    xhr.send();

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
