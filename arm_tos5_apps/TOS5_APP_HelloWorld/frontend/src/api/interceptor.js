import axios from "axios";
import VueCookies from "vue-cookies";
const Axios = axios.create({});
Axios.interceptors.request.use(
    (config) => {
        // 拦截器
        if (config.url.indexOf("v2") == "-1") {
            // 重写URL
            config.url = `/v2/proxy${config.url}`;
        }
        // 添加 Token
        VueCookies.get("X-Csrf-Token") && (config.headers["X-Csrf-Token"] = VueCookies.get("X-Csrf-Token"));
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);
Axios.interceptors.response.use((response) => {
    if (response.data.code) {
        // code == true 返回具体信息
        return response.data;
    } else {
        return Promise.reject(response.data);
    }
});
export default Axios;
