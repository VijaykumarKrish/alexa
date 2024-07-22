const axios = require('axios');

// Amazon OAuth token request in the backend
// const OAuthRequests = (function () {
//     const header = {
//         "headers": {
//             "Content-Type": "application/json"
//         }
//     };

//     const accessTokenBody = function (amazonAuthCode, state) {
//         return {
//             "grant_type": "authorization_code",
//             "code": amazonAuthCode,
//             "redirect_uri": config.skillConfig.redirect_uri,
//             "client_id": config.skillConfig.client_id,
//             "client_secret": config.skillConfig.client_secret
//         };
//     };

//     return {
//         accessTokenRequest: (authcode, state) => {
//             return {
//                 header: header,
//                 body: accessTokenBody(authcode, state)
//             }
//         }
//     }
// })();

// Request the Amazon access/refresh tokens from the Amazon OAuth token server
// function getAccessTokenByAuthcode(amazonAuthCode, state) {
//     const accessTokenRequest = OAuthRequests.accessTokenRequest(amazonAuthCode, state);
//     return axios.post(config.endpoints.oauthEndpoint, accessTokenRequest.body, accessTokenRequest.header);
// }