<script setup>
import axios from 'axios';
import { useAsyncData,useRoute,useRouter } from 'nuxt/app';
import OverlayPanel from 'primevue/overlaypanel';
import Calendar from 'primevue/calendar';
import { computed } from 'vue';
import ProgressSpinner from 'primevue/progressspinner';
const route = useRoute()
const router= useRouter()
const currentPage = computed(() => Number(route.query.page) || 1);

const { data: houses, error, pending,refresh } = useAsyncData(
  `houses-page-${currentPage.value}`,
  () => axios.get(`http://127.0.0.1:8000/api/houses?page=${currentPage.value}`).then(res => res.data)
);
console.log(houses?.value?.houses)


const navigatePage = (page) => {
  router.push({ query: { ...route.query, page } });
};

const lastPage = houses?.last_page;

const formatPrice = (price) => {
    if (price < 1000) return price.toString(); 

    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); 
};





watch(() => route.query.page, () => {
  if (houses?.value) {
    refresh();
  }
});



// export default {
//   // data() {
//   //   return {
//   //     houses: [],   
//   //   };
//   // },
//   methods: {
//   // async fetchHouses() {
//   //   try {
//   //     const response = await axios.get('http://127.0.0.1:8000/api/houses');
//   //     this.houses = response.data.houses;
//   //   } catch (error) {
//   //     console.error('Failed to fetch houses:', error);
//   //   }
//   // }

// },
//   mounted() {
//   // this.fetchHouses();
// },
// };

</script>

<template>
 <div class="flex flex-col">
  <div>
    <div v-if="pending" class="w-full h-[600px] items-center justify-center flex">
      <ProgressSpinner class="w-10 h-10" />
    </div>
    <div v-else-if="error" class="w-full h-[600px] p-10">
      <p>Error fetching houses: {{ error.message }}</p>
    </div>
    <div v-else class="flex flex-col w-full min-h-screen max-w-7xl mx-auto    ">
      <div class="min-h-screen">
        <div class="grid grid-cols-1 p-3 md:p-0 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
            <NuxtLink  :to="`/houses/${house.id}`"   v-for="house in houses?.houses?.data" :key="house.id" class=" p-2 flex flex-col">                
               <div>
                <img :src="`http://127.0.0.1:8000/storage/${house.image_url_1}`" class="rounded-md aspect-square object-cover" alt="">
               </div>
                <div class="mt-3 flex flex-col">
                    <div class="flex justify-between">
                        <p class="font-bold text-lg">{{ house.name }}</p>    
                        <span>4.6</span>    
                    </div>
                    <div class="flex flex-col gap-1">
                        <p>{{house.location }}</p>
                        <div class="flex gap-1">
                            <span class="font-semibold">${{ formatPrice(house.price) }}</span>
                            <span class="text-gray-700">
                                Price for one night
                            </span>
                        </div>
                    </div>
               </div>        
            </NuxtLink >
        </div>
       </div>
      
    </div>
  </div>
  <div class="flex w-full items-center justify-center gap-5 mb-10">
    <button @click="navigatePage(currentPage - 1)" :disabled="currentPage <= 1"
    class="border border-emerald-500 rounded-md p-2 bg-emerald-500 min-w-[100px] items-center justify-center ">
      Previous
    </button>
    <button @click="navigatePage(currentPage + 1)" :disabled="!houses?.houses?.next_page_url"
    class="flex border border-emerald-500 rounded-md p-2 bg-emerald-500 min-w-[100px] items-center justify-center ">
      Next
    </button>
  </div>
 </div>
  </template>


  <style>
  .calendar input {
    
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 5px;
    padding: 4px;
    font-size: 16px;
    color: black;
    transition: border-color 0.3s ease;

  }
  .calendar input:focus {
    outline: none;
    border-color: black; 
  }
</style>