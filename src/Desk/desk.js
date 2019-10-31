import Vue from 'vue';
import App from './App';
import ModalWindow from './components/ModalWindow.vue'

Vue.component('ModalWindow', ModalWindow);

//ATATATATATATATATATATATATATATATATATATATATAT
var selectedFile = null;

export default {
  data () {
    return {
      modalVisibility: false,

    }
  },
  props: ['id'],
  methods: {
    SelectFile: function(file) {
      selectFile(file,this)
    }
  },
  mounted: function() {
    getXML(this);
  }
}

//ATATATATATATATATATATATATATATATATATATATATAT
function selectFile(file,t) {
  t.modalVisibility = false;
  selectedFile = file;
  console.log("name = ",selectedFile.name,"; id = ",selectedFile.id);
}

function getXML(t) {
  chrome.identity.getAuthToken({ interactive: true }, function (token) {

      let xmlBody;

      var xhr = new XMLHttpRequest();
      xhr.open('get', 'https://www.googleapis.com/drive/v3/files/'+ t.id + '?alt=media');
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.onload = () => {
        xmlBody = xhr.responseText;
      };
      xhr.send();
  });
}
