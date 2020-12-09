export const get_problem_list = (region: string) => {
    var format = require('string-format')
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var graphql = JSON.stringify({
        query: format("query {\r\nproblemCatalog(\r\nregion: \"{}\"\r\n) {\r\n    elements {\r\n      id\r\n      title\r\n      tags\r\n      difficulty\r\n      acceptRate\r\n      isPassed\r\n    isTried\r\n    }\r\n  }\r\n}\r\n", region),
        variables: {}
    })

    let credentials: any = 'include';
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: graphql,
        credentials: credentials,
    };
    return fetch(format("{}graphql", localStorage['SERVICE_URL']), requestOptions);
}