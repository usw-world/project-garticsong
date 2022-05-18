function GetAllCookies() {
    let obj = {};
    let cookies = document.cookie;
    if(cookies) {
        cookies = cookies.split(";");
        cookies.forEach(cookie => {
            let [name, value] = cookie.split("=");
            obj[name.trim()] = value;
        })
    }
    return obj;
}
function GetCookie(name) {
    let str = document.cookie.split(";")
    if(str) {
        str = str.find(item => {
            return item.trim().startsWith(`${name}=`);
        })
    }
    if(str) {
        str = str.split("=")[1];
    }
    return str;
}
function SetCookie(name, value, expires) {
    if(!expires) {
        document.cookie = `${name}=${value}`;
    } else {
        document.cookie = `${name}=${value}; expires=${expires}`;
    }
}
function DeleteCookie(name) {
    document.cookie = `${name}=; expires=${new Date(0)};`;
}

exports.module = {
    GetAllCookies,
    GetCookie,
    SetCookie,
    DeleteCookie
}