<template>
  <div id="app">
    <header class="header">
      <img class="header__img" src="../images/logo.png" alt="research assistant logo">
      <img class="header__folderIcon" src="../images/folder-open.png" alt="folder icon">
      <h1 class="header__title">{{name}}</h1>
      <router-link class="header-exit" :to="{ name: 'myprojects' }">
        <i class="material-icons header-exit__icon">exit_to_app</i>
      </router-link>
    </header>

    <div id="main-div">
      <div class='toolbar'>
        <div class="toolbar__special">
          <button id="saveButton"></button>
          <button id="undoButton"></button>
          <button id="redoButton"></button>
        </div>
        <div class="toolbar__notes" id="noteToolbar"></div>
        <img class="toolbar__img" src="../images/script-text-outline.png" alt="script text icon">
      </div>
      <div id="graphContainer" style="overflow:hidden;cursor:default;">
      </div>
    </div>

    <div class="modal" v-if="editingWindowVisibility">
      <div class="modal__mask" @click="CloseModal()"></div>
      <div class="modal-window">
          <h1 class="modal-window__title">Редактирование</h1>
          <div id="properties" style="border: solid 1px black; padding: 10px;"></div>
          <div class="uploadButton" @click="uploadFileWindowVisibility = true" v-if="uploadFileButtonVisibility">Загрузить</div>
      </div>
    </div>

    <ModalWindow
      v-if="uploadFileWindowVisibility"
      v-bind:folderId="folderId"
      v-on:FileSelected="SelectFile($event)"
      v-on:CloseModalWindow="CloseModal()">
    </ModalWindow>
  </div>
</template>

<script src="./desk.js"></script>

<style lang="scss" scoped>
p {
  font-size: 20px;
}

body{
  margin: 100px;
}

.header {
  display: flex;
  flex-direction: row;
  align-items: center;

  &__img {
    width: 50px;
    height: 55px;
    margin: 5px 0 0 15px;
    max-width: 100%;
    max-height: 100%;
  }

  &__folderIcon {
    margin-left: 32px;
    opacity: 0.3;
  }

  &__title {
    font-size: 30px;
    color: #373737;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    margin: 0px;
    margin-left: 30px;
  }

  &-exit {
    align-self: flex-end;
    margin: 0 5px 10px auto;
    cursor: pointer;

    &:hover {
      .header-exit__icon {
        color: #0c73b8;
      }
    }

    &__icon {
      transform: scaleY(1.5);
      font-size: 26px;
      color: #555;
      margin-left: 20px;
    }
  }
}

.toolbar
{
  border-top: solid rgb(198,198,198) 2px;
  border-bottom: solid rgb(198,198,198) 2px;
  display:flex;
  flex-direction: row;
  align-items: center;

  &__special{
    height: 35px;
    padding: 2px 15px 2px 15px;
    display:flex;
    flex-direction: row;
    align-items: center;
    border-right: solid rgb(198,198,198) 2px;
  }

  &__notes{
    // height: 39px;
    padding: 0 5px 0 5px;
    display: inline-block;
    border-right: solid rgb(198,198,198) 2px;
  }

  &__img{
    margin-left: auto;
    height: 30px;
  }
}

#saveButton
{
  height: 30px;
  width: 30px;
  background: url('../images/outline_save_black_24dp.png') no-repeat;
  background-size: 100%;
  border: 0;
  margin-right: 10px;
}

#undoButton
{
  height: 30px;
  width: 30px;
  background: url('../images/outline_undo_black_24dp.png') no-repeat;
  background-size: 100%;
  border: 0;
}

#redoButton
{
  height: 30px;
  width: 30px;
  background: url('../images/outline_redo_black_24dp.png') no-repeat;
  background-size: 100%;
  border: 0;
}

#graphContainer{
  background: url('../images/white-tree-background.png');
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  &__mask {
    z-index: 9998;
    position: relative;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, .5);
    transition: opacity .3s ease;
  }

  &-window {
    padding: 30px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    z-index: 9999;
    border: 1px solid #333;
    border-radius: 5px;
    background-color: white;

    &__title {

    }

  }

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
