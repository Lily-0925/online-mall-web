import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from './../view/GoodsList'
import Cart from '@/view/Cart'
import Address from '@/view/Address'
import OrderSuccess from '@/view/OrderSuccess'


Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name:"goodlist",
      component: GoodsList,
    },
    {
      path: '/cart',
      name:"Cart",
      component: Cart,
    },
    {
      path: '/address',
      name:"Address",
      component: Address,
    },
    {
      path: '/orderConfirm',
      name:"OrderConfirm",
      component: OrderConfirm,
    },
    {
      path: '/orderSuccess',
      name:"OrderSuccess",
      component: OrderSuccess,
    }
  ]
      
})
