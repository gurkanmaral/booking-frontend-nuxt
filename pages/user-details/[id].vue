<script setup>
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
        // Ensure that the response data is a valid object.
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

console.log(user);

const isCurrentUser = computed( ()=> user._rawValue.id === currentUser?.value?.id);

console.log(user._rawValue.id,"current")
console.log(currentUser.value.id,"user")
</script>

<template>
   
<div class=" mt-10 max-w-3xl mx-auto w-full flex flex-col">
    <div class=" flex gap-4 px-2 py-3">
       <div class=" p-3 rounded-full bg-blue-600">
        <i class="pi pi-user" style="font-size: 60px">

        </i>
       </div>
      <div class="flex flex-col  ">
        <div class="flex gap-2    h-full">
            <p class="text-2xl font-semibold"> {{ user?.name }}

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
            Your Accomodations
            <div>
                <div v-for="house in user?.houses" :key="house.id" class="border border-black flex gap-4">
                    <img :src="`http://127.0.0.1:8000/storage/${house.image_url_1}`" class="rounded-md aspect-square object-cover w-20 h-20" alt="">
                    <span>{{house.location}}</span>
                    <span>{{house.id}}</span>
                    <span>{{house.location}}</span>
                </div>
            </div>
        </div>
        <div v-else>
            {{ user?.name }} Accomodations
        </div>
    </div>
    <div class="mt-10">
        <div v-if="isCurrentUser">
                <h1>Booked </h1>
                <div v-for="booking in user?.bookings" :key="booking.id" class="border border-black flex gap-4">
                    {{ booking.id }}               
                        <img :src="`http://127.0.0.1:8000/storage/${booking?.house.image_url_1}`" class="rounded-md aspect-square object-cover w-20 h-20" alt="">
                        <span>{{booking?.house.name}}</span>
                        <span>{{booking?.house.price}}</span>
                        <span>{{booking?.house.location}}</span>
                        <span>{{booking?.start_date}}</span>
                        <span>{{booking?.end_date}}</span>
                </div>
        </div>
    </div>
</div>
</template>