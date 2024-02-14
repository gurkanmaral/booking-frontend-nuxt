<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import ProgressSpinner from 'primevue/progressspinner';
export default {
  data() {
    return {
      loggedInUser: null,
      loadingUser:true,
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
      }
      else{
        this.loggedInUser = null;
        this.loadingUser = false;
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
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
           <div class="flex justify-between py-2 px-5  items-center">
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
                        <nuxt-link to="/chat" class="hidden md:block">Messages</nuxt-link>   
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
        <div class="p-3 md:p-0">
            <Header />
        </div>

        <slot />
   </div>
  </template>