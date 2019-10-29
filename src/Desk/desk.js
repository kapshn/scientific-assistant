import Vue from 'vue';
import App from './App';

export default {
  data () {
    return {}
  },
  props: ['id'],
  mounted: function() {
    getXML(this);
  }
}

function getXML(t) {
  chrome.identity.getAuthToken({ interactive: true }, function (token) {

      let xmlBody;

      var xhr = new XMLHttpRequest();
      xhr.open('get', 'https://www.googleapis.com/drive/v3/files/'+ t.id + '?alt=media');
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.onload = () => {
        xmlBody = xhr.responseText;
        console.log(xmlBody);
      };
      xhr.send();
  });
}
