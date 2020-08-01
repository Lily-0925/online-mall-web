<template>
  <div>
    <p>{{num}}</p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
  </div>
</template>
<script>
export default {
    props:["num"],
    data () {
    return {
      num:0
    }
  },
    methods:{
            increment(){
                    this.$emit("incre");
                    
            },
            decrement(){
                    this.$emit("decre");
            }
        }
    }

</script>
