<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import ProgressSpinner from 'primevue/progressspinner';
export default {
  data() {
    return {
      loggedInUser: null,
      loadingUser:true,
      chat: null,
      error: null,
      pending: true,
    };
  },
  async created() {
    try {
      const token = Cookies.get('auth_token');
console.log(token)
      if (token) {
        const response = await axios.get("http://127.0.0.1:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
       
        const user = response.data;
        this.loggedInUser = user;
        this.loadingUser = false;
        console.log(this.loggedInUser)

        const chatResponse = await axios.get('http://127.0.0.1:8000/api/chats',{
            headers:{
                Authorization: `Bearer ${token}`,
            },
        });

        this.chat = chatResponse.data;
        console.log(this.chat)
      }
      else{
        this.loggedInUser = null;
        this.loadingUser = false;
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      this.error = error;
    }finally{
        this.pending = false;
    }
  },
  methods:{
    async logout() {
    try {
     
      const token = Cookies.get('auth_token')
      await axios.post('http://127.0.0.1:8000/api/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      
      this.loggedInUser = null;
      Cookies.remove('auth_token')

     
      this.$router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  },
  }
};



</script>

<template>

    <div class="max-w-6xl mx-auto flex flex-col">
        <HomeNavbar>
            <div class="flex justify-between py-2 px-3  items-center">
                 <div >
                  <Nuxt-link to="/" class="flex flex-row gap-2 items-center">
                   <img src="/assets/images/journey.svg" class="w-10 h-10" alt="">
                   <span class="text-xl font-semibold">
                     Booking
                   </span>
                  </Nuxt-link>
                 </div>
                 <div>             
                     <template v-if="loggedInUser && loggedInUser.name">
                       <div class="flex items-center  gap-5 font-semibold">
                         <nuxt-link to="/">Home</nuxt-link>   
                         <nuxt-link to="/">Messages</nuxt-link>   
                         <nuxt-link :to=" '/user-details/' + loggedInUser.id "> {{ loggedInUser.name }}  </nuxt-link> 
                         <div @click="logout" class="cursor-pointer" >
                           Logout
                         </div>           
                       </div>
                     </template>
                     <template v-else-if="loadingUser">
                          <div>
                              <ProgressSpinner class="w-5 h-5" />
                          </div>
                     </template>
                     <template v-else-if="!loadingUser && !loggedInUser">
                         <div class="flex items-center  gap-5 font-semibold">
                           <router-link to="/">Home</router-link>
                           <router-link to="/login">Login</router-link>
                        
                         </div>
                        </template>
                 </div>
 
            </div>
         </HomeNavbar> 
        <div class="w-full mt-5 max-w-3xl mx-auto  p-2 md:p-0 h-[calc(100vh - 20px)] md:h-[600px] flex ">
            <div class="w-full flex flex-row">   
                <div class="w-[30%] flex flex-col  border border-black px-2 py-4 " >
                    <div class="w-full border-b-2 border-l-4 border border-black p-2">
                        <h1 class="font-bold text-md md:text-xl ">Messages</h1>
                    </div>
                    <div class="overflow-y-auto h-full mt-4 ">
                         <div v-for="user in chat" :id="user.id" class="border-t-2 p-2 border-black/15">
                               <Nuxt-link :to="`/chat/${user.id}`"  >
                                    <span class="text-xl">
                                        {{ user.name }}
                                    </span>
                               </Nuxt-link>
                             
                         </div>    
                    </div>
                </div>
                <div class="w-[70%] border border-black flex items-center justify-center">
                    <slot />
                </div>
            </div>
        
        </div>
    </div>

</template>