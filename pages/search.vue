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
    <div class="w-full flex flex-col md:flex-row gap-4 mt-10 p-4 md:p-0">
        <div class="w-full  md:w-1/4 border md:sticky md:top-4 h-[50%] p-3 rounded-lg shadow-md shadow-black border-l-4 border-b-4 border-black flex flex-col gap-10">
            <div class="flex flex-col gap-2">
                <label for="priceSort">
                    <span class="text-lg">
                        Sort by Price:
                    </span>
                </label>
                <select v-model="priceSort" id="priceSort" class="border border-black rounded-md p-2">
                    <option value="desc">
                        Highest to lowest
                    </option>
                    <option value="asc">
                        Lowest to highest
                    </option>
                </select>
            </div>

            <div class="flex flex-col gap-2">
                <label for="houseType">
                    <span class="text-lg">
                        House Type:
                    </span>

                </label>
                <select id="houseType" v-model="houseType" class="border-black border rounded-md p-2 custom-select">                
                    <option value="">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="house">House</option>
                </select>
            </div>
            <button @click="applyFilters"
            class="border border-emerald-500 rounded-md p-2 bg-emerald-500 min-w-[100px]"
            >
                Apply Filters

            </button>
       </div>
       <div class="w-full flex flex-col">
        <div class="w-full ">
            <div v-if="houses?.houses?.data && houses?.houses?.data?.length > 0" class=" min-h-screen w-full grid grid-cols-1 md:grid-cols-4">
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
            <div v-else class="min-h-screen p-2">
                <span class="font-semibold text-2xl">
                    No houses
                </span>
            </div>
        </div>         
        
        <div class="flex w-full items-center justify-center gap-5 mb-10">
            <button @click="navigatePage(currentPage - 1)" :disabled="currentPage <= 1"
            class="border border-emerald-500 rounded-md p-2 bg-emerald-500 min-w-[100px] items-center justify-center "
            >
                Previous
              </button>
              <button @click="navigatePage(currentPage + 1)" :disabled="!houses.houses.next_page_url"
              class="border border-emerald-500 rounded-md p-2 bg-emerald-500 min-w-[100px] items-center justify-center ">
                Next
              </button>
        </div>
    </div>
    </div>
</template>

<style>

</style>