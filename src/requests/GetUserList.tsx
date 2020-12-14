export const get_user_list = (region: string, username: any) => {
    var format = require('string-format')
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var graphql = JSON.stringify({
        query: format(`query {
          userCatalog(
            id: null
            username: {}
            mobile: null
            email: null
          ) {
            elements {
              id
              username
              mobile
              email
              jobNumber
              registerTime
              role
            }
          }
        }
        `, (username === undefined || username === null || username === '') ? 'null' : format(`"{}"`, username)),
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