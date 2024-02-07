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
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  },
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
                        <router-link to="/">Home</router-link>   
                        {{ loggedInUser.name }}  
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
        <slot />
   </div>
  </template>