
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
const route = useRoute()
const token = useCookie('auth_token');

console.log(token.value,"token")

    const {data:house,error,pending,refresh} = await useAsyncData(
        `house-details-${route.params.id}`,
        ()=> axios.get(`http://127.0.0.1:8000/api/houses/${route.params.id}`).then((res)=>res.data)
    )
 
    const { data: user, error: userError, pending: userPending, refresh: userRefresh } = await useAsyncData(
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

    console.log(user.value.id,"user");

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

    const bookingData = {
        userId:user.value.id,
        houseId:route.params.id,
        start_date: formatDateForServer(start_date.value),
        end_date: formatDateForServer(end_date.value),
    };

    try {
        const response = await axios.post('http://127.0.0.1:8000/api/bookings',bookingData);
        console.log(response.data);  
    } catch (error) {
      
        console.error(error);

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
    <div class="w-full flex flex-col max-w-4xl mx-auto mt-5">
        <div class="">               
            <Galleria :value="images"   :numVisible="4" :circular="true" containerStyle="width: 100%; margin: auto;" 
            :showItemNavigators="true" :showThumbnails="false">
                <template #item="slotProps" >
                    <img :src="'http://127.0.0.1:8000/storage/' + slotProps.item.itemImageSrc" :alt="slotProps.item.alt" class="object-cover" style="width: 100%; max-width: 640px; height: 500px; display: block; object-fit: cover; border-radius: 10px;" />
                </template>
                <template #thumbnail="slotProps">
                    <img :src="'http://127.0.0.1:8000/storage/' + slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" style="display: block;" class="w-[100px] h-[100px]" />
                </template>
            </Galleria>    
            </div>
            <div></div>
            <div class="flex flex-col w-full mt-10" v-if="house">

                <h1 class="font-bold text-3xl">{{house?.house?.name }}</h1>
                <div>
                     <span>{{capitalize(house?.house?.type) }}</span>   
                </div>
                <div>
                    <span>
                        {{ house?.house?.location }}
                    </span>
                </div>
                <div>
                    <span>
                        {{ house?.house?.description }}
                    </span>
                </div>
                <div>
                    <span>
                        Hosted by: {{ house?.house?.user.name }} 
                    </span>
                </div>

                <div class="mb-10 flex gap-4 mt-4">
                    <Calendar v-model="start_date" :disabledDates="disabledDates" showIcon placeholder="check-in"  class="rounded-lg bg-emerald-500  py-2 px-2  border-black text-black" >
                        <template #date="slotProps">
                            <template v-if="bookedDates.includes(getDateString(slotProps.date))">
                                <strong style="text-decoration: line-through">{{ slotProps.date.day }}</strong>
                            </template>
                            <template v-else>{{ slotProps.date.day }}</template>
                        </template>
                    </Calendar>
                    <Calendar v-model="end_date" :disabledDates="disabledDates" placeholder="check-out" class="rounded-lg bg-emerald-500  py-2 px-2  border-black text-black" showIcon>
                        <template #date="slotProps">
                            <template v-if="bookedDates.includes(getDateString(slotProps.date))">
                                <strong style="text-decoration: line-through">{{ slotProps.date.day }}</strong>
                            </template>
                            <template v-else>{{ slotProps.date.day }}</template>
                        </template>
                    </Calendar>
                    <button @click="submitBooking" class="bg-blue-400 rounded-md py-2 px-4 ">
                        book now
                    </button>
                </div>
            </div>
            
    </div>
</template>
