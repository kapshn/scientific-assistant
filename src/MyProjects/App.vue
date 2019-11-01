<template>

  <div id="app">
    <header class="header">
      <img class="header__img" src="../images/logo.png" alt="research assistant logo">
      <h1 class="header__title">Научный ассистент</h1>
      <div class="header-profile" @click="LogOut()">
        <div class="header-profile__name">{{profile}}</div>
        <i class="material-icons header-profile__icon"
        >exit_to_app</i>
      </div>
    </header>

    <div class="projects">
      <div class="projects__head">
        <h3 class="projects__title">Мои проекты</h3>
        <i class="material-icons projects__additem"
        @click="SetModalWindowMark()"
        >add_circle</i>
      </div>
      <div class="projects-block">
        <Project
        v-for="project in projects"
        v-bind:project="project"
        v-on:popupWindowVisibility="visible = $event"
        v-on:selectedProject="selectedProject = $event"
        v-on:deleteMark="deleteMark = $event;"
        v-on:rerender="Rerender()"
        ></Project>
      </div>
    </div>


    <div class="modal" v-if="visible">
      <div class="modal__mask" @click="CloseModal()"></div>
      <div class="modal-window" v-if="deleteMark">
          <h1 class="modal-window__title">Удалить проект: {{selectedProject.name}} ?</h1>
          <div class="modal-window__buttons">
            <button type="button" @click="DeleteFile()">Да</button>
            <button type="button" @click="CloseModal()">Нет</button>
          </div>
      </div>
      <div class="modal-window" v-else>
        <h1 class="modal-window__title">Создать проект</h1>
        <div class="modal-window__inputTitle">Введите имя проекта:</div>
        <input type="text" class="modal-window__input" id="fileName">
        <div class="modal-window__buttons">
          <button type="button" @click="CreateFile()">Создать</button>
          <button type="button" @click="CloseModal()">Отмена</button>
        </div>
      </div>
    </div>

  </div>

</template>

<script src="./myProjects.js"></script>

<style lang="scss" scoped>

p {
  font-size: 20px;
}

body {
  margin: 0;
}

.header {
  border-bottom: solid #0c73b8 2px;
  margin: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;

  &__img {
    width: 130px;
    height: 155px;
    margin-left: 15px;
    max-width: 100%;
    max-height: 100%;
  }

  &__title {
    font-size: 35px;
    color: #373737;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    margin-left: 30px;
    line-height: 60px;
    text-transform: uppercase;
  }

  &-profile {
    align-self: flex-end;
    margin-left: auto;
    margin-bottom: 25px;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;


    &:hover {
      .header-profile__name {
        color: #0c73b8;
      }
      .header-profile__icon {
        color: #0c73b8;
      }
    }

    &__name {
      font-size: 24px;
      color: #333;
    }

    &__icon {
      transform: scaleY(1.5);
      font-size: 26px;
      color: #555;
      margin-left: 20px;
    }
  }


}

.projects {

  margin: 10% 10%;

  &__head {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 15px;
  }

  &__title {
    font-size: 32px;
    color: #333;
    font-family: 'Roboto', sans-serif;
    display: inline;
    margin: 0;
  }

  &__additem {
    margin-left: 15px;
    color: #0c73b8;
    text-align: center;
    cursor: pointer;
  }

  &-block {
    border-radius: 5px;
    border: 1px solid black;
    box-shadow: 0px 0px 7px 2px rgba(0,0,0,0.29);
    padding: 25px;
    display: flex;
    flex-wrap: wrap;
  }
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

    &__inputTitle {
      display: inline-block;
      font-size: 18px;
    }

    &__input {
      display: inline-block;
      outline: none;
      border: none;
      font-size: 18px;
      margin-left: 5px;
      border-bottom: 1px solid black;
    }

    &__buttons {

      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-top: 15px;

      & button {
        border: 2px solid black;
        border-radius: 2px;
        color: black;
        background-color: white;
        font-size: 24px;
        height: 35px;
        cursor: pointer;

        &:last-child {

        }
      }

    }

  }
}


</style>
