export const register = (region: string, isUnrated: boolean, password: any) => {
    var format = require('string-format')
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var graphql = JSON.stringify({
        query: format(`mutation {
            registerContest(
              contestRegion: "{}"
              isUnrated: {}
              password: {}
            ) {
              userId
            }
          }`, region, JSON.stringify(isUnrated), password === undefined ? `null` : format(`"{}"`, password) ),
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