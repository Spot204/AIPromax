import axois from 'axios';
export const checkService = async(data)=>{
    return await axois.post("http://localhost:3000/api/comfirmData", data);
}
export const getListService = async(data)=>{
    return await axois.post("http://localhost:3000/api/list", data);
}