<script setup>
definePageMeta({
  layout: 'chat',
})

import { useAsyncData,useRoute,useRouter } from 'nuxt/app';
import axios from 'axios';
import { useCookie } from '#app';
const token = useCookie('auth_token');
const {data:chat,error,pending} = useAsyncData(
    'chat',
    ()=> axios.get("http://127.0.0.1:8000/api/chats",{
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
    }).then((res)=>res.data)
)


</script>

<template>
            <div class="" >
               <span class="text-xl font-semibold">
                    Select a chat
                </span>     
    </div>
</template>