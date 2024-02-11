<script>
import axios from 'axios';
import Cookies from 'js-cookie';

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
           <div class="flex justify-between py-2 px-5">
                <div>
                  LOGO
                </div>
                <div>
                    <!-- Display user name if logged in -->
                    <template v-if="loggedInUser && loggedInUser.name">
                      <div class="flex items-center  gap-5 font-semibold">
                        <nuxt-link to="/">Home</nuxt-link>   
                        <nuxt-link :to=" '/user-details/' + loggedInUser.id "> {{ loggedInUser.name }}  </nuxt-link> 
                        <div @click="logout" >
                          Logout
                        </div>           
                      </div>
                    </template>
                    <template v-else-if="loadingUser">
                         <div>
                              loading
                         </div>
                    </template>
                    <template v-else-if="!loadingUser">
                        <div class="flex items-center  gap-5 font-semibold">
                          <router-link to="/">Home</router-link>
                          <router-link to="/login">Login</router-link>
                       
                        </div>
                       </template>
                </div>

           </div>
        </HomeNavbar> 
        <div>
            <Header />
        </div>

        <slot />
   </div>
  </template>