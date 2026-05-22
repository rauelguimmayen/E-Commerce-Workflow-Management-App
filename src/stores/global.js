import { defineStore } from 'pinia';
import { reactive, computed } from 'vue';
import api from '../api';

export const useGlobalStore = defineStore('global', () => {

        let user = reactive({
          token: localStorage.getItem('token'),
          email: "",
          firstName: "",
          lastName: "",
          mobileNo: "",
          isAdmin: false // ← use boolean instead of ""
        })


        async function getUserDetails(token) {

                if (!token) {
                        user.token = "";
                        user.email = "";
                        user.mobileNo = "";
                        user.firstName = "";
                        user.lastName = "";
                        user.isAdmin = false;

                        return;
                }

                let { data } = await api.get('/users/details');
                
                user.token = token;
                user.email = data.user.email;
                user.mobileNo = data.user.mobileNo;
                user.firstName = data.user.firstName;
                user.lastName = data.user.lastName;
                user.isAdmin = data.user.isAdmin;
        }


        let userCart = reactive({
                items: [],
                totalAmount: 0,
        });
        const cartItemCount = computed(() => userCart.items?.length ?? 0)
        async function getUserCart() {
                try {
                        const res = await api.get('/cart/get-cart');
                        /*console.log('Cart API Response:', res.data);*/
                        
                        if (res.data.cart) {
                                userCart.items = res.data.cart.cartItems;
                                userCart.totalAmount = res.data.cart.totalPrice;
                        } else {
                                userCart.items = [];
                                userCart.totalAmount = 0;
                        }
                } catch (error) {
                        console.log(error);
                }
        }




        if (user.token) {
                getUserDetails(user.token);
        }
        return {
                user,
                getUserDetails,
                userCart,
                getUserCart,
                cartItemCount
        }


})
state: () => ({
  showResetModal: false, 

})


