import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css'
import LoginPage from './pages/LoginPage.vue';
import TwoFactorSetup from './pages/TwoFactorSetup.vue';
import TwoFactorVerify from './pages/TwoFactorVerify.vue';
import HomePage from './pages/HomePage.vue';
import Logout from './pages/Logout.vue';
import RegisterPage from './pages/RegisterPage.vue';
import Product from './pages/Product.vue';
import ProductDetails from './pages/ProductDetails.vue';
import 'notyf/notyf.min.css';
import CartViewPage from './pages/CartViewPage.vue';
import AddProduct from './pages/AddProduct.vue';
import ProductUpdate from './pages/ProductUpdate.vue';
import OrdersPage from './pages/OrdersPage.vue';
import MyOrder from './pages/MyOrder.vue';
import ProfilePage from './pages/ProfilePage.vue';
import ResetPassword from './pages/ResetPassword.vue';
import { useAuthStore } from './stores/auth';


const modalRoutes = ['LoginPage', 'RegisterPage', 'ResetPassword', 'AddProduct', 'ProductDetails', 'ProductUpdate']
const router = createRouter({
        history: createWebHistory(),
        routes: [
                {
                        path: '/',
                        name: 'Home',
                        components: { default: HomePage }
                },
                {
                        path: '/login',
                        name: 'Login',
                        components: { modal: LoginPage }                          
                },
                {
                        path: '/2fa-setup',
                        name: 'TwoFactorSetup',
                        component: TwoFactorSetup
                        //meta: { requiresAuth: true }                          
                },
                {
                        path: '/verify-2fa',
                        name: 'TwoFactorVerify',
                        component: TwoFactorVerify,
                        meta: { requires2FAPending: true }                          
                },
                {
                        path: '/profile',
                        name: 'ProfilePage',
                        component: ProfilePage,
                        //meta: { requiresAuth: true }
                },
                {
                        path: '/resetPassword',
                        name: 'ResetPassword',
                        components: { modal: ResetPassword }
                },
                {
                        path: '/products',
                        name: 'Products',
                        component: Product
                },
                {
                        path: '/products/:id',
                        name: 'ProductDetails',
                        components: { modal: ProductDetails }
                },
                {
                        path: '/addProduct',
                        name: 'AddProduct',
                        components: { modal: AddProduct }
                },
                {
                        path: '/products/:id/update',
                        name: 'ProductUpdate',
                        components: { modal: ProductUpdate }
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
                        components: { modal: RegisterPage }
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
router.beforeEach((to, from) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && auth.status !== 'authenticated') {
    return '/login'
  }
  if (to.meta.requires2FAPending && auth.status !== 'pending-2fa') {
    return '/login'   // blocks direct navigation to /verify-2fa unless status is pending-2fa
  }
  if (to.path === '/login' && auth.status === 'authenticated') {
    return { name: 'ProfilePage' }
  }
})
const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');