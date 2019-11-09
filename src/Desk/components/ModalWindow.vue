<template>
  <div class="files">
    <i class="material-icons files__close" v-on:click="$emit('CloseModalWindow');">close</i>
    <router-view v-on:FileSelected="SelectFile($event)"></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    SelectFile: function(file) {
      selectFile(file,this)
    }
  }
}

function selectFile(file,t) {
  t.$emit('FileSelected',file);
}

</script>

<style lang="scss" scoped>
.files {
  padding: 25px;
  position: fixed;
  border: 1px solid black;
  border-radius: 10px;
  width: 600px;
  height: 450px;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  background-color: white;
  z-index: 10000;

  &__close {
    position: absolute;
    right: 5%;
    top: 5%;
    cursor: pointer;
  }
}
</style>
