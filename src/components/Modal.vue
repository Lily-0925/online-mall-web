<template>
    <div>
         <div class="md-modal modal-msg md-modal-transition md-show" v-show="{'md-show':mdShow}">
          <div class="md-modal-inner">
            <div class="md-top">
              <button class="md-close" @click="closeModal">Close</button>
            </div>
            <div class="md-content">
              <div class="confirm-tips">
                <slot name="message"></slot>
              </div>
              <div class="btn-wrap">
                  <slot name="btnGroup"></slot>
              </div>
            </div>
          </div>
        </div>
  <div class="md-overlay" @click="closeModal" v-show="mdShow"></div>
    </div>
</template>
<style>
.header{
    width: 100%;
   background-color: white;
    font-family: "moderat",sans-serif;
    font-size: 16px;
  }
  .navbar {
    display: flex;
    justify-content: space-between;
    align-content: center;
    width: 100%;
    height: 70px;
    max-width: 1280px;
    margin: 0 auto;
    padding: 5px 20px 10px 20px;
  }
  .navbar-left-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-left: -20px;
  }
  .navbar-brand-logo {
    /*width: 120px;*/
  }
  .header a, .footer a {
    color: #666;
    text-decoration: none;
  }
  a {
    -webkit-transition: color .3s ease-out;
    transition: color .3s ease-out;
  }
  .navbar-right-container {
    display: none;
    justify-content: flex-start;
    align-items: center;
  }
  .navbar-menu-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 10px;
  }
  .navbar-link {
    padding-left: 15px;
  }
  .navbar-cart-container {
    position: relative;
  }
  .navbar-cart-count {
    justify-content: center;
    align-items: center;
    position: absolute;
    top: -9px;
    right: -11px;
    width: 20px;
    border-radius: 10px;
    color: white;
    background-color: #eb767d;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
  }
  .navbar-cart-logo {
    width: 25px;
    height: 25px;
    transform: scaleX(-1);
  }
</style>
<script>
export default {
    props:["mdShow"],
    data(){
        return{
            msg:"hello VUE"
        }
    },
    methods:{
        closeModal(){
            this.$emit("close")
        }
    }
}
</script>