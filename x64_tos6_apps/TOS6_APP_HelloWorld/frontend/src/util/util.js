import store from "@/store";

const throttle = (fn, delay) => {
    // fn节流函数 delay 秒数 ms
    var timeout = null;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
        fn();
    }, delay || 500);
};
const debounce = (fn, delay) => {
    // fn防抖函数 delay 秒数 ms
    let timer = null;
    return function () {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(fn, delay || 500);
    };
};
/**
 * 解决Vue Template模板中无法使用可选链的问题
 */
const optionalChaining = (obj, ...rest) => {
    let tmp = obj;
    for (let key in rest) {
        let name = rest[key];
        // eslint-disable-next-line no-prototype-builtins
        if (tmp.hasOwnProperty(name)) {
            tmp = tmp[name];
        }
    }
    return tmp || "";
};

const crontab = (obj, time) => {
    // linux时间转换时间 obj:需要转换的值 time:当前选中的时间
    obj = JSON.parse(JSON.stringify(obj));
    if (time == "baknow") return "immediately";
    let crontabTime = ["0", "0", "*", "*", "*"]; // 分钟  小时 一个月中的第几天 月份 星期几
    let timeMap = new Map([
        ["Everyday", () => {}],
        [
            "EveryMonth",
            () => {
                crontabTime[2] = obj.month;
            },
        ],
        [
            "EveryWeek",
            () => {
                crontabTime[4] = obj.week;
            },
        ],
    ]);
    timeMap.get(time)();
    obj.time = obj.time.split(":");
    crontabTime[1] = obj.time[0] != "00" ? obj.time[0] : "*";
    crontabTime[0] = obj.time[1] != "00" ? obj.time[1] : "*";
    return crontabTime;
};

/**
 * dateTimeFormat  日期格式化
 * @readonly  例：2021-05-19T15:05:11.223428395+08:00
 * @param {String} format  日期格式
 * @param {String} data  日期参数
 */
const dateTimeFormat = (format, date) => {
    let result = "";
    date = new Date(date);
    const options = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString(), // 秒
    };
    for (let key in options) {
        result = new RegExp("(" + key + ")").exec(format);
        if (result) {
            format = format.replace(
                result[1],
                result[1].length == 1
                    ? options[key]
                    : options[key].padStart(result[1].length, "0")
            );
        }
    }
    return format;
};

/**
 * formatUTC  UTC日期格式化
 * @readonly  例：2021-07-15T09:53:17Z
 * @param {String} utc_datetime  UTC日期
 */
const formatUTC = (utc_datetime) => {
    // 转为正常的时间格式 年-月-日 时:分
    let T_pos = utc_datetime.indexOf("T"),
        y_m_d = utc_datetime.substr(0, T_pos),
        h_m_s = utc_datetime.substring(T_pos + 1, T_pos + 6);

    return y_m_d + " " + h_m_s;
};

const FindSubStringCounts = (str, sub) => {
    let num = 0;
    while (str.indexOf(sub) !== -1) {
        str = str.slice(str.indexOf(sub) + 1);
        num += 1;
    }
    return num;
};
function Sprintf() {
    let args = arguments,
        string = args[0];
    for (let i = 1; i < args.length; i++) {
        let item = arguments[i];
        string = string.replace("%s", item);
    }
    return string;
}
const FindArrayIndex = (array, id, value) => {
    for (let i in array) {
        if (array[i][id] == value) {
            return i;
        }
    }
    return -1;
};
const FilePathDir = (path) => {
    let fp = path.split("/");
    fp.pop();
    return fp.join("/");
};
const FindObjectIndex = (val, obj) => {
    let index = 0;
    for (const key in obj) {
        if (obj.key == val) {
            index = key;
        }
    }
    return index;
};
const findArray = (value, list, id) => {
    let array = [];
    list.forEach((val, i) => {
        if (value instanceof Array) {
            if (value.includes(val[id])) {
                array.push(i);
            }
        } else if (value == val[id]) {
            array.push(i);
        }
    });
    return array;
};
const FindArrayStartWith = (arr, key) => {
    for (let item of arr) {
        if (item.startWith(key)) {
            return true;
        }
    }
    return false;
};
const DeepCopy = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};
const transKbToGb = (value) => {
    return (value / 1024 / 1024).toFixed(2);
};
const MakeText = (val) => {
    if (val instanceof Array) {
        let key = val[0];
        let value = val[1];
        let lang = store.getters.getLang[key][value];
        return !lang ? val : lang
    }
    return val;
};

export {
    throttle,
    findArray,
    FindObjectIndex,
    optionalChaining,
    MakeText,
    debounce,
    crontab,
    dateTimeFormat,
    FindSubStringCounts,
    Sprintf,
    FindArrayIndex,
    FilePathDir,
    transKbToGb,
    DeepCopy,
    FindArrayStartWith,
    formatUTC,
};
