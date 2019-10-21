<template>
  <div id="app">
    <header class="header">
      <div class="header__img">Chel</div>
      <h1 class="header__title">Научный ассистент</h1>
      <div class="header__profileName">Аллах Акбарович</div>
      <div class="header__logoff"></div>
    </header>
    <div class="projects">
      <div class="projects__head">
        <h3 class="projects__title">Мои проекты</h3>
        <div class="projects__additem">+</div>
      </div>
      <div class="projects-block">
        <Project
        v-for="project in projects"
        v-bind:project="project"
        ></Project>
      </div>
    </div>

  </div>

</template>

<script src="./test.js"></script>

<style lang="scss" scoped>
p {
  font-size: 20px;
}

body {
  margin: 0;
}

.header {
  margin: 15px;
  border-bottom: 2px solid blue;
  display: flex;
  flex-direction: row;
  align-items: center;

  &__img {
    width: 150px;
    height: 150px;
    margin: 10px;
    background-color: blue;
  }

  &__title {
    text-transform: uppercase;
    font-size: 48px;
    color: #333;
  }

  &__profileName {
    font-size: 24px;
    color: #333;
    margin-left: auto;
    align-self: flex-end;
    margin-bottom: 25px;
  }

  &__logoff {
    height: 24px;
    width: 24px;
    background-color: black;
    align-self: flex-end;
    margin-bottom: 25px;
    margin-left: 20px;
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
    display: inline;
    margin: 0;
  }

  &__additem {
    margin-left: 15px;
    height: 25px;
    width: 25px;
    font-weight: bold;
    font-size: 20px;
    background-color: blue;
    border-radius:  100%;
    color: white;
    text-align: center;
    line-height: 1.1;
    margin-top: 10px;
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
</style>
