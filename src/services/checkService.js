import axois from 'axios';

export const checkService = async(data)=>{
    return await axois.post("http://localhost:3000/api/comfirmData", data);
}
export const getListService = async(data)=>{
    return await axois.post("http://localhost:3000/api/list", data);
}
export const exportPDFService = async (data) => {
  try {
    const response = await axois.post(
      "http://localhost:3000/api/report/pdf",
      data,
      {
        responseType: "blob", // ⚠️ Quan trọng để nhận file nhị phân
      }
    );

    // ✅ Tạo URL và tải file về
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "report_user.pdf"); // tên file tải xuống
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("❌ Lỗi khi xuất PDF:", error);
    alert("Không thể tải file PDF. Vui lòng kiểm tra server!");
  }
};
