import axios from "axios";

//封装获取定位城市数据
export const getCurrentCity = () => {
    const localCity = JSON.parse(localStorage.getItem('local_city'));
    if (!localCity) {
        return new Promise((resolve, reject) => {
            const curCity = new window.BMapGL.LocalCity();
            curCity.get(async res => {
                try {
                    const result = await axios.get(`http://49.232.149.129:8080/area/info?name=${res.name}`)
                    localStorage.setItem('local_city', JSON.stringify(result.data.body))
                    resolve(result.data.body);
                } catch (e) {
                    reject(e);
                }
            })
        })
    }
    return Promise.resolve(localCity)
}