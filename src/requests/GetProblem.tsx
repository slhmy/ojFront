export const get_problem = (region: string, id: string) => {
    var format = require('string-format')
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var graphql = JSON.stringify({
        query: format(`query {
            problem(
              id: {}
              region: "{}"
            ) {
              title
              defaultMaxCpuTime
              defaultMaxMemory
              problemContext {
                description
                inputExplain
                outputExplain
                examples {
                  inputExample
                  outputExample
                }
                hint
              }
              submitTimes
              acceptTimes
              opaqueOutput
            }
          }`, id, region),
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