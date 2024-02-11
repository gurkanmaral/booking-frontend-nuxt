<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter,useAsyncData } from 'nuxt/app';

const priceSort = ref('desc');
const houseType = ref('');
const router = useRouter();
const route = useRoute();
const currentPage = computed(() => Number(route.query.page) || 1);

const fetchData = async () => {
  const query = {
    ...route.query,
    page: currentPage.value,
    sort: priceSort.value,
    type: houseType.value,
  };

  const response = await $fetch('http://127.0.0.1:8000/api/search', { params: query });
  return response;
};

const { data: houses, pending, error, refresh } = await useAsyncData(fetchData);

console.log(route.query)

watch(() => route.query, refresh, { deep: true });

const applyFilters = () => {
  router.push({
    path: route.path,
    query: {
      ...route.query,
      page: 1,
      sort: priceSort.value,
      type: houseType.value,
    },
  });
};

const navigatePage = (page) => {
  router.push({ query: { ...route.query, page } });
};

const formatPrice = (price) => {
  if (price < 1000) return price.toString();
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
</script>



<template>
    <div class="w-full flex gap-4 mt-4">
        <div class="w-1/4 border h-[50%] p-3 rounded-lg shadow-md shadow-black/15 border-black flex flex-col gap-10">
            <div class="flex">
                <label for="priceSort">
                    Sort by Price:
                </label>
                <select v-model="priceSort" id="priceSort">
                    <option value="desc">
                        Highest to lowest
                    </option>
                    <option value="asc">
                        Lowest to highest
                    </option>
                </select>
            </div>

            <div class="flex">
                <label for="houseType">House Type:</label>
                <select id="houseType" v-model="houseType">                
                    <option value="">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="house">House</option>
                </select>
            </div>
            <button @click="applyFilters">Apply Filters</button>
       </div>
       <div class="w-full flex flex-col">
        <div class="w-full ">
            <div v-if="houses?.houses?.data && houses?.houses?.data?.length > 0" class=" min-h-screen w-full grid grid-cols-4">
                <NuxtLink :to="`/houses/${house.id}`" v-for="house in houses?.houses?.data" :key="house.id" class=" p-2 flex flex-col">                
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
                 </NuxtLink>
            </div>
            <div v-else>
                No houses
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
    </div>
</template>