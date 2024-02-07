<script setup>
import axios from 'axios';
import { useAsyncData,useRoute,useRouter } from 'nuxt/app';
import OverlayPanel from 'primevue/overlaypanel';
import Calendar from 'primevue/calendar';
import { computed } from 'vue';

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

const lastPage = houses.last_page;

const formatPrice = (price) => {
    if (price < 1000) return price.toString(); 

    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); 
};

const start_date = ref();
const end_date = ref();

const location = ref('');

const showGuestsPopover = ref(false);
const adults = ref(2); 
const children = ref(1); 

const toggleGuestsPopover = () => {
  showGuestsPopover.value = !showGuestsPopover.value;
};

const incrementAdults = () => {
  adults.value++;
};


const decrementAdults = () => {
  if (adults.value > 1) { 
    adults.value--;
  }
};

const incrementChildren = () => {
  children.value++;
};

const decrementChildren = () => {
  if (children.value > 0) {
    children.value--;
  }
};



watch(() => route.query.page, () => {
  if (houses.value) {
    refresh();
  }
});

const saveGuestSelection = () => {
  // Example: Log the selection or replace this with an API call, etc.
  console.log(`Saving selection: ${adults.value} adults, ${children.value} children`);
  
  console.log(location.value)
  console.log(end_date.value)
  console.log(start_date.value)
  showGuestsPopover.value = false;
};


const handleSearch = () => {


// Construct the query parameters
const queryParams = new URLSearchParams({
  location: location.value,
  start_date: start_date.value ? start_date.value.toISOString().split('T')[0] : '', 
  end_date: end_date.value ? end_date.value.toISOString().split('T')[0] : '',
  adults: adults.value,
  children: children.value,
}).toString();

console.log(queryParams)

router.push(`/search?${queryParams}`);
};

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
  <div class="w-full gap-3 border border-black flex py-4 px-5 rounded-lg justify-around mt-4 shadow-md shadow-black/15">
      <div class=" w-full">
        <input type="text" v-model="location"  placeholder="Location" class="bg-black p-2 w-full rounded-md text-white"  />
      </div>
      <div class="w-full ">    
        <Calendar v-model="start_date" showIcon placeholder="check-in"  class="rounded-lg bg-emerald-500  py-2 px-2  border-black text-black"  />
      </div>
      <div class="w-full ">
          <Calendar v-model="end_date" showIcon placeholder="check-out" class="rounded-lg bg-emerald-500  py-2 px-2  border-black text-black" />
      </div>
      <div class="w-full relative">
          <div class="border border-black w-full h-full items-center justify-center flex rounded-lg font-semibold">
            <button class="btn" @click="toggleGuestsPopover">Guests</button>
          </div>
          <div  class="absolute z-10 mt-2 w-48 bg-white shadow-lg rounded-lg p-4" v-if="showGuestsPopover">
            <div class="flex items-center justify-between mb-4">
              <div>Adults</div>
              <div class="flex items-center">
                <button class="px-2 py-1 text-lg" @click="decrementAdults">-</button>
                <div>{{ adults }}</div>
                <button class="px-2 py-1 text-lg" @click="incrementAdults">+</button>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div>Children</div>
              <div class="flex items-center">
                <button class="px-2 py-1 text-lg" @click="decrementChildren">-</button>
                <div>{{ children }}</div>
                <button class="px-2 py-1 text-lg" @click="incrementChildren">+</button>
              </div>
            </div>
            <div class="w-full">
                <button class="mt-4 btn btn-primary" @click="saveGuestSelection">Save</button>
            </div>
          </div>
      </div>
      <div class="w-full ">
        <button class="bg-red-500 w-full h-full rounded-lg text-white" @click="handleSearch">
            Search
          </button>
    </div>
  </div>
  <div>
    <div v-if="pending">
      <p>Loading houses...</p>
    </div>
    <div v-else-if="error">
      <p>Error fetching houses: {{ error.message }}</p>
    </div>
    <div v-else class="flex flex-col w-full min-h-screen max-w-7xl mx-auto    ">
      <div class="min-h-screen">
        <div class="grid grid-cols-4 gap-4 mt-10">
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
    <button @click="navigatePage(currentPage - 1)" :disabled="currentPage <= 1">
      Previous
    </button>
    <button @click="navigatePage(currentPage + 1)" :disabled="!houses.houses.next_page_url">
      Next
    </button>
  </div>
 </div>
  </template>