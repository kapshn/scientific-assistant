<template>

  <div id="project" class="project" v-on:click="OpenProject();">
    <i class="material-icons project__img">folder</i>
    <div class="project__name">{{project.name}}</div>
    <input type="text" class="project__nameEdit">
    <i class="material-icons project__edit">create</i>
    <i class="material-icons project__delete" v-on:click="SelectFile();">delete</i>
  </div>

</template>

<script src="../components/project.js"></script>

<style lang="scss" scoped>
.project {
  opacity: 0.6;
  padding: 10px;
  flex: 0 0 28%;
  margin: 15px;
  border: 1px solid grey;
  display: flex;
  flex-direction: row;
  align-items: center;
  //cursor: pointer;

  &__img {
    font-size: 25px;
  }

  &__name {
    margin-left: 15px;
    font-size: 24px;
  }

  &__nameEdit {
    display: none;
  }

  &__edit {
    align-self: flex-start;
    margin-left: auto;
    display: none;
    font-size: 18px;
    margin-right: 5px;
    cursor: pointer;
  }

  &__delete {
    align-self: flex-start;
    display: none;
    font-size: 18px;
    margin-right: 5px;
    cursor: pointer;
  }

  &:hover {
      opacity: 2;

    .project__delete {
      display: block;
    }

    .project__edit {
      display: block;
    }
  }
}

</style>
