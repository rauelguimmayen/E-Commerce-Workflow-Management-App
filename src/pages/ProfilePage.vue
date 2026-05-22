<script setup>
    import { ref, onBeforeMount } from 'vue';
    import { useRouter } from 'vue-router';
    import { useGlobalStore } from '../stores/global.js';
    import UpdateProfile from '../components/UpdateProfile.vue';
    const { user } = useGlobalStore();
    import api from '../api.js';
    const router = useRouter()

    
    const firstName = ref('');
    const lastName = ref('');
    const email = ref('');
    const mobileNum = ref('');

    onBeforeMount(async () => {
        if (!user.email) {
            router.push({ path: '/' });
            return;
        }
        try {
                const response = await api.get('/users/details');
                firstName.value = response.data.firstName;
                lastName.value = response.data.lastName;
                email.value = response.data.email;
                mobileNum.value = response.data.mobileNo;
            } catch (error) {
                console.error('Failed to fetch user details:', error);
            }
        });
              
  
</script>

<template>
    <h1 class="my-5 pt-3 text-primary text-center">Profile Page</h1>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card shadow-sm">
                    <div id="profilecard" class="card-body">
                        <h2 className="mt-3">{{ user.firstName }} {{ user.lastName }}</h2>
                        <hr />
                        <h4>Contacts</h4>
                        <ul>
                            <li>Email: {{user.email}}</li>
                            <li>Mobile No: {{user.mobileNo}}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <UpdateProfile/>
    </div>
</template>
