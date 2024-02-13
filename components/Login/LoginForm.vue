

<script>


import ProgressSpinner from 'primevue/progressspinner';
import axios from 'axios'; 
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
      isLoading:false,
    };
  },
  methods: {
    async login() {
      try {   
        this.isLoading=true;
        const response = await axios.post("http://127.0.0.1:8000/api/login", {
          email: this.email,
          password: this.password,
        });
      
        const token = response.data.token;
        Cookies.set('auth_token', token);
        
        this.$router.push("/");
      } catch (error) {
        console.log(error)
        if (error.response && error.response.data && error.response.data.errors) {
     
      const errors = error.response.data.errors;
      const firstErrorKey = Object.keys(errors)[0];
      this.errorMessage = errors[firstErrorKey][0]; 
    } else if (error.response && error.response.data && error.response.data.message) {
      
      this.errorMessage = error.response.data.message;
    }    
      }finally{
        this.isLoading = false;
      }
    },
  },
};
</script>

<template>
    <div class="flex  w-[70%] md:w-[500px]  flex-col p-2 shadow shadow-black bg-white rounded-[2px]">
        <div class="w-full flex items-center justify-center gap-2">
            <h1 class="text-3xl font-semibold">Welcome</h1>
            <img src="/assets/images/journey.svg" class="w-10 h-10" />
        </div>  
        <form  @submit.prevent="login" class="flex-col flex gap-5 p-2">
            <div class="w-full flex flex-col gap-2">
              <label class="font-bold text-xl" for="email">
                Email
              </label>
              <input v-model="email" id="email"  type="email" placeholder="email" class="rounded-md p-2  border border-black/15 text-black  " />
            </div>
             <div class="w-full flex flex-col gap-2">
              <label class="font-bold text-xl" for="password">
                Password
              </label>
              <input v-model="password" id="password" type="password" placeholder="password" class="rounded-md p-2 border border-black/15 "/>
             </div>
             
              <button type="submit" class="bg-black rounded-md p-2 text-white" :disabled="isLoading">
                <span v-if="!isLoading">Login</span>
                <div v-if="isLoading" class="w-full">
                    <ProgressSpinner class="w-5 h-5 " />
                </div>
              </button>
          </form>
          <div class="w-full flex justify-end p-1">
            <Nuxt-link to="/register">
                <span>
                    Don't you have an account?
                </span>
                <span class="text-green-500">
                    Register
                </span>
            </Nuxt-link>
          </div>
          <div v-if="errorMessage">
                <span class="text-red-500 text-xl">
                    {{ errorMessage}}
                </span>
          </div>
      </div>
</template>