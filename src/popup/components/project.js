import Vue from 'vue';

export default {
  props: {
    project: {
      type: Object
    },
    visible: Boolean
  },
  methods: {
    SelectFile: function () {
      selectFile(this);
    },
    OpenProject: function() {
      openProject(this.project);
    }
  }
}

function selectFile(t) {
  //console.log(project.id);
  t.$emit('popupWindowVisibility', true);
  t.$emit('selectedProject', t.project);
  t.$emit('deleteMark', true);
}

function openProject(project) {

}
