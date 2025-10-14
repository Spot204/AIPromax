<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const container = ref(null);
const Phantich = ref(null);
const Lichsu = ref(null);
const activeTab = ref('Phân tích');
const activeBody = ref('link');
const router = useRouter();

function logOut(){
    localStorage.removeItem('token');

    router.push('/login');
}

onMounted(() => {
    const tabs = container.value.querySelectorAll('.tap-item');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('atcive'));
            tab.classList.add('atcive');
            if (tab.textContent === 'Phân tích') {
                Phantich.value.style.display = 'block';
                Lichsu.value.style.display = 'none';
            } else {
                Phantich.value.style.display = 'none';
                Lichsu.value.style.display = 'block';
            }
        });
    });
});

const setActiveBody = (body) => {
    activeBody.value = body;
}

</script>
<template>
    <div class="container" ref="container">
        <div class="head">
            <div>logo</div>
            <div class="exit" @click="logOut">Đăng xuất</div>
        </div>
        <div class="body-container">
            <div class="body-menu">
                <button
                    :class="{ active: activeBody === 'link' }"
                    @click="setActiveBody('link')"
                >
                    Kiểm tra Link độc hại
                </button>
                <button
                    :class="{ active: activeBody === 'phone' }"
                    @click="setActiveBody('phone')"
                >
                    Kiểm tra số điện thoại
                </button>
            </div>
            <div class="body-content">
                <div v-show="activeBody === 'link'" class="check-content">
                    <div class="check">
                        <h2>Kiểm tra link độc hại</h2>
                        <h3>Bạn nhập đường link nghi ngờ vào phần bên dưới </h3>
                        <div class="check-item"><input type="text" placeholder="Nhập link cần kiểm tra">
                            <button>Kiểm tra</button>
                        </div>
                    </div>
                    <div class="list" style="height: 300px; margin-top: 20px;">
                        <div class="tap">
                            <div class="tap-item" :class="{ active: activeTab === 'Phân tích' }"
                                @click="activeTab = 'Phân tích'">Phân tích</div>
                            <div class="tap-item" :class="{ active: activeTab === 'Lịch sử kiểm tra' }"
                                @click="activeTab = 'Lịch sử kiểm tra'">Lịch sử kiểm tra</div>
                        </div>
                        <div class="result" v-show="activeTab === 'Phân tích'" id="Phantich"></div>
                        <div class="result" v-show="activeTab === 'Lịch sử kiểm tra'" id="Lichsu">
                            <button >Xuất file PDF</button>
                        </div>
                    </div>
                </div>
                <div v-show="activeBody === 'phone'" class="check-content">
                    <div class="check">
                        <h2>Kiểm tra số điện thoại độc hại</h2>
                        <h3>Bạn nhập số điện thoại nghi ngờ vào phần bên dưới </h3>
                        <div class="check-item"><input type="text" placeholder="Nhập số điện thoại cần kiểm tra">
                            <button>Kiểm tra</button>
                        </div>
                    </div>
                    <div class="list" style=" margin-top: 20px;">
                        <div class="result" style="height: 600px;">
                            <button>Xuất file PDF</button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style  scoped>
* {
    font-family: 'Poppins', sans-serif;
}

.list {
    width: 98.5%;
    height: 400px;
    border-radius: 10px;
    display: relative;

    .tap {
        display: flex;

        .tap-item {
            width: 120px;
            height: 40px;
            padding: 0 10px;
            display: flex;
            justify-content: center;
            color: #fff;
            align-items: center;
            border-radius: 10px 10px 0 0;
            cursor: pointer;
        }

        .active {
            background-color: white;
            color: #4bb6b7;

        }

        .tap-item:hover {
            background-color: #fff;
            color: #4bb6b7;
            transition: 0.3s ease-in-out;
        }
    }

    .result {
        width: 100%;
        height: 560px;
        background-color: #fff;
        border-radius: 0 0 10px 10px;
    }

}


.body-content {
    width: 78%;
    height: 92vh;
    display: flex;
    flex-direction: column;
    background-color: #4bb6b7;
    padding: 0 0 0 20px;

}

.check-content {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.check {
    width: 96%;
    height: 200px;
    background-color: #fff;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    padding: 20px;
}

.head {
    width: 97%;
    height: 60px;
    background-color: #4bb6b7;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    font-size: 20px;
}

.exit {
    border: 1px solid white;
    border-radius: 10px;
    padding: 5px 15px;
    cursor: pointer;
}

.exit:hover {
    background-color: white;
    color: #4bb6b7;
    transition: 0.3s ease-in-out;
}

.body-container {
    display: flex;
    width: 100%;

}

.body-menu {
    width: 20%;
    height: 80vh;
    flex-direction: column;
    font-size: 24px;
    padding: 20px 0 0 20px;

    p {
        width: fit-content;
        margin: 20px 0;
        cursor: pointer;
    }

    p:hover {
        color: #4bb6b7;
        transition: 0.3s ease-in-out;
    }
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
    padding: 12px 30px;
    letter-spacing: 1px;
    text-transform: capitalize;
    transition: 0.3s ease-in-out;
    cursor: pointer;
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

button.active {
    background-color: #fff;
    color: #4bb6b7;
    border: 2px solid #4bb6b7;
}

input {
    width: 500px;
    background-color: #eee;
    border-radius: 10px;
    border: none;
    padding: 12px 15px;
    margin: 8px 0;
}
</style>