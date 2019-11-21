<template>
  <router-link id="project" class="project" :to="{ name: 'desk', query: { id: project.id, name: project.name, docId: project.docId, folderId: project.folderId} }" @click.native="ConfirmRedirect($event)">
    <i class="material-icons project__img">folder</i>
    <div class="project__name" v-if="!editVisibility" >
      {{project.name}}
    </div>
    <input type="text" v-if="editVisibility" id="projectName" class="project__nameEdit" :value="project.name">
    <i class="material-icons project__apply" v-if="editVisibility" v-on:click="ApplyFileName();">done</i>
    <i class="material-icons project__cancel" v-if="editVisibility" v-on:click="CancelEdit();">clear</i>
    <i class="material-icons project__edit" v-if="!editVisibility" v-on:click="EditFileName();">create</i>
    <i class="material-icons project__delete" v-if="!editVisibility" v-on:click="SelectFile();">delete</i>
  </router-link>

</template>

<script src="../components/project.js"></script>

<style lang="scss" scoped>
.project {
  text-decoration: none;
  color: black;
  opacity: 0.6;
  padding: 10px;
  flex: 0 0 28%;
  margin: 15px;
  border: 1px solid grey;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;

  &__img {
    font-size: 25px;
  }

  &__name {
    color: black;
    margin-left: 15px;
    font-size: 24px;
  }

  &__nameEdit {
    border: none;
    border-bottom: 1px solid black;
    outline: none;
    font-size: 24px;
    width: 100%;
    margin: 0 5px;
  }

  &__cancel {
      cursor: pointer;
      &:hover {
        color: red;
        text-shadow: #333 2px 2px 2px;
      }
  }

  &__apply {
    cursor: pointer;
    &:hover {
      color: green;
      text-shadow: #333 2px 2px 2px;
    }
  }

  &__edit {
    align-self: flex-start;
    margin-left: auto;
    display: none;
    font-size: 18px;
    margin-right: 5px;
    cursor: pointer;
    color: #444;
    &:hover {
      color: black;
      text-shadow: #333 2px 2px 2px;
    }
  }

  &__delete {
    align-self: flex-start;
    display: none;
    font-size: 18px;
    margin-right: 5px;
    cursor: pointer;
    color: #444;
    &:hover {
      color: black;
      text-shadow: #333 2px 2px 2px;
    }
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
