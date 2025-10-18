<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const container = ref(null);
const activeTab = ref('analys');
const activeBody = ref('link');
const router = useRouter();

// Dữ liệu mẫu cho lịch sử kiểm tra
const historyList = ref([
    {
        id: 1,
        type: 'link',
        input: 'https://example.com',
        status: 'An toàn',
        checkedAt: '2025-10-15 10:35',
        notes: 'Không phát hiện mối nguy'
    },
    {
        id: 2,
        type: 'phone',
        input: '0912345678',
        status: 'Nghi ngờ',
        checkedAt: '2025-10-15 09:20',
        notes: 'Nhiều phản ánh spam'
    },
    {
        id: 3,
        type: 'link',
        input: 'http://malicious.test/phishing',
        status: 'Nguy hiểm',
        checkedAt: '2025-10-14 18:02',
        notes: 'Phát hiện hành vi lừa đảo'
    },
    {
        id: 4,
        type: 'phone',
        input: '0987654321',
        status: 'An toàn',
        checkedAt: '2025-10-14 16:47',
        notes: 'Không có khiếu nại'
    },
    {
        id: 1,
        type: 'link',
        input: 'https://example.com',
        status: 'An toàn',
        checkedAt: '2025-10-15 10:35',
        notes: 'Không phát hiện mối nguy'
    },
    {
        id: 2,
        type: 'phone',
        input: '0912345678',
        status: 'Nghi ngờ',
        checkedAt: '2025-10-15 09:20',
        notes: 'Nhiều phản ánh spam'
    },
    {
        id: 3,
        type: 'link',
        input: 'http://malicious.test/phishing',
        status: 'Nguy hiểm',
        checkedAt: '2025-10-14 18:02',
        notes: 'Phát hiện hành vi lừa đảo'
    },
    {
        id: 4,
        type: 'phone',
        input: '0987654321',
        status: 'An toàn',
        checkedAt: '2025-10-14 16:47',
        notes: 'Không có khiếu nại'
    },
    {
        id: 1,
        type: 'link',
        input: 'https://example.com',
        status: 'An toàn',
        checkedAt: '2025-10-15 10:35',
        notes: 'Không phát hiện mối nguy'
    },
    {
        id: 2,
        type: 'phone',
        input: '0912345678',
        status: 'Nghi ngờ',
        checkedAt: '2025-10-15 09:20',
        notes: 'Nhiều phản ánh spam'
    },
    {
        id: 3,
        type: 'link',
        input: 'http://malicious.test/phishing',
        status: 'Nguy hiểm',
        checkedAt: '2025-10-14 18:02',
        notes: 'Phát hiện hành vi lừa đảo'
    },
    {
        id: 4,
        type: 'phone',
        input: '0987654321',
        status: 'An toàn',
        checkedAt: '2025-10-14 16:47',
        notes: 'Không có khiếu nại'
    }
]);

function logOut() {
    localStorage.removeItem('token');
    router.push('/login');
}

onMounted(() => {
    const tabs = container.value.querySelectorAll('.tap-item');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            if (tab.textContent === 'Phân tích') {
                if (Phantich.value) Phantich.value.style.display = 'block';
                if (Lichsu.value) Lichsu.value.style.display = 'none';
            } else {
                if (Phantich.value) Phantich.value.style.display = 'none';
                if (Lichsu.value) Lichsu.value.style.display = 'block';
            }
        });
    });
});

const setActiveBody = (body) => {
    activeBody.value = body;
};
const setActiveTab = (tab) => {
    activeTab.value = tab;
    console.log(activeTab.value);
};
</script>

<template>
    <div class="container" ref="container">
        <div class="head">
            <div>logo</div>
            <div class="exit" @click="logOut">Đăng xuất</div>
        </div>
        <div class="body-container">
            <div class="body-menu">
                <button :class="{ active: activeBody === 'link' }" @click="setActiveBody('link')">
                    Kiểm tra Link độc hại
                </button>
                <button :class="{ active: activeBody === 'phone' }" @click="setActiveBody('phone')">
                    Kiểm tra số điện thoại
                </button>
            </div>
            <div class="body-content">
                <div v-show="activeBody === 'link'" class="check-content">
                    <div class="check">
                        <h2>Kiểm tra link độc hại</h2>
                        <h3>Bạn nhập đường link nghi ngờ vào phần bên dưới </h3>
                        <div class="check-item">
                            <input type="text" placeholder="Nhập link cần kiểm tra" />
                            <button>Kiểm tra</button>
                        </div>
                    </div>
                    <div class="list" style="height: 300px; margin-top: 20px;">
                        <div class="tap">
                            <div class="tap-item" :class="{ active: activeTab === 'analys' }"
                                @click="setActiveTab('analys')">
                                Phân tích
                            </div>
                            <div class="tap-item" :class="{ active: activeTab === 'history' }"
                                @click="setActiveTab('history')">
                                Lịch sử kiểm tra
                            </div>
                        </div>
                        <div class="result" v-show="activeTab === 'analys'" id="Phantich">
                            sd
                        </div>
                        <div class="result" v-show="activeTab === 'history'" id="Lichsu">
                            <div class="history-header">
                                <div class="history-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Loại</th>
                                                <th>Đầu vào</th>
                                                <th>Trạng thái</th>
                                                <th>Thời gian</th>
                                                <th>Ghi chú</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item, idx) in historyList" :key="item.id">
                                                <td>{{ idx + 1 }}</td>
                                                <td>
                                                    <span
                                                        :class="['badge', item.type === 'link' ? 'badge-link' : 'badge-phone']">
                                                        {{ item.type === 'link' ? 'Link' : 'Số điện thoại' }}
                                                    </span>
                                                </td>
                                                <td class="mono">{{ item.input }}</td>
                                                <td>
                                                    <span :class="[
                                                        'status',
                                                        item.status === 'An toàn' ? 'safe' : item.status === 'Nghi ngờ' ? 'warn' : 'danger'
                                                    ]">
                                                        {{ item.status }}
                                                    </span>
                                                </td>
                                                <td class="mono">{{ item.checkedAt }}</td>
                                                <td class="notes">{{ item.notes }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <button>Xuất file PDF</button>
                        </div>
                    </div>
                </div>
                <div v-show="activeBody === 'phone'" class="check-content">
                    <div class="check">
                        <h2>Kiểm tra số điện thoại độc hại</h2>
                        <h3>Bạn nhập số điện thoại nghi ngờ vào phần bên dưới </h3>
                        <div class="check-item">
                            <input type="text" placeholder="Nhập số điện thoại cần kiểm tra" />
                            <button>Kiểm tra</button>
                        </div>
                    </div>
                    <div class="list" style=" margin-top: 20px;">
                        <div class="result" style="height: 600px;">
                            <div class="history-header">
                                <div class="history-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Loại</th>
                                                <th>Đầu vào</th>
                                                <th>Trạng thái</th>
                                                <th>Điểm</th>
                                                <th>Thời gian</th>
                                                <th>Ghi chú</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item, idx) in historyList" :key="item.id">
                                                <td>{{ idx + 1 }}</td>
                                                <td>
                                                    <span
                                                        :class="['badge', item.type === 'link' ? 'badge-link' : 'badge-phone']">
                                                        {{ item.type === 'link' ? 'Link' : 'Số điện thoại' }}
                                                    </span>
                                                </td>
                                                <td class="mono">{{ item.input }}</td>
                                                <td>
                                                    <span :class="[
                                                        'status',
                                                        item.status === 'An toàn' ? 'safe' : item.status === 'Nghi ngờ' ? 'warn' : 'danger'
                                                    ]">
                                                        {{ item.status }}
                                                    </span>
                                                </td>
                                                <td class="mono">{{ item.checkedAt }}</td>
                                                <td class="notes">{{ item.notes }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <button>Xuất file PDF</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
* {
    font-family: 'Poppins', sans-serif;
}

.list {
    width: 98.5%;
    height: 400px;
    border-radius: 10px;
    display: relative;
}

.list .tap {
    display: flex;
}

.list .tap .tap-item {
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

.list .tap .active {
    background-color: white;
    color: #245657;
}

.list .tap .tap-item:hover {
    background-color: #fff;
    color: #245657;
    transition: 0.3s ease-in-out;
}

.list .result {
    width: 100%;
    height: 560px;
    background-color: #fff;
    border-radius: 0 0 10px 10px;
}

.body-content {
    width: 78%;
    height: 92vh;
    display: flex;
    flex-direction: column;
    background-color: #245657;
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
    background-color: #245657;
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
    color: #245657;
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
}

.body-menu p {
    width: fit-content;
    margin: 20px 0;
    cursor: pointer;
}

.body-menu p:hover {
    color: #245657;
    transition: 0.3s ease-in-out;
}

button {
    position: relative;
    border-radius: 10px;
    border: 1px solid #245657;
    background-color: #245657;
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

button:active {
    transform: scale(0.95);
}

button:focus {
    outline: none;
}

button.active {
    background-color: #fff;
    color: #245657;
    border: 2px solid #245657;
}

input {
    width: 500px;
    background-color: #eee;
    border-radius: 10px;
    border: none;
    padding: 12px 15px;
    margin: 8px 0;
}

/* History table styles */
.history-header {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 10px 10px 0 10px;
}

.history-table {
    width: 99%;
    max-height: 450px ;
    padding: 0 10px 20px 5px ;
    overflow-x: hidden;
    overflow-y: auto;
}

.history-table table {
    width: 100%;
    border-collapse: collapse;
    background: #fafafa;
    border-radius: 8px;
    table-layout: fixed;
    word-wrap: break-word;
}

.history-table thead {
    position: sticky;
    top: 0;
    background: #e8f0f0;
    z-index: 1;
}

.history-table th,
.history-table td {
    padding: 10px 12px;
    border-bottom: 1px solid #e5e7eb;
    text-align: left;
    font-size: 14px;
}

.history-table tbody tr:hover {
    background: #f3f7f7;
}

.badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
}

.badge-link {
    background: #dbeafe;
    color: #1e3a8a;
    border: 1px solid #93c5fd;
}

.badge-phone {
    background: #fef3c7;
    color: #92400e;
    border: 1px solid #fcd34d;
}

.status {
    font-weight: 700;
}

.status.safe {
    color: #15803d;
}

.status.warn {
    color: #b45309;
}

.status.danger {
    color: #b91c1c;
}

.score {
    font-weight: 700;
}

.score-high {
    color: #0f766e;
}

.score-mid {
    color: #b45309;
}

.score-low {
    color: #b91c1c;
}

.mono {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    word-break: break-all;
}

.notes {
    color: #334155;
}
</style>