<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { checkService, getListService ,exportPDFService} from '../services/checkService';
import axios from 'axios';

const router = useRouter();
const historyList = ref([]);
const dataInput = ref('');
const result = ref({
  mal_w: 0,
  data: '',
  opinion: '',
  description: '',
  create_at: '',
});

function point(mal_w) {
<<<<<<< HEAD
  const score = Math.max(0, 100 - mal_w * 100);
  return score.toFixed(2);
=======
    const score = Math.max(0, 100 - mal_w * 100);
    return score.toFixed(2);
>>>>>>> aa852e99640146ec83e7de02eed09b28138fa27c
}

function logOut() {
  localStorage.removeItem('token');
  localStorage.removeItem('user_id');
  router.push('/login');
}

const submitCheck = async () => {
<<<<<<< HEAD
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
      create_at: response.data.created_at,
    };

    await fetchHistory();
    alert('✅ Kiểm tra link thành công!');
  } catch (error) {
    alert('❌ Lỗi khi kiểm tra link.');
    console.error(error);
  }
};
const user_id = ref(localStorage.getItem('user_id'));
const exportPDF = async () => {
  try {
    if (!user_id.value) {
      alert('Bạn chưa đăng nhập.');
      return;
=======
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
>>>>>>> aa852e99640146ec83e7de02eed09b28138fa27c
    }
    const response = await exportPDFService({ user_id: user_id.value });
    const pdfUrl = response.data.pdfUrl;

    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'report.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert('✅ Xuất file PDF thành công!');
  } catch (error) {
    alert('❌ Lỗi khi xuất file PDF.');
    console.error(error);
  }
};

<<<<<<< HEAD

function setColor(opinion) {
  if (!opinion) return '';
  if (opinion === 'Bình thường' || opinion === 'An toàn' || opinion >= 70) return 'safe';
  if (opinion === 'Không ý kiến' || opinion >= 40) return 'normal';
  return 'danger';
=======
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
>>>>>>> aa852e99640146ec83e7de02eed09b28138fa27c
}

function setColorFromScore(score) {
  if (score >= 70) return 'score-safe';
  if (score >= 40) return 'score-normal';
  return 'score-danger';
}

async function fetchHistory() {
  try {
    const user_id = localStorage.getItem('user_id');
    const response = await getListService({ user_id });
    historyList.value = response.data.data;
  } catch (error) {
    alert('❌ Lỗi khi lấy lịch sử kiểm tra.');
  }
}

onMounted(() => {
  fetchHistory();
});
function formatTime(value) {
  if (!value) return '---';
  let date;
  if (!isNaN(value)) {
    const num = Number(value);
    date = num < 1e12 ? new Date(num * 1000) : new Date(num);
  } else {
    date = new Date(value);
  }
  if (isNaN(date.getTime())) return '---';
  return date.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
}

</script>

<template>
  <div class="dashboard">
    <!-- Header -->
    <header class="header">
      <div class="logo-wrap">
        <img src="../assets/logo.jpg" alt="Logo" class="logo" />
        <h1>RavenSecurity</h1>
      </div>
      <button class="logout" @click="logOut">Đăng xuất</button>
    </header>

    <!-- Body -->
    <main class="main-content">
      <!-- Card: Check Link -->
      <section class="card check-card">
        <h2>🔍 Kiểm tra liên kết / số điện thoại</h2>
        <p class="desc">Nhập đường link hoặc số điện thoại nghi ngờ để kiểm tra độ an toàn.</p>
        <div class="check-form">
          <input type="text" placeholder="Nhập link hoặc số điện thoại..." v-model="dataInput" />
          <button @click="submitCheck">Kiểm tra</button>
        </div>
<<<<<<< HEAD
      </section>

      <!-- Card: Result -->
      <section v-if="result.data" class="card result-card">
        <h3>📊 Kết quả phân tích</h3>
        <div class="result-grid">
          <div class="score-box">
            <div :class="['circle', setColorFromScore(result.mal_w)]">{{ result.mal_w }}</div>
            <p>Điểm an toàn</p>
          </div>
          <div class="details">
            <p><strong>Đầu vào:</strong> {{ result.data }}</p>
            <p>
              <strong>Trạng thái:</strong>
              <span :class="setColor(result.opinion)">{{ result.opinion }}</span>
            </p>
            <p><strong>Ghi chú:</strong> {{ result.description }}</p>
            <p><strong>Thời gian quét:</strong> {{ result.create_at }}</p>
          </div>
        </div>
      </section>

        <!-- Phần Lịch sử kiểm tra -->
        <section class="card history-card">
        <h3>🕓 Lịch sử kiểm tra</h3>

        <div class="table-wrapper">
            <table>
            <thead>
                <tr>
                <th>Đầu vào</th>
                <th>Trạng thái</th>
                <th>Thời gian</th>
                <th>Ghi chú</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in historyList" :key="item.id">
                <td>{{ item.data }}</td>
                <td><span :class="setColor(item.opinion)">{{ item.opinion }}</span></td>
                <td>
                {{
                    formatTime(item.created_at)
                }}
                </td>
                <td>{{ item.description }}</td>
                </tr>
            </tbody>
            </table>
        </div>

        <!-- ✅ Nút xuất file đặt ngoài vùng cuộn -->
        <div class="export-btn-wrapper">
            <button @click="exportPDF" class="export-btn">
            <i class="fas fa-file-export"></i> Xuất file PDF
            </button>
        </div>
        </section>


      <!-- Info / About -->
      <section class="about-section">
        <div class="about-banner">
            <div class="about-left">
            <i class="fa-solid fa-shield-halved about-icon"></i>
            </div>
            <div class="about-right">
            <h2>Giới thiệu về <span>RavenSecurity</span></h2>
            <p>
                <strong>RavenSecurity</strong> là nền tảng phân tích & phát hiện mối nguy Internet,
                ứng dụng trí tuệ nhân tạo (AI) trong việc kiểm tra và đánh giá an toàn các
                <strong>liên kết – số điện thoại – nội dung trực tuyến</strong>.
            </p>
            <div class="about-features">
                <div class="feature"><i class="fa-solid fa-bolt"></i> Phân tích nhanh & chính xác theo thời gian thực</div>
                <div class="feature"><i class="fa-solid fa-database"></i> Cơ sở dữ liệu cập nhật liên tục</div>
                <div class="feature"><i class="fa-solid fa-file-shield"></i> Báo cáo chi tiết định dạng PDF chuyên nghiệp</div>
                <div class="feature"><i class="fa-solid fa-user-shield"></i> Giao diện bảo mật, thân thiện & dễ sử dụng</div>
            </div>
=======
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
>>>>>>> aa852e99640146ec83e7de02eed09b28138fa27c
            </div>
        </div>
      </section>

    </main>

    <footer class="footer">
      <p>© 2025 RavenSecurity. All rights reserved.</p>
      <p>Liên hệ: <a href="mailto:trongdz815@gmail.com">trongdz815@gmail.com</a> | Hotline: 0912 260 352</p>
    </footer>
  </div>
</template>

<style scoped>
/* ========== BASE ========== */
* {
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}
.dashboard {
  background-color: #f5f8fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ========== HEADER ========== */
.header {
  background: linear-gradient(90deg, #1b3b44, #245657);
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 30px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
.logo-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo {
  width: 45px;
  height: 45px;
  object-fit: cover;
  border-radius: 6px;
}
.header h1 {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 1px;
}
.logout {
  background-color: transparent;
  border: 2px solid #fff;
  color: #fff;
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}
.logout:hover {
  background-color: #fff;
  color: #1b3b44;
}

/* ========== MAIN CONTENT ========== */
.main-content {
  padding: 30px;
  max-width: none;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* ========== CARD STYLE ========== */
.card {
  background-color: #fff;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
}
.card h2, .card h3 {
  color: #1b3b44;
  margin-bottom: 10px;
}
.desc {
  color: #555;
  margin-bottom: 20px;
}

/* ========== FORM ========== */
.check-form {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.check-form input {
  flex: 1;
  min-width: 250px;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: #f9f9f9;
  font-size: 15px;
}
.check-form button {
  background-color: #245657;
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  cursor: pointer;
  transition: 0.3s;
}
.check-form button:hover {
  background-color: #2e7d32;
}

/* ========== RESULT ========== */
.result-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  margin-top: 15px;
}
.score-box {
  text-align: center;
}
.circle {
  width: 90px;
  height: 90px;
  margin: 0 auto;
  border-radius: 50%;
  font-weight: 700;
  font-size: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.score-safe {
  background: #2e7d32;
  color: white;
}
.score-normal {
  background: #f9a825;
  color: white;
}
.score-danger {
  background: #d32f2f;
  color: white;
}
.details p {
  margin-bottom: 8px;
}
.safe { color: #2e7d32; font-weight: 600; }
.normal { color: #f9a825; font-weight: 600; }
.danger { color: #d32f2f; font-weight: 600; }

/* ========== TABLE HISTORY ========== */
.table-container {
  max-height: 400px;
  overflow-y: auto;
  border-radius: 8px;
}
<<<<<<< HEAD
=======

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

>>>>>>> aa852e99640146ec83e7de02eed09b28138fa27c
table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
th, td {
  padding: 10px 12px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}
thead th {
  position: sticky;
  top: 0;
  background: #1b3b44;
  color: #fff;
  font-weight: 600;
}
tbody tr:nth-child(even) {
  background: #f9f9f9;
}
tbody tr:hover {
  background-color: #eef6f6;
}
.export-btn {
  background-color: #1b3b44;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: 0.3s;
}
.export-btn:hover {
  background-color: #245657;
}

/* ========== ABOUT SECTION ========== */
.about-card ul {
  list-style: none;
  padding: 0;
  margin: 10px 0 0;
}
.about-card li {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
  margin-bottom: 8px;
}
.about-card i {
  color: #2e7d32;
}

/* ========== FOOTER ========== */
.footer {
  margin-top: auto;
  background-color: #1b3b44;
  color: #fff;
  text-align: center;
  padding: 15px 10px;
  font-size: 14px;
}
.footer a {
  color: #fff;
  text-decoration: underline;
}
/* ✅ Bảng không bị đè */
.table-wrapper {
  max-height: 400px;
  overflow-y: auto;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #fff;
}

/* Bảng gọn gàng */
table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

th,
td {
  padding: 12px 14px;
  border-bottom: 1px solid #e0e0e0;
  vertical-align: top;
  text-align: left;
  word-wrap: break-word;
}

thead th {
  position: sticky;
  top: 0;
  background: #1b3b44;
  color: #fff;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 14px;
  z-index: 1;
}

tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

tbody tr:hover {
  background-color: #eef6f6;
}

/* ✅ Nút xuất file căn phải ngoài bảng */
.export-btn-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #1b3b44;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  cursor: pointer;
  transition: 0.3s;
}

.export-btn:hover {
  background-color: #245657;
}
/* ✅ Mở rộng vùng chứa card lịch sử */
.history-card {
  width: 100%;
  overflow-x: auto;
}

/* ✅ Bảng chiếm toàn bộ chiều ngang, không bị co */
.history-card table {
  min-width: 1000px; /* bảng dài đủ để xem thoải mái */
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

/* ✅ Cải thiện bố cục cột cho dễ đọc */
th:nth-child(1),
td:nth-child(1) { width: 20%; } /* Đầu vào */
th:nth-child(2),
td:nth-child(2) { width: 15%; } /* Trạng thái */
th:nth-child(3),
td:nth-child(3) { width: 20%; } /* Thời gian */
th:nth-child(4),
td:nth-child(4) { width: 45%; } /* Ghi chú */

/* ✅ Đặt nút xuất file ở góc phải ngoài bảng */
.export-btn-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
/* ========== ABOUT SECTION (PROFESSIONAL VERSION) ========== */
.about-section {
  background: linear-gradient(135deg, #e8f0f2, #ffffff);
  border-radius: 16px;
  padding: 40px 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.about-banner {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 25px;
}

.about-left {
  flex: 0 0 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.about-icon {
  font-size: 80px;
  color: #245657;
  background: radial-gradient(circle at center, #2e7d32 0%, #1b3b44 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.about-right {
  flex: 1;
  min-width: 300px;
}

.about-right h2 {
  color: #1b3b44;
  font-size: 24px;
  margin-bottom: 10px;
}

.about-right h2 span {
  color: #2e7d32;
  font-weight: 700;
}

.about-right p {
  color: #333;
  font-size: 15px;
  line-height: 1.7;
  margin-bottom: 20px;
}

.about-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 10px 20px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1b3b44;
  font-weight: 500;
  background: #f0f8f7;
  border-left: 4px solid #2e7d32;
  border-radius: 8px;
  padding: 10px 15px;
  transition: 0.3s;
}

.feature i {
  color: #2e7d32;
  font-size: 16px;
}

.feature:hover {
  background: #dff5e3;
  transform: translateY(-2px);
}

</style>
