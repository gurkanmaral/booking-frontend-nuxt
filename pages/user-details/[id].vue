<script setup>
definePageMeta({
  layout: 'user',
})


import axios from 'axios';
import { useAsyncData,useRoute,useRouter } from 'nuxt/app';
import { ref, computed } from 'vue';
import { useCookie } from '#app';
const route = useRoute()
const token = useCookie('auth_token');

const {data:user,error,pending,refresh} = await useAsyncData(
    `'user-details-${route.params.id}`,
    ()=> axios.get(`http://127.0.0.1:8000/api/user-details/${route.params.id}`).then((res)=>res.data.user)
)
const { data: currentUser, error: userError, pending: userPending, refresh: userRefresh } = await useAsyncData(
  'current-user',
  async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/user", {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      if (response.data && typeof response.data === 'object') {
      
        console.log(response.data, "user");
      } else {
        console.error("Invalid user data received from the server");
      }

      return response.data;
    } catch (err) {
      console.error("Error fetching user data:", err);
      throw err;
    }
  }
);

const isBookingCurrentUser = (userId) => {

  const isCurrentUser = computed( ()=> userId !== currentUser?.value?.id )
  return isCurrentUser
}


const isCurrentUser = computed( ()=> user._rawValue.id === currentUser?.value?.id);

</script>

<template>
   
<div class=" mt-10 max-w-3xl mx-auto w-full flex flex-col mb-10">
    <div class=" flex gap-4 px-2 py-3">
       <div class=" p-3 rounded-full bg-emerald-500">
        <i class="pi pi-user" style="font-size: 60px">

        </i>
       </div>
      <div class="flex flex-col  ">
        <div class="flex flex-col  h-full">
            <p class="text-2xl font-semibold"> 
              {{ user?.name }}

            </p>
            <span class="text-red-500 text-lg">
                Host
            </span>
       </div>
       <div class="flex gap-2">
        <span>Contact: <span>{{ user?.email }}</span> </span>
       </div>
      </div>
    </div>
    <div class="mt-10">
        <div v-if="isCurrentUser" >
            <span class="text-lg font-semibold">
              Your Accomodations
            </span>
        </div>
        <div v-else>
            <span  class="text-lg font-semibold">
              {{ user?.name }} Accomodations
            </span>
        </div>
        <div class="grid grid-cols-1 gap-4 mt-4">
          <Nuxt-link :to="`/houses/${house.id}`" v-for="house in user?.houses" :key="house.id" class=" flex  gap-4 border border-black/55 p-2 rounded-md">
              <img :src="`http://127.0.0.1:8000/storage/${house.image_url_1}`" class="rounded-md aspect-square object-cover w-20 h-20" alt="">
              <div class="flex flex-col gap-2">
                <span class="text-lg  font-semibold">{{house.name}}</span>
                <span>{{house.location}}</span>
              </div>
          </Nuxt-link>
      </div>
    </div>
    <div class="mt-10">
        <div v-if="isCurrentUser">
                <h1 class="text-lg font-semibold mb-4">Booked </h1>
                <div class="grid grid-cols-1 gap-4 mt-4 ">
                  <Nuxt-link :to="`/houses/${booking.house.id}`" v-for="booking in user?.bookings" :key="booking.id" class="flex justify-between items-center  gap-4 border border-black/55 p-2 rounded-md">            
                      <div class="flex gap-2 items-center">
                        <img :src="`http://127.0.0.1:8000/storage/${booking?.house.image_url_1}`" class="rounded-md aspect-square object-cover w-20 h-20" alt="">
                        <div class="flex flex-col gap-2">
                         <span class="text-lg font-semibold">{{booking?.house.name}}</span>
                         <span>{{booking?.house.location}}</span>
                        </div>
                      </div>
                      <div class="flex gap-10 items-center justify-center">
                        <div class="flex flex-col gap-2">
                          <span>Check in: {{booking?.start_date}}</span>
                          <span>Checl out: {{booking?.end_date}}</span>
                        </div>
                        <div class="flex flex-col gap-4">
                          <Nuxt-link :to="`/user-details/${booking.house.user.id}`">
                            Host:{{ booking?.house.user.name }}
                          </Nuxt-link>
                          <div v-if="isBookingCurrentUser(booking?.house.user.id)">
                            <Nuxt-link :to="`/chat/${booking?.house.user.id}`" class="bg-emerald-500 rounded-md p-2">
                              <span>Send message</span>
                            </Nuxt-link>
                          </div>          
                        </div>
                      </div>
            </Nuxt-link>
                </div>
        </div>
    </div>
</div>
</template>