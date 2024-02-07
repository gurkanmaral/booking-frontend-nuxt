<template>
    <div>
        <form @submit.prevent="submitForm" class="pt-2 border border-black mx-auto w-full flex flex-col gap-4">
         
            <div>
              <label for="type">Type:</label>
              <select v-model="formData.type" id="type" required>
                <option value="villa">Villa</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="bungalow">	Bungalow</option>
                <option value="others">Others</option>
            </select>
            </div>
            <div>
                <label for="name">Name:</label>
                <input v-model="formData.name" type="text" id="name" required>
              </div>
              <div>
                <label for="description">Description:</label>
                <input v-model="formData.description" type="text" id="description" required>
              </div>
              <div>
                <label for="price">price:</label>
                <input v-model="formData.price" type="number" id="price" required>
              </div>
              <div>
                <label for="location">location:</label>
                <input v-model="formData.location" type="text" id="location" required>
              </div>
        
            <div>
              <label for="image_url_1">Image 1:</label>
              <input type="file" accept="image/*" name="image_url_1" @change="handleFileUpload($event, 'image_url_1')" required>
            </div>
            <div>
                <label for="image_url_2">Image 2:</label>
                <input type="file" accept="image/*" name="image_url_2" @change="handleFileUpload($event, 'image_url_2')" required>
              </div>
              <div>
                <label for="image_url_3">Image 3:</label>
                <input type="file" accept="image/*" name="image_url_3" @change="handleFileUpload($event, 'image_url_3')" required>
              </div>
              <div>
                <label for="image_url_4">Image 4:</label>
                <input type="file" accept="image/*" name="image_url_4" @change="handleFileUpload($event, 'image_url_4')" required>
              </div>
        
            <button type="submit">Create House</button>
          </form>
    </div>

</template>
<script>
import axios from 'axios';
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      formData: {
        userId: null, 
        type: '',
        name:'',
        description:'',
        price: 0,
        location:'',
        image_url_1: null,
        image_url_2: null,
        image_url_3: null,
        image_url_4: null,
      },
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
        this.formData.userId = user.id; 
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  },
  methods: { 
    submitForm() {
        const formData = new FormData();
    formData.append('userId', this.formData.userId);
    formData.append('type', this.formData.type);
    formData.append('name', this.formData.name);
    formData.append('description', this.formData.description);
    formData.append('price', this.formData.price);
    formData.append('location', this.formData.location);
    formData.append('image_url_1', this.formData.image_url_1);
    formData.append('image_url_2', this.formData.image_url_2);
    formData.append('image_url_3', this.formData.image_url_3);
    formData.append('image_url_4', this.formData.image_url_4);
    
    axios.post('http://127.0.0.1:8000/api/houses', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((response) => {
            console.log(response.data);

                // Check the response status and show a message to the user
                if (response.status === 201) {
                    alert('House created successfully');
                } else {
                    alert('Failed to create house');
                }
            
           
        })
        .catch((error) => {
            console.error(error.response.data);
            alert('An error occurred while creating the house');
        });
    },
    handleFileUpload(event, fieldName) {
        this.formData[fieldName] = event.target.files[0];
    },

  },
};
</script>