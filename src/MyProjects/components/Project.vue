<template>
  <div id="project" class="project" v-on:click="OpenProject();" >
    <i class="material-icons project__img">folder</i>
    <router-link class="project__name" v-if="!editVisibility" :to="{ name: 'desk', params: { id: project.id }}">
      {{project.name}}
    </router-link>
    <input type="text" v-if="editVisibility" id="projectName" class="project__nameEdit">
    <i class="material-icons project__cancel" v-if="editVisibility" v-on:click="CancelEdit();">clear</i>
    <i class="material-icons project__apply" v-if="editVisibility" v-on:click="ApplyFileName();">done</i>
    <i class="material-icons project__edit" v-on:click="EditFileName();">create</i>
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

  &__img {
    font-size: 25px;
  }

  &__name {
    text-decoration: none;
    color: black;
    margin-left: 15px;
    font-size: 24px;
  }

  &__nameEdit {
    border: none;
    border-bottom: 1px solid black;
    outline: none;
    width: 100%;
    margin: 0 5px;
  }

  &__cancel {
      cursor: pointer;
  }

  &__apply {
    cursor: pointer;
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
