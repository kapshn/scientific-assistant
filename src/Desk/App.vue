<template>
  <div id="app">
    <header class="header">
      <img class="header__img" src="../images/logo.png" alt="research assistant logo">
      <router-link :to="{ name: 'myprojects' }">
        <FolderOpenIcon class="header__folder-icon icon-42"/>
      </router-link>
      <h1 class="header__title">{{name}}</h1>
    </header>
    <div class='toolbar' id="toolbar">
      <div class="toolbar__special">
        <!--<button id="saveButton"></button>-->
        <SaveIcon class="icon-30" id="saveButton"/>
        <!--<button id="undoButton"></button>-->
        <UndoIcon class="icon-30" id="undoButton"/>
        <!--<button id="redoButton"></button>-->
        <RedoIcon class="icon-30" id="redoButton"/>
      </div>
      <div class="toolbar__notes" id="noteToolbar"></div>
      <div class="toolbar__font" id="fontToolbar">
        <BoldIcon id="boldButton"/>
        <ItalicIcon id="italicButton"/>
        <UnderlineIcon id="underlineButton"/>
        <select id="fontSizeSelect">
          <option value="8">8</option>
          <option value="10">10</option>
          <option value="12">12</option>
          <option value="14">14</option>
          <option value="16">16</option>
          <option value="18">18</option>
        </select>

        <select id="fontFamilySelect">
          <option value="Arial">Arial</option>
          <option value="Dialog">Dialog</option>
          <option value="Verdana">Verdana</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier">Courier</option>
        </select>
      </div>

      <ul class="toolbar__border">
        <li><div id="changeBorderWidth"></div>
          <ul class="dropdownwidth" style="border: solid rgb(198,198,198) 2px">
            <li><div id="changeBorderWidth1"></div></li>
            <li><div id="changeBorderWidth2"></div></li>
            <li><div id="changeBorderWidth3"></div></li>
          </ul>
        </li>
        <li><div id="changeBorderColor"></div>
          <ul class="dropdownwidth" style="border: solid rgb(198,198,198) 2px">
            <li><div id="changeBorderColor1"></div></li>
            <li><div id="changeBorderColor2"></div></li>
            <li><div id="changeBorderColor3"></div></li>
            <li><div id="changeBorderColor4"></div></li>
          </ul>
        </li>
        <li><div id="clearBorderButton"></div></li>
      </ul>

    </div>
    <div class='editor'>
      <div id="graphContainer" style="overflow:hidden;cursor:default;"></div>       
    </div>
    <TextIcon id='showTextButton' :size="32" />

    <div class="modal" v-if="editingWindowVisibility">
      <div class="modal__mask" @click="CloseModal()"></div>
      <div class="modal-window">
          <h1 class="modal-window__title">Редактирование</h1>
          <div id="properties" style="border: solid 1px black; padding: 10px;"></div>
          <div id="uploadButton" @click="uploadFileWindowVisibility = true" v-if="uploadFileButtonVisibility">Загрузить</div>
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

#showTextButton {
  bottom: 15px;
  left: 15px;
  position: fixed;
  z-index: 100;
  cursor: pointer;

  &:hover{
    color: #808080;
  }
}

.header {
  z-index: 100;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
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

  &__folder-icon{
    margin-left: 30px;
    color: #c5c5c5;

    &:hover{
      color: #808080;
    }
  }
}

.material-design-icon.icon-42 > .material-design-icon__svg {
  height: 42px;
  width: 42px;
}

.material-design-icon.icon-30 > .material-design-icon__svg {
  height: 30px;
  width: 30px;
}


//mike
ul {
  list-style: none;
  margin: 0;
  padding-left: 0;
  z-index: 1;
}

li {
  z-index: 1;
    display: block;
    float: left;
    position: relative;
    text-decoration: none;
  transition-duration: 0.5s;
}

li:hover {
    cursor: pointer;
}

ul li ul {
    visibility: hidden;
  opacity: 0;
    position: absolute;
  transition: all 0.5s ease;
    left: 0;
  display: none;
}

ul li:hover > ul,
ul li ul:hover {
  visibility: visible;
  opacity: 1;
  display: block;
}

ul li ul li {
    clear: both;
  width: 100%;
}
//mike

.toolbar
{
  z-index: 100;
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  margin-top: 60px;
  border-top: solid rgb(198,198,198) 2px;
  border-bottom: solid rgb(198,198,198) 2px;
  display:flex;

  &__special{
    padding: 5px 15px 0 15px;
    border-right: solid rgb(198,198,198) 2px;
  }

  &__notes{
    padding: 3px 5px 0 5px;
    border-right: solid rgb(198,198,198) 2px;

    img{
      background-color:red;
      cursor: pointer;
      &:hover{
        color: #808080;
      }
    }
  }

  &__font{
    display:flex;
    align-items: center;
    padding: 3px 10px 0 10px;
    border-right: solid rgb(198,198,198) 2px;
  }

//mike
  &__border{
      height: 35px;
      padding: 2px 8px 2px 8px;
      display:flex;
      flex-direction: row;
      align-items: center;
      border-right: solid rgb(198,198,198) 2px;
    }
//mike
}

#changeBorderWidth
{
  height: 30px;
  width: 30px;
  background: url('../images/line-width.png') no-repeat;
  background-size: 100%;
  border: 0;
}
#changeBorderWidth1
{
  height: 30px;
  width: 30px;
  background: url('../images/line-width-1.png') no-repeat;
  background-size: 100%;
  border: 0;
}
#changeBorderWidth2
{
  height: 30px;
  width: 30px;
  background: url('../images/line-width-2.png') no-repeat;
  background-size: 100%;
  border: 0;
}
#changeBorderWidth3
{
  height: 30px;
  width: 30px;
  background: url('../images/line-width-3.png') no-repeat;
  background-size: 100%;
  border: 0;
}

#changeBorderColor
{
  height: 30px;
  width: 30px;
  background: url('../images/line-color.png') no-repeat;
  background-size: 100%;
  border: 0;
  margin-left: 5px;
}
#changeBorderColor1
{
  height: 30px;
  width: 30px;
  background: url('../images/line-color-1.png') no-repeat;
  background-size: 100%;
  border: 0;
}
#changeBorderColor2
{
  height: 30px;
  width: 30px;
  background: url('../images/line-color-2.png') no-repeat;
  background-size: 100%;
  border: 0;
}
#changeBorderColor3
{
  height: 30px;
  width: 30px;
  background: url('../images/line-color-3.png') no-repeat;
  background-size: 100%;
  border: 0;
}
#changeBorderColor4
{
  height: 30px;
  width: 30px;
  background: url('../images/line-width-1.png') no-repeat;
  background-size: 100%;
  border: 0;
}

#clearBorderButton
{
  height: 30px;
  width: 30px;
  background: url('../images/clear-button.png') no-repeat;
  background-size: 100%;
  margin-left: 3px;
  border: 0;
}

#boldButton{
  cursor: pointer;
  &:hover{
    color: #808080;
  }
}

#italicButton{
  cursor: pointer;
  &:hover{
    color: #808080;
  }
}

#underlineButton{
  cursor: pointer;
  &:hover{
    color: #808080;
  }
}

.editor{
}

#saveButton{
  //border: 0;
  margin-right: 10px;
  cursor: pointer;
  &:hover{
    color: #808080;
  }
}

#undoButton{
  // height: 30px;
  // width: 30px;
  // background: url('../images/outline_undo_black_24dp.png') no-repeat;
  // background-size: 100%;
  //border: 0;
  cursor: pointer;
  &:hover{
    color: #808080;
  }
}

#redoButton{
  // height: 30px;
  // width: 30px;
  // background: url('../images/outline_redo_black_24dp.png') no-repeat;
  // background-size: 100%;
  //border: 0;
  cursor: pointer;
  &:hover{
    color: #808080;
  }
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
  }

}

#uploadButton {
  font-size: 14px;
  border: 1px solid black;
  width: 100px;
  padding: 5px;
  font-weight: 400;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
}

#fontSizeSelect{
  margin: 0 5px 5px 5px;
}

#fontFamilySelect{
  margin: 0 5px 5px 5px;
}

</style>
