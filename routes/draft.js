require("dotenv").config();
const rootUrl = process.env.SERVER_URL;
const axios = require('axios');
const { serialize } = require("bson");


// const entry = {
//   username: req.body.username, 
//   code: req.body.code
// }

const fullUrl = "http://localhost:3001/coolerDate/code/addFirstAccessTime"
const entry = {
  username: 'rodonguyen', 
  code: 'newcode123'
}


function send(){
  axios.post(fullUrl, JSON.stringify(entry))
    .then((res) => {
      console.log(res)
      return res
    })
    .catch((err) => console.log(err));

  // var options = {
  //     uri: fullUrl,
  //     body: JSON.stringify(entry),
  //     method: 'POST',
  //     headers: {
  //         'Content-Type': 'application/json'
  //     }
  // }
  // request(options, function (error, response) {
  //     console.log(error,response);
  //     return;
  // });
}

send()



// request({
//   url: fullUrl,
//   body: entry,
//   method: "POST",
//   headers: {
//     'Content-Type': 'application/json'
//   }
// }, function (error, response, body){
//     console.log(response); 
// });


// fetch(
//   fullUrl,
//   {
//     method: "post",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(entry),
//   }
// )
// .then((res) => {
//   return res.json();
// });