export const change_user = (
    id: string,
    username: any,
    password: any,
    email: any,
    mobile: any,
    role: any,
) => {
    var format = require('string-format')
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    var urlencoded = new URLSearchParams();
    urlencoded.append("id", id);

    if (username !== null && username !== undefined && username !== '') { urlencoded.append("username", username); }
    if (password !== null && password !== undefined && password !== '') { urlencoded.append("password", password); }
    if (email !== null && email !== undefined && email !== '') { urlencoded.append("email", email); }
    if (mobile !== null && mobile !== undefined && mobile !== '') { urlencoded.append("mobile", mobile); }
    if (role !== null && role !== undefined && role !== '') { urlencoded.append("role", role); }

    let credentials: any = 'include';
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        credentials: credentials,
    };

    return fetch(format("{}user/manage/change_info", localStorage['SERVICE_URL']), requestOptions);
}