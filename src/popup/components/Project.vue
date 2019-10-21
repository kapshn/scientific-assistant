<template>
  <div class="project">
    <div class="project__img"></div>
    <div class="project__name">{{project.name}}</div>
    <input type="text" class="project__nameEdit">
    <div class="project__edit"></div>
    <div class="project__delete"></div>
  </div>
</template>

<script>
export default {
  props: {
    project: {
      type: Object
    }
  }
}
</script>

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
  cursor: pointer;

  &__img {
    background-color: black;
    height: 25px;
    width: 25px;
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
    height: 10px;
    width: 10px;
    background-color: black;
    margin-right: 5px;
  }

  &__delete {
    align-self: flex-start;
    display: none;
    height: 10px;
    width: 10px;
    background-color: black;
    margin-right: 5px;
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
