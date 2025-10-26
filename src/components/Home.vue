<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { checkService, getListService } from '../services/checkService';

const router = useRouter();
const historyList = ref({});
const dataInput = ref('');
const result = ref({
    mal_w: 0,
    data: '',
    opinion: '',
    description: '',
    create_at: '',
});
function point(mal_w) {
    const score = Math.max(0, 100 - mal_w * 100);
    return score.toFixed(2);
}

function logOut() {
    localStorage.removeItem('token');
    router.push('/login');
}

const submitCheck = async () => {
    try {
        const userId = localStorage.getItem('user_id');
        if (!userId) return alert('Bạn chưa đăng nhập');
        const response = await checkService({
            data: dataInput.value,
            user_id: userId,
        });
        result.value = {
            mal_w: point(response.data.mal_w),
            data: response.data.data,
            opinion: response.data.opinion,
            description: response.data.description,
            create_at: response.data.created_at
        };
        await fetchHistory();
        alert('Kiểm tra link thành công!');
        if (response.message !== 'undefined') {
            alert(response.message);
        }
    } catch (error) {
        alert('Lỗi khi kiểm tra link:', error);
    }
};

function setColor(opinion) {
    if (!opinion) return '';
    if (opinion === 'Bình thường' || opinion === 'An toàn' || opinion >= 70) return 'safe';
    if (opinion == 'Không ý kiến' || opinion >= 40) return 'nomal';
    return 'danger';
}

function setColorFromScore(score) {
    if (score >= 70) return 'score-value-safe';
    if (score >= 40) return 'score-value-nomal';
    return 'score-value-danger';
}

async function fetchHistory() {
    try {
        const user_id = localStorage.getItem('user_id');
        const response = await getListService({ user_id: user_id });
        historyList.value = response.data.data;
    } catch (error) {
        alert('Lỗi khi lấy lịch sử kiểm tra:', error);
    }
}
onMounted(() => {
    fetchHistory();
});
</script>

<template>
    <div class="container">
        <div class="head">
            <div>logo</div>
            <div class="exit" @click="logOut">Đăng xuất</div>
        </div>
        <div class="body-container">
            <div class="body-content">
                <div class="check-content">
                    <div class="check">
                        <h3>Kiểm tra link độc hại</h3>
                        <p>Bạn nhập đường link nghi ngờ vào phần bên dưới</p>
                        <div class="check-item">
                            <input type="text" placeholder="Nhập link cần kiểm tra" v-model="dataInput" />
                            <button @click="submitCheck">Kiểm tra</button>
                        </div>
                        <div class="result">
                            <!-- Phần phân tích -->
                            <div class="analysis">
                                <h4>Kết quả phân tích</h4>
                                <div class="analysis-content">
                                    <div class="score">
                                        <div class="score-label">Điểm an toàn</div>
                                        <div :class="setColorFromScore(result.mal_w)">{{ result.mal_w }}</div>
                                    </div>
                                    <div class="details">
                                        <p><strong>URL:</strong> {{ result.data }}</p>
                                        <p><strong>Trạng thái:</strong> <span :class="setColor(result.mal_w)">{{
                                            result.opinion }}</span>
                                        </p>
                                        <P><strong>Ghi chú: </strong> {{ result.description }}</P>
                                        <p><strong>Thời gian quét:</strong> {{ result.create_at }}</p>
                                    </div>
                                </div>
                            </div>
                            <!-- Phần lịch sử -->
                            <div class="history">
                                <h4>Lịch sử kiểm tra</h4>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Link</th>
                                            <th>Trạng thái</th>
                                            <th>Thời gian</th>
                                            <th>Ghi chú</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in historyList" :key="item.id">
                                            <td>{{ item.data }}</td>
                                            <td>
                                                <span :class="setColor(item.opinion)">
                                                    {{ item.opinion }}
                                                </span>
                                            </td>
                                            <td>{{ new Date(1761400058964).toISOString() }}</td>
                                            <td>{{ item.note }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div class="export-btn">
                                    <button>
                                        <i class="fas fa-file-export"></i>
                                        Xuất file PDF
                                    </button>
                                </div>
                            </div>
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

.container {
    width: 100%;
}

.head {
    width: 100%;
    height: 60px;
    background-color: #245657;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
}

.head div {
    margin: 0 20px;
}

.body-container {
    display: flex;
    width: 100%;
}

.body-content {
    width: 100%;
    height: 92vh;
    background-color: #245657;
    padding: 20px;
}

.check-content {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.check {
    width: 100%;
    background-color: #fff;
    border-radius: 10px;

}

.check h3 {
    margin: 10px;
}

.check p {
    margin: 15px;
    color: #666;
}

.check input {
    margin-left: 15px;
}

.check-item {
    display: flex;
    gap: 10px;
    margin: 20px 0;
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

button {
    border-radius: 10px;
    border: 1px solid #245657;
    background-color: #245657;
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    padding: 12px 30px;
    cursor: pointer;
    transition: 0.3s ease-in-out;
}

button:hover {
    background-color: #fff;
    color: #245657;
}

button:active {
    transform: scale(0.95);
}

input {
    width: 100%;
    max-width: 500px;
    background-color: #eee;
    border-radius: 10px;
    border: none;
    padding: 12px 15px;
}

.result {
    margin-top: 30px;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 10px;
}

.analysis {
    margin-bottom: 30px;
}

.analysis-content {
    display: flex;
    gap: 30px;
    margin-top: 20px;
}

.score {
    text-align: center;
    padding: 20px;
    background: #e8f5e9;
    border-radius: 10px;
    width: 150px;
}

.score-value-safe {
    font-size: 24px;
    font-weight: bold;
    color: #2e7d32;
    margin-top: 10px;
}

.score-value-nomal {
    font-size: 24px;
    font-weight: bold;
    color: #f9a825;
    margin-top: 10px;
}

.score-value-danger {
    font-size: 24px;
    font-weight: bold;
    color: #d32f2f;
    margin-top: 10px;
}

.details {
    flex: 1;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

th,
td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

th {
    background-color: #f5f5f5;
    font-weight: 600;
}

.safe {
    color: #2e7d32;
    font-weight: 600;
}

.danger {
    color: #d32f2f;
    font-weight: 600;
}

.history h4 {
    margin: 30px 0 15px 0;
}

.export-btn {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

.export-btn button {
    display: flex;
    align-items: center;
    gap: 8px;
}

.export-btn i {
    font-size: 16px;
}
</style>