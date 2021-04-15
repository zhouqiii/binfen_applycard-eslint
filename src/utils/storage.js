let date = new Date().getTime();
let expirse_time = date + 7*24*60*60*1000
//设置localStorage的值
// storage.set("test", "你好", expirse_time);
//获取localStorage的值
// var data = storage.get("test");
 
 
const storage = {
    set: function (key, value, ttl_ms = expirse_time) {
        let data = { value: value, expirse: new Date(ttl_ms).getTime() };
        localStorage.setItem(key, JSON.stringify(data));
    },
    get: function (key) {
        let data = JSON.parse(localStorage.getItem(key));
        if (data !== null) {
            if (data.expirse != null && data.expirse < new Date().getTime()) {
                localStorage.removeItem(key);
            } else {
                return data.value;
            }
        }
        return null;
    }
}

export default storage