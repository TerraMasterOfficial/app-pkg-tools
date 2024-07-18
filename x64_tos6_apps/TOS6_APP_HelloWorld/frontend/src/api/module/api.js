import axios from '../interceptor';

const getModule = (params) => {
    return axios.post(`/v2/desktop/module`, params);
}
/**
 * 获取语言
 * @param path
 * @returns {*}
 */
const getLang = (name) => {
    return axios({
        method: "get",
        url: "/v2/lang/"+name,
        type: "json",
    })
}

const getFirst = (url) => {
    return axios({
        method: "get",
        url: "/v2/proxy/"+url,
        type: "json",
    })
}

export {
    getLang,
    getModule,
    getFirst,
}
