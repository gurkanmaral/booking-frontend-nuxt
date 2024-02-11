<script>
import axios from 'axios'; 
import Cookies from "js-cookie";

export default {
    data() {
        return {
            email: "",
            name: "",
            password : "",
        }
    },
    methods:{
        async register(){

           try {
            await axios.post("http://127.0.0.1:8000/api/register", {
                name: this.name,
                email:this.email,
                password:this.password,
            })

            this.$router.push("/login");
           } catch (error) {
            console.error("Register failed:", error);
           }
        }
    }
}
</script>

<template>
    <div>
        <form @submit.prevent="register">
            <input type="text" v-model="name" placeholder="name"/>
            <input type="email" v-model="email" placeholder="email" />
            <input type="password" v-model="password" placeholder="password"/>

            <button type="submit">
                    Register
            </button>
            
        </form>
    </div>
</template>