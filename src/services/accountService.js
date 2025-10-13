import axios from"axios"

export const logIn = async(data)=>{
    return await axios.post("http://localhost:3000/api/logIn", data);
}
export const createAccount = async(data)=>{
    return await axios.post("http://localhost:3000/api/createAccount", data);
}