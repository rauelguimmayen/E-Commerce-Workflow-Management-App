<template>
	
	<div class="container mt-5">
		<div class="row justify-content-center">
			<div class="col-md-6">
				<div class="card shadow-sm">
					<div id="updateprofile" class="card-body">
						<h3 class="card-title mb-4">Update Profile</h3>
						<form @submit.prevent="handleUpdateProfile">
							<div class="mb-3">
								<label for="firstName" class="form-label">First Name</label>
								<input type="text" id="firstName" v-model="firstName" class="form-control" required/>
								<label for="lastName" class="form-label">Last Name</label>
								<input type="text" id="lastName" v-model="lastName" class="form-control" required/>
								<label for="mobileNum" class="form-label">Mobile Number</label>
								<input type="tel" id="mobileNum" v-model="mobileNum" class="form-control" required/>
							</div>
							<button type="submit" class=
							"btn btn-primary w-100" :disabled="isLoading">{{ isLoading ? "Updating Profile..." : "Update Profile"}}</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>

</template>


<script setup>
	import { ref } from 'vue';
	import { Notyf } from 'notyf';
	import { useGlobalStore } from '../stores/global.js';
	import api from '../api.js';

	const notyf = new Notyf();

	const firstName = ref("");
	const lastName = ref("");
	const mobileNum = ref("");
	const isLoading = ref(false);

	const handleUpdateProfile = async() => {

		try {
			isLoading.value = true;

			const { user } = useGlobalStore();

			if(!user.token) {
				notyf.error("You are not authorized");
				isLoading.value = false;
				return;
			}

			let res = await api.put("/users/profile", {
				firstName: firstName.value,
				lastName: lastName.value,
				mobileNum: mobileNum.value
			});

			console.log(res)

			notyf.success("Profile updated successfully");
			firstName.value = "";
			lastName.value = "";
			mobileNum.value = "";
			setTimeout(() => {
            window.location.reload();
        }, 1000);
		} catch(e) {
			console.log(e);
			/*
			const msg = ((e.reponse && e.response.data && e.response.data.message) || "Password reset failed")
			*/
			const msg = e.response?.data?.message || "Profile update failed";
			notyf.error(msg);
		} finally {
			isLoading.value = false;
		}
	}
</script>