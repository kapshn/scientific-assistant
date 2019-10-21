<template>
  <div>
    <div id="header-div">
        <div id="header-img-div">
            <img id= "header-img" src="../images/logo.png" alt="research assistant logo"/>
        </div>
        <div id="header-title-div">
            НАУЧНЫЙ АССИСТЕНТ
        </div>
    </div>
    <div id="content-div">
        <div id="round-div">
            <img id="round-img" src="../images/user_login.png" />
        </div>
        <div id="sign-in-div">
            <div id="sign-in-title-div">
                Вход в систему
            </div>
            <div id="sign-in-button-div">
                <button id="sign-in-button"></button>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
  }
</script>

<style lang="scss" scoped>
  body{
      margin:0;
  }

  #header-div{
    border-bottom: solid #0c73b8 2px;
    margin: 20px 20px 0 20px;
  }

  #header-img-div{
    width: 140px;
    height: 155px;
    display: inline-block;
    padding-left: 15px;
    vertical-align:middle;
  }

  #header-img{
    max-width: 100%;
    max-height: 100%;            
  }

  #header-title-div{
    display: inline-block;
    font-size:35px;
    color: #373737;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    vertical-align:middle;
    margin-left:30px;
    line-height: 60px;
  }

  #round-div{
    width: 100px;
    height: 100px;
    margin:-50px auto 0 auto;
  }

  #round-img{
    max-width: 100%;
    max-height: 100%;
  }

  #content-div{
    margin: 120px auto 0 auto;
    width: 450px;
    height: 300px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(56,56,56,0.38);            
    border: 1px solid #373737;
  }

  #sign-in-title-div{
    text-align: center;
    font-size: 25px;
    line-height: 117px;
    color: #373737;
    font-family: "Roboto";
    font-weight: 300;
  }

  #sign-in-button-div{
    margin:0 auto;
    width:250px;
    height:54px;
  }


  #sign-in-button{
    padding: 0px;
    background: url('../images/login-google-blue.png') no-repeat;
    background-size:100%;
    width: 100%;
    height: 100%;
    border:0;
  }

  #sign-in-button:focus{
    box-shadow: 1px 4px 5px 1px rgba(0,0,0,0.1);
  }

  #sign-in-button:hover{
    box-shadow: 1px 4px 5px 1px rgba(0,0,0,0.1);
  }
</style>
