<script setup>

definePageMeta({
  layout: 'chat',
})



import { useAsyncData,useRoute,useRouter } from 'nuxt/app';
import axios from 'axios';
import { useCookie } from '#app';
const token = useCookie('auth_token');

const route = useRoute()
const {data:chat,error,pending,refresh} = useAsyncData(
    `chat-${route.params.id}`,
    ()=> axios.get(`http://127.0.0.1:8000/api/chats/${route.params.id}`,{
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
    }).then((res)=>res.data)
)

const message = ref('');


const submitForm = async () => {
    if (message.value.trim() === '') {
        return; 
    }

    try {

        const response = await axios.post('http://127.0.0.1:8000/api/chats',{
            receiver_id: route.params.id,
            message:message.value,
        }, {
            headers:{
                Authorization: `Bearer ${token.value}`,
            }
        });
       if(response) {
        await refresh()
       }
        message.value = ''; 
    } catch (error) {
        console.log(error)
    }

}
const { data: user, error: oneUserError, pending: oneUserPending, refresh: oneUserRefresh } = await useAsyncData(
  `one-user-${route.params.id}`,
  async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/user/${route.params.id}`, {
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

const name = user?._rawValue[0]?.name

</script>

<template>
    <div class="w-full h-full flex flex-col">
        <div class="sticky top-0 bg-black text-white p-2">
            {{ name }} 
        </div>   
        <div class="h-full overflow-x-auto">
                  <div v-for="chatMessage in chat" :id="chatMessage.id" class="px-2 py-2 w-full flex "
                  :class="{ 'justify-end':  chatMessage.sender_id === currentUser?.id }"
                  >
                       <div class="border border-black max-w-[150px] rounded-md  flex py-2 px-3 justify-start  "
                       >
                        {{ chatMessage.message }}
                        {{ currentUser?.value?.id }}
                       </div>
                       
                  </div>
            </div>
            <div class="w-full">
                <form @submit.prevent="submitForm" class="w-full flex " >
                    <input type="text" v-model="message" class="w-full p-2 border border-black ring-0 outline-none ">
                    <button class="p-2 bg-emerald-500 ">send</button>
                </form>
            </div>
    </div>
</template>