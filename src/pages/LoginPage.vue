<script setup>
import { watch, ref, onBeforeMount } from 'vue';
import { Notyf } from 'notyf';
import { useRouter } from 'vue-router';
import { useGlobalStore } from '../stores/global';
import api from '../api.js';

const notyf = new Notyf();

const router = useRouter()

const { getUserDetails, user } = useGlobalStore();

const email = ref("");
const password = ref("");
const isEnabled = ref(false);

watch([email, password], (currentValue, oldValue) => {
    if (currentValue.every(input => input !== "")) {
        isEnabled.value = true
    } else {
        isEnabled.value = false
    }
});

async function handleSubmit() {
    try {

        let res = await api.post('/users/login', {
            email: email.value,
            password: password.value
        })

        if (res.data.access) {

            notyf.success("Login Successful");

            localStorage.setItem("token", res.data.access);

            getUserDetails(res.data.access);

            email.value = "";
            password.value = "";
            //console.log(res.data.access)
            router.push({ path: '/' })
        }

    } catch (e) {

        if (e.response?.status === 401) {

            notyf.error(e.response.data.message);

        } else {

            console.error(e);
            notyf.error("Login Failed. Please contact administrator.");
        }
    }
}

onBeforeMount(() => {
    if (user.token) {
        router.push({ path: '/' })
    }
})


</script>

<template>

    <div class="container-fluid">
        <h1 class="my-5 pt-3 text-primary text-center">Login Page</h1>
        <div class="row d-flex justify-content-center">
            <div id="loginpage" class="col-md-5 border border rounded-3 mx-auto p-5">
            <form v-on:submit.prevent="handleSubmit">
                <div class="mb-3">
                    <label for="userEmail" class="form-label">Email address</label>
                    <input type="text" class="form-control" id="userEmail" placeholder="Enter email" v-model="email" />
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" placeholder="Password" v-model="password">
                </div>
                <div class="d-grid mt-5">
                    <button type="submit" class="btn btn-primary btn-block" v-if="isEnabled">Login</button>
                    <button type="submit" class="btn btn-danger btn-block" disabled v-else>Login</button>
                </div>
            </form>
            </div>
         </div>   
    </div>


</template>