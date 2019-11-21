import Vue from 'vue';

export default {
  data() {
    return {
      editVisibility: false,
    }
  },
  props: {
    project: {
      type: Object
    },
    visible: Boolean
  },
  watch: {
    project: function() {console.log(this.project)}
  },
  methods: {
    SelectFile: function () {
      selectFile(this);
    },
    OpenProject: function() {
      openProject(this.project);
    },
    EditFileName: function() {
      editFileName(this);
    },
    CancelEdit: function() {
      closeEdit(this);
    },
    ApplyFileName: function() {
      applyChanges(this);
    },
    ConfirmRedirect: function(e) {
      e.preventDefault();
      //console.log("ASSSS");
    },

  },
  mounted: function() {

  }
}

function selectFile(t) {
  t.$emit('popupWindowVisibility', true);
  t.$emit('selectedProject', t.project);
  t.$emit('deleteMark', true);
}

function editFileName(t) {
  t.editVisibility = true;
}

function applyChanges(t) {
  if (document.getElementById('projectName').value == '') {
    alert("Введите название файла!");
  } else {
    let test = document.getElementById('projectName').value;
    chrome.identity.getAuthToken({ interactive: true }, function (token) {

      let metadata = {
          'name': test
      };

      let xhr = new XMLHttpRequest();
      xhr.open('PATCH', 'https://www.googleapis.com/drive/v3/files/' + t.project.id);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.responseType = 'json';
      xhr.onload = () => {
        console.log(xhr.response);
        t.$emit('rerender', true);
      };
      xhr.send(JSON.stringify(metadata));

    });

    closeEdit(t);
  }
}

function closeEdit(t) {
  t.editVisibility = false;
}

function openProject(project) {

}
