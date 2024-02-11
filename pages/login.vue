<script>
import axios from 'axios'; 
import Cookies from 'js-cookie';
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {   
        const response = await axios.post("http://127.0.0.1:8000/api/login", {
          email: this.email,
          password: this.password,
        });
      
        const token = response.data.token;
        Cookies.set('auth_token', token);
       
        this.$router.push("/");
      } catch (error) {
       
        console.error("Login failed:", error);
      }
    },
  },
};
</script>

<template>
    <div>
        <form  @submit.prevent="login">
            <input v-model="email"  type="email" placeholder="email" />
            <input v-model="password" type="password" placeholder="password"/>
           
            <button type="submit">
                login
            </button>
        </form>
    </div>

</template>