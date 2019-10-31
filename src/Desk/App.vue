<template>
  <div id="app">
    {{id}}
    <div class="uploadButton" @click="modalVisibility = true">Upload file</div>

    <ModalWindow
    v-if="modalVisibility"
    v-on:FileSelected="SelectFile($event)"
    v-on:CloseModalWindow="modalVisibility=false"
    ></ModalWindow>

  </div>
</template>

<script src="./desk.js"></script>

<style lang="scss" scoped>
p {
  font-size: 20px;
}

.uploadButton {
  font-size: 14px;
  border: 1px solid black;
  width: 100px;
  padding: 5px;
  font-weight: 400;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
}
</style>
