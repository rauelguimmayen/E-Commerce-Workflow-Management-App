import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css'
import LoginPage from './pages/LoginPage.vue';
import HomePage from './pages/HomePage.vue';
import ProductsCatalogue from './pages/ProductsCatalogue.vue';
import Logout from './pages/Logout.vue';
import RegisterPage from './pages/RegisterPage.vue';
import Product from './pages/Product.vue';
import ProductDetails from './pages/ProductDetails.vue';
import 'notyf/notyf.min.css';
import CartViewPage from './pages/CartViewPage.vue';
import AddProduct from './pages/AddProduct.vue';
import OrdersPage from './pages/OrdersPage.vue';
import MyOrder from './pages/MyOrder.vue';
import ProfilePage from './pages/ProfilePage.vue';
import ResetPassword from './pages/ResetPassword.vue';

const router = createRouter({
        history: createWebHistory(),
        routes: [
                {
                        path: '/',
                        name: 'Home',
                        component: HomePage
                },
                {
                        path: '/login',
                        name: 'Login',
                        component: LoginPage
                },
                {
                        path: '/profile',
                        name: 'ProfilePage',
                        component: ProfilePage
                },
                {
                        path: '/resetPassword',
                        name: 'ResetPassword',
                        component: ResetPassword
                },
                {
                        path: '/products',
                        name: 'Products',
                        component: Product
                },
                {
                        path: '/products/:id',
                        name: 'ProductDetails',
                        component: ProductDetails
                },
                {
                        path: '/addProduct',
                        name: 'AddProduct',
                        component: AddProduct
                },
                {
                        path: '/orders',
                        name: 'OrdersPage',
                        component: OrdersPage
                },
                {
                        path: '/myOrder',
                        name: 'MyOrder',
                        component: MyOrder
                },
                {
                        path: '/logout',
                        name: 'Logout',
                        component: Logout
                },
                {
                        path: '/register',
                        name: 'Register',
                        component: RegisterPage
                },
                {
                        path: '/cart',
                        name: 'Cart',
                        component: CartViewPage
                }
                // {
                //         path: "/:catchAll(.*)",
                //         component: ErrorPage,
                // }

        ]
})

createApp(App).use(createPinia()).use(router).mount('#app')