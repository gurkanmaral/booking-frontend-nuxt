
<script setup>
import axios from 'axios';

import Cookies from 'js-cookie';
import { useAsyncData,useRoute,useRouter } from 'nuxt/app';
import { onMounted,ref } from 'vue';
import Galleria from 'primevue/galleria';
import Calendar from 'primevue/calendar';
import { computed } from 'vue';
import { useCookie } from '#app';

import CreateBooking from '../../components/HouseDetails/CreateBooking.vue'; 

const router = useRouter()
const route = useRoute()
const token = useCookie('auth_token');
console.log(token.value,"token")

    const {data:house,error,pending,refresh} = await useAsyncData(
        `house-details-${route?.params?.id}`,
        ()=> axios.get(`http://127.0.0.1:8000/api/houses/${route?.params?.id}`).then((res)=>res.data)
    )
 
    const { data: user, error: userError, pending: userPending, refresh: userRefresh } = await useAsyncData(
  'current-user',
  async () => {
    try {
      if (!token.value) {
        console.log("User not logged in");
        return null; 
      }
      else {
        const response = await axios.get("http://127.0.0.1:8000/api/user", {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      if (response.data && typeof response.data === 'object') {
        console.log(response.data, "user");
        return response.data;
      } else {
        console.error("Invalid user data received from the server");
        throw new Error("Invalid user data received from the server");
      }
      }
      
    } catch (err) {
      console.error("Error fetching user data:", err);
      throw err;
    }
  }
);

  

    const images = ref([
    {
        itemImageSrc: house.value.house.image_url_1,
        thumbnailImageSrc: house.value.house.image_url_1,
        alt: 'Image 1',
    },
    {
        itemImageSrc: house.value.house.image_url_2,
        thumbnailImageSrc: house.value.house.image_url_2,
        alt: 'Image 2',
    },
    {
        itemImageSrc: house.value.house.image_url_3,
        thumbnailImageSrc:house.value.house.image_url_3,
        alt: 'Image 3',
    },
    {
        itemImageSrc:  house.value.house.image_url_4,
        thumbnailImageSrc: house.value.house.image_url_4,
        alt: 'Image 4',
    },

  
]);
const start_date = ref(null);
const end_date = ref(null);



const bookings = ref(house.value.house.bookings);



const bookedDates = computed(() => {
    let dates = [];
    bookings?.value.forEach(booking => {
        let currentDate = new Date(booking.start_date);
        const endDate = new Date(booking.end_date);

        while (currentDate <= endDate) {
            dates.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1); 
        }
    });
    return dates;
});

const capitalize =(name)=> {

return name.charAt(0).toUpperCase() + name.slice(1);
};

const getDateString = (dateObj) => {
    const date = new Date(dateObj.year, dateObj.month , dateObj.day +1);
    return date.toISOString().split('T')[0];
};

const disabledDates = computed(() => {
    // Simply return the array of 'YYYY-MM-DD' formatted date strings
    return bookedDates.value.map(dateString => new Date(dateString));
});


const submitBooking = async () => {

    if (!user.value) {
        console.error("User not logged in");
        
        router.push('/login')
    }

    const bookingData = {
        userId: user.value.id,
        houseId: route.params.id,
        start_date: formatDateForServer(start_date.value),
        end_date: formatDateForServer(end_date.value),
    };

    try {
        const response = await axios.post('http://127.0.0.1:8000/api/bookings', bookingData);
        console.log(response.data);
        router.push(`/user-details/${user.value.id}`);
    } catch (error) {
        console.error("Error submitting booking:", error);
    }
}

function formatDateForServer(date) {
  
    if (!(date instanceof Date)) {
        console.error('formatDateForServer expects a Date object');
        return '';
    }

    
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

</script>

<template>
    <div class="w-full flex flex-col max-w-4xl mx-auto mt-10 relative">
        <div class="p-3 md:p-0">               
            <Galleria :value="images" 
            :numVisible="4" :circular="true" containerStyle="width: 100%; margin: auto;" 
            :showItemNavigators="true" :showThumbnails="false">
                <template #item="slotProps" >
                    <img :src="'http://127.0.0.1:8000/storage/' + slotProps.item.itemImageSrc" :alt="slotProps.item.alt" class="object-cover" style="width: 100%; max-width: 640px; height: 500px; display: block; object-fit: cover; border-radius: 10px; " />
                </template>
                <template #thumbnail="slotProps">
                    <img :src="'http://127.0.0.1:8000/storage/' + slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" style="display: block;" class="w-[100px] h-[100px]" />
                </template>
            </Galleria>    
            </div>
            <div></div>
            <div class="flex flex-col w-full gap-2 mt-10 p-3 md:p-0" v-if="house">
                <div class="flex gap-4 items-end ">
                    <h1 class="font-bold text-3xl">{{house?.house?.name }}</h1>
                    <div>
                        <span class="text-lg">
                            {{ house?.house?.location }}
                        </span>
                    </div>
                </div>
                <div>
                     <span class="text-gray-700">{{capitalize(house?.house?.type) }}</span>   
                </div>
                
                <div>
                    <span>
                        {{ house?.house?.description }}
                    </span>
                </div>
                <div class="mt-2">
                    <Nuxt-link class="bg-red-500 p-2 rounded-md" :to="`/user-details/${house?.house?.user.id}`">
                        Hosted by: {{ house?.house?.user.name }} 
                    </Nuxt-link>
                </div>

                <div class="mb-10 flex flex-col md:flex-row gap-4 mt-10">
                    <Calendar v-model="start_date" :disabledDates="disabledDates" showIcon placeholder="check-in"  class="rounded-lg bg-emerald-500 calendar py-3 px-4 border-l-4 border-b-[4px] border-black text-black" >
                        <template #date="slotProps">
                            <template v-if="bookedDates.includes(getDateString(slotProps.date))">
                                <strong style="text-decoration: line-through">{{ slotProps.date.day }}</strong>
                            </template>
                            <template v-else>{{ slotProps.date.day }}</template>
                        </template>
                    </Calendar>
                    <Calendar v-model="end_date" :disabledDates="disabledDates" placeholder="check-out" class="rounded-lg bg-emerald-500 calendar py-3 px-4 border-l-4 border-b-[4px] border-black text-black" showIcon>
                        <template #date="slotProps">
                            <template v-if="bookedDates.includes(getDateString(slotProps.date))">
                                <strong style="text-decoration: line-through">{{ slotProps.date.day }}</strong>
                            </template>
                            <template v-else>{{ slotProps.date.day }}</template>
                        </template>
                    </Calendar>
                    <button @click="submitBooking" class="bg-blue-400 rounded-md py-2 px-4 border-b-4 border-l-4 border-black ">
                        book now
                    </button>
                </div>
            </div>
            <div class="w-full mt-10 mb-10 flex gap-4 flex-col">
                <h1 class="text-xl font-semibold">Location:</h1>
                <GoogleMap
                  api-key="YOUR_GOOGLE_MAPS_API_KEY"
                  :center="{ lat: 37.7749, lng: -122.4194 }"
                  :zoom="12"
                  style="width: 100%; height: 400px;"
                >
                <Marker :options="{ position: center }" />
            </GoogleMap>
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
