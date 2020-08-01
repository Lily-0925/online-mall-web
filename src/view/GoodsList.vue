<template>
  <div>
    <all-header></all-header>
    <all-bread>
      <span>/Goods</span>
    </all-bread>
<div class="accessory-result-page accessory-page">
  <div class="container">
    <div class="filter-nav">
      <span class="sortby">Sort by:</span>
      <a href="javascript:void(0)" class="default cur">Default</a>
      <a href="javascript:void(0)" class="price" @click="clickSort">Price <svg class="icon icon-arrow-short" :class="{'sort-up':sortFlag}"><use xlink:href="#icon-arrow-short"></use></svg></a>
      <a href="javascript:void(0)" class="filterby stopPop" @click="showPriceFilter">Filter by</a>
    </div>
    <div class="accessory-result">
      <!-- filter -->
      <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
        <dl class="filter-price">
          <dt>Price:</dt>
          <dd><a href="javascript:void(0)" :class="{'cur':priceChecked=='all'}" @click="priceChecked='all'">All</a></dd>
          <dd v-for="(item,index) in priceFilter" :key="index">
            <a href="javascript:void(0)" :class="{'cur':priceChecked==index}" @click="setpriceChecked(index)">{{item}}</a>
          </dd>
        </dl>
      </div>

      <!-- search result accessories list -->
      <div class="accessory-list-wrap">
        <div class="accessory-list col-4">
          <ul>
            <li v-for="(item,index) in goodlists" :key="index">
              <div class="pic">
                <a href="#"><img v-lazy="'./../static/'+item.productImage" alt=""></a>
              </div>
              <div class="main">
                <div class="name">{{item.productName}}</div>
                <div class="price">{{item.salePrice}}</div>
                <div class="btn-area">
                  <a href="javascript:;" class="btn btn--m" @click="addToCart(item.productId)">加入购物车</a>
                </div>
              </div>
            </li>

          </ul>
        </div>
        <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="1">
          <img src="./../assets/css/loading-bubbles.svg" v-show="loading"> 
        </div>
      </div>
    </div>
  </div>
</div>
<div class="md-overlay" v-show="overLayFlag" @click="openOverFlay"> </div>
<modal v-bind:mdShow="mdShow" v-on:close="closeModal">
  <p slot="message">
    请先登录，否则无法加入到购物车
  </p>
  <div slot="btnGroup">
    <a class="btn btn--m" href="javascript:;" @click="mdShow=false"> 关闭</a>
  </div>
  </modal>
<modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
  <p slot="message">
    <svg class="icon-status-ok">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
    </svg>
    <span>加入购物车成功</span>
  </p>
  <div slot="btnGroup">
    <a class="btn btn--m" href="javascript:;" @click="mdShowCart=false">继续购物</a>
    <router-link class="btn btn--m" href="javascript:;" to="/cart">查看购物车</router-link>
  </div>
  </modal>
<all-footer></all-footer>
  </div>
</template>

<script>
import "./../assets/css/base.css"
import "./../assets/css/product.css"
import AllHeader from "@/components/header.vue"
import AllFooter from "@/components/footer.vue"
import AllBread from "@/components/bread.vue"
import axios from "axios"
import Modal from "@/components/Modal.vue"

export default{
  data(){
    return{
      goodlists:[],
      priceFilter:[
        "0.00-100.00",
        "100.00-500.00",
        "500.00-1000.00",
        "1000.00-5000.00"
        ],
      priceChecked:"all",
      filterBy:false,
      overLayFlag:false,
      sortFlag:false,
      page:1,
      pageSize:8,
      busy:false,
      loading:true,
      mdShow:false,
      mdShowCart:false
    }
  },
  components:{
    AllHeader,
    AllFooter, 
    AllBread,
    Modal
  }, 
   mounted(){ 
     this.getGoodsList();
   },
   methods:{
     getGoodsList(flag){
      var param = {
       page:this.page,
       pageSize:this.pageSize,
       sort:this.sortFlag?1:-1,
       priceLevel:this.priceChecked
     };
     axios.get("/goods/list",{params:param}).then((response)=>{
          let res = response.data;
          //console.log(res.result);
          if(res.status=="0"){
            if(flag){
                this.goodlists = this.goodlists.concat(res.result.list);
                if(res.result.count<this.pageSize){
                  this.loading=false;
                }
                if(res.result.count==0){
                  this.busy=true;
                }else{
                  this.busy=false;
                }
            }else{
              this.goodlists=res.result.list;
            }
          }else{
            this.goodlists=[];
          }
     });
     },
     clickSort(){
       this.sortFlag = !this.sortFlag;
       this.page=1;
       this.getGoodsList();
     },
     showPriceFilter(){
       this.filterBy=true;
       this.overLayFlag=true;
     },
     openOverFlay(){
        this.filterBy=false;
       this.overLayFlag=false;
     },
     setpriceChecked(index){
       this.priceChecked=index;
       this.page=1;
       this.getGoodsList();
       this.openOverFlay();
     },
     loadMore(){
      this.busy = true;
      
      setTimeout(() => {
            this.page++;
            this.getGoodsList(true);
      }, 500);
    },
    addToCart(productId) { // 添加购物车
            axios.post("/goods/addCart",{
              productId:productId
            }).then((res)=>{ 
              if(res.status=="0"){
                this.mdShowCart=true;
                this.$store.commit("updateCartCount",1);
              }else{
                this.mdShow=true;
              }
            });
          },
    closeModal(){
      this.mdShow=false;
      this.overLayFlag=false;
    }
    
          
  }
     
   
}

</script>
