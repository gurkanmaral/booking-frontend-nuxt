<script>
export default {

  props: {
    houseId: {
      type: String, 
      required: true,
    },
    userId:{
        type:Number,
    },
    start_date:{
        type:String,
    },
    end_date:{
        type:String,
    }
  },
mounted() {
    // Log the received props
    console.log('houseId prop:', this.houseId);
    console.log('userId prop:', this.userId);
  },
};
</script>

<template>
     <p>houseId prop: {{ houseId }}</p>
    <p>userId prop: {{ userId }}</p>
    <p>userId prop: {{ start_date }}</p>
    <!-- Rest of your component's template -->
  </template>