<template>
  <div id="app">
    <!-- {{id}} -->
    <div id="main-div">
      <table style="position:relative;">
        <tr>
          <div id="toolbarContainer">				  
          </div>
        </tr>
        <tr>
          <td>
            <div id="graphContainer" style="border: solid 1px black;overflow:hidden;width:500px;height:400px;cursor:default;">
            </div>
          </td>
          <td valign="top">
            <div id="properties" style="border: solid 1px black; padding: 10px;">
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script src="./desk.js"></script>

<style scoped>
p {
  font-size: 20px;
}
</style>
