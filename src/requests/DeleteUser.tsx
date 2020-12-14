export const delete_user = (id: string) => {
    var format = require('string-format')
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    var urlencoded = new URLSearchParams();
    urlencoded.append("id", id);

    let credentials: any = 'include';
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        credentials: credentials,
    };

    return fetch(format("{}user/manage/delete_user", localStorage['SERVICE_URL']), requestOptions);
}