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
        // If login is successful, you can save the token in a cookie or localStorage
        // for future API requests or route guards.
        const token = response.data.token;
        Cookies.set('auth_token', token);
        // You can use a library like 'js-cookie' to save the token in a cookie.
        // Example:
        // import Cookies from 'js-cookie';
        // Cookies.set('auth_token', token);
        
        // Redirect to the home page or any other desired page upon successful login.
        this.$router.push("/");
      } catch (error) {
        // Handle login errors (e.g., show an error message)
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