<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createAccount, logIn } from '../services/accountService.js'


const container = ref(null)
const registerButton = ref(null)
const loginButton = ref(null)
const username = ref('')
const password = ref('')
const username1 = ref('')
const email = ref('')
const password1 = ref('')
const password2 = ref('')
const router = useRouter();

const handleLogin = async () => {
    try {
        const res = await logIn({
            username: username.value,
            password: password.value,
        });

        if (res.status === 200) {
            const user_id = res.data.user_id;
            localStorage.setItem('user_id', user_id);
            console.log("User ID lưu vào localStorage:", user_id);
            alert('Đăng nhập thành công.');
            router.push('/home');
            username.value = ""
            password.value = ""

        }
    } catch (err) {
        alert('Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu.');

    }
}

const handSignIn = async () => {
    try {
        if (password1.value !== password2.value) {
            alert('Kiểm tra lại mật khẩu không trùng khớp.');
        } else {
            const res = await createAccount({
                username: username1.value,
                password: password1.value,
                email: email.value,
            })
            if (res.status === 200) {
                alert('Đăng ký tài khoản thành công.');
                container.value?.classList.remove("right-panel-active")
                username1.value = ""
                password1.value = ""
                password2.value = ""
                email.value = ""
            }
        }
    }
    catch (err) {
        alert('Không thể đăng ký tài khoản.')
    }
}

onMounted(() => {
    registerButton.value?.addEventListener("click", () => {
        container.value?.classList.add("right-panel-active")
    })



    loginButton.value?.addEventListener("click", () => {
        container.value?.classList.remove("right-panel-active")
    })


})

</script>
<template>
    <div id="form-login">
        <div class="container" ref="container">
            <div class="form-container register-container">
                <form action="#" @submit.prevent="handSignIn">
                    <h1>Đăng ký</h1>
                    <input type="text" placeholder="Tên đăng nhập" v-model="username1">
                    <input type="email" placeholder="Email" v-model="email">
                    <input type="password" placeholder="Mật khẩu" v-model="password1">
                    <input type="password" placeholder="Nhập lai mật khẩu" v-model="password2">
                    <button>Đăng ký</button>
                </form>
            </div>

            <div class="form-container login-container">
                <form action="#" @submit.prevent="handleLogin">
                    <h1>Đăng nhập</h1>
                    <input type="text" placeholder="Tên đăng nhập" v-model="username">
                    <input type="password" placeholder="Mật khẩu" v-model="password">
                    <button>Login</button>
                    <div class="content">
                        <div class="pass-link">
                            <a href="#">Forgot password?</a>
                        </div>
                    </div>
                </form>
            </div>

            <div class="overlay-container">
                <div class="overlay">
                    <div class="overlay-panel overlay-left">
                        <h1 class="title">Xin chào, <br> bạn</h1>
                        <p>Nếu bạn đã có tài khoản, đăng nhập ở đây nhé!</p>
                        <button class="ghost" ref="loginButton">Login
                        </button>

                    </div>
                    <div class="overlay-panel overlay-right">
                        <h1 class="title">Chào mừng, <br> Tham gia ngay</h1>
                        <p>Nếu bạn chưa có tài khoản, tham gia tại đây.</p>
                        <button class="ghost" ref="registerButton">Register
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
body {
    display: flex;
    background-color: #f6f5f7;
    flex-direction: column;
    font-family: "Poppins", sans-serif;
    overflow: hidden;
    height: 100vh;
}

h1 {
    font-weight: 700;
    letter-spacing: -1.5px;
    margin: 0;
    margin-bottom: 15px;
}

h1.title {
    font-size: 45px;
    line-height: 45px;
    margin: 0;
    text-shadow: 0 0 10px rgba(16, 64, 74, 0.5);
}

p {
    font-size: 14px;
    font-weight: 100;
    line-height: 20px;
    letter-spacing: 0.5px;
    margin: 20px 0 30px;
    text-shadow: 0 0 10px rgba(16, 64, 74, 0.5);
}

span {
    font-size: 14px;
    margin-top: 25px;
}

a {
    color: #333;
    font-size: 14px;
    text-decoration: none;
    margin: 15px 0;
    transition: 0.3s ease-in-out;
}

a:hover {
    color: #4bb6b7;
}

#form-login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 98vh;
}

.content {
    display: flex;
    width: 100%;
    height: 50px;
    align-items: center;
    justify-content: space-around;
}

.content input {
    accent-color: #333;
    width: 12px;
    height: 12px;
}

.content label {
    font-size: 14px;
    user-select: none;
    padding-left: 5px;
}

button {
    position: relative;
    border-radius: 20px;
    border: 1px solid #4bb6b7;
    background-color: #4bb6b7;
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    margin: 10px;
    padding: 12px 80px;
    letter-spacing: 1px;
    text-transform: capitalize;
    transition: 0.3s ease-in-out;
}

button:hover {
    letter-spacing: 3px;
}

button:active {
    transform: scale(0.95);
}

button:focus {
    outline: none;
}

button.ghost {
    background-color: rgba(225, 225, 225, 0.2);
    border: 2px solid #fff;
    color: #fff;
}

button.ghost i {
    position: absolute;
    opacity: 0;
    transition: 0.3s ease-in-out;
}

button.ghost i.register {
    right: 70px;
}

button.ghost i.login {
    left: 70px;
}

button.ghost:hover i.register {
    right: 40px;
    opacity: 1;
}

button.ghost:hover i.login {
    left: 40px;
    opacity: 1;
}

form {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 50px;
    height: 100%;
    text-align: center;
}

input {
    background-color: #eee;
    border-radius: 10px;
    border: none;
    padding: 12px 15px;
    margin: 8px 0;
    width: 100%;
}

.container {
    background-color: #fff;
    border-radius: 25px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    position: relative;
    overflow: hidden;
    width: 800px;
    max-width: 100%;
    min-height: 500px;
}

.form-container {
    position: absolute;
    top: 0;
    height: 100%;
    transition: all 0.6s ease-in-out;
}

.login-container {
    left: 0;
    width: 50%;
    z-index: 2;
}

.container.right-panel-active .login-container {
    transform: translateX(100%);
}

.register-container {
    left: 0;
    width: 50%;
    opacity: 0;
    z-index: 1;
}

.container.right-panel-active .register-container {
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
    animation: show 0.6s;
}

@keyframes show {

    0%,
    49.99% {
        opacity: 0;
        z-index: 1;
    }

    50%,
    100% {
        opacity: 1;
        z-index: 5;
    }
}

.overlay-container {
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: transform 0.6s ease-in-out;
    z-index: 100;
}

.container.right-panel-active .overlay-container {
    transform: translate(-100%);
}

.overlay {
    background-image: url('../assets/image.gif');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 0 0;
    color: #fff;
    position: relative;
    left: -100%;
    height: 100%;
    width: 200%;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
}

.overlay::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: linear-gradient(to top,
            rgba(46, 94, 109, 0.4) 40%,
            rgba(46, 94, 109, 0));
}

.container.right-panel-active .overlay {
    transform: translateX(50%);
}

.overlay-panel {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 5px;
    text-align: center;
    top: 0;
    height: 100%;
    width: 50%;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
}

.overlay-left {
    transform: translateX(-20%);
}

.container.right-panel-active .overlay-left {
    transform: translateX(0);
}

.overlay-right {
    right: 0;
    transform: translateX(0);
}

.container.right-panel-active .overlay-right {
    transform: translateX(20%);
}


.social-container a:hover {
    border: 1px solid #4bb6b7;
}
</style>