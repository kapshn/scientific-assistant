<template>
  <div id="uploadselect">
    <h1 class="files__title">
      Загрузить файл
    </h1>
    <div class="files-buttons">
      <router-link :to="{ name: 'drive' }" class="files-buttons__item">Drive</router-link>
      <router-link :to="{ name: 'computer' }" class="files-buttons__item">Кампудахтер</router-link>
    </div>
  </div>
</template>

<script></script>

<style lang="scss" scoped>

#uploadselect {
  height: 100%;
}

.files {


  &__title {
    position: relative;
    text-align: center;
  }

  &-buttons {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    &__item {
      height: 150px;
      width: 150px;
      background-color: green;
      border-radius: 10px;
      border: 1px solid black;
    }
  }
}


</style>
