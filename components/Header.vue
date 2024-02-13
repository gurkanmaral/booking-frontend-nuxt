<script setup>
import { useAsyncData,useRoute,useRouter } from 'nuxt/app';
import OverlayPanel from 'primevue/overlaypanel';
import Calendar from 'primevue/calendar';

const route = useRoute()
const router= useRouter()

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


const saveGuestSelection = () => {
  // Example: Log the selection or replace this with an API call, etc.
  console.log(`Saving selection: ${adults.value} adults, ${children.value} children`);
  
  console.log(location.value)
  console.log(end_date.value)
  console.log(start_date.value)
  showGuestsPopover.value = false;
};



const handleSearch = () => {

const queryParams = new URLSearchParams({
  location: location.value,
  start_date: start_date.value ? start_date.value.toISOString().split('T')[0] : new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  end_date: end_date.value ? end_date.value.toISOString().split('T')[0] : new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  adults: adults.value,
  children: children.value,
}).toString();

console.log(queryParams)

router.push(`/search?${queryParams}`);
};


</script>

<template>  
  <div class="w-full gap-3 border border-b-4 border-l-4 border-black bg-emerald-500 flex flex-col md:flex-row py-4 px-5 rounded-lg justify-around mt-4 shadow-md shadow-black/15"> 
      <div class=" w-full">
          <input type="text" v-model="location"  placeholder="Location" class="shadow shadow-black/15 bg-white px-2 py-3 w-full border border-black/55 rounded-md text-black"  />
        </div>
        <div class="w-full ">    
          <Calendar v-model="start_date"  showIcon placeholder="check-in"  class="w-full shadow shadow-black/15 calendar rounded-lg bg-white  py-2 px-2  border border-black/55 text-black"  />
        </div>
        <div class="w-full ">
            <Calendar v-model="end_date"  showIcon placeholder="check-out" class="w-full shadow shadow-black/15 calendar rounded-lg bg-white py-2 px-2 border border-black/55k text-black" />
        </div>
        <div class="w-full relative">
            <div class="shadow shadow-black/15 border border-black/15 bg-white w-full h-full items-center justify-center flex rounded-lg font-semibold">
              <button class="btn p-2 md:p-0" @click="toggleGuestsPopover">Guests</button>
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
              <div class="w-full ">
                  <button class="mt-4 btn btn-primary" @click="saveGuestSelection">Save</button>
              </div>
            </div>
        </div>
        <div class="w-full">
          <button class="shadow shadow-black/15 p-2 md:p-0 bg-red-500 w-full h-full rounded-lg text-white" @click="handleSearch">
              Search
            </button>
      </div>
    </div>
</template>