const {Endpoint} = require('./endpoint');
let axios = require('axios');



class NewsEndpoint extends Endpoint {
  constructor(){super();}
    
    async get(_, res) {
        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min) + min);
          }
        const fetchData = async () => {
            const options = {
              method: 'GET',
              url: 'https://real-time-news-data.p.rapidapi.com/search',
              params: {
                query: 'Terrorism',
                lang: 'en'
              },
              headers: {
                'X-RapidAPI-Key': '586835d4c1msh01957fc912c357bp163e5djsne9dcb886b679',
                'X-RapidAPI-Host': 'real-time-news-data.p.rapidapi.com'
              }
            };
      
            try {
              // console.log("Waiting for the API response...");
              const response = await axios.request(options);
              // console.log("Got the API response!");
              return response.data;
            } catch (error) {
              console.error(error);
              throw error;
            }
          };
          fetchData()
            .then(newsArr => {
              const response = [];
      
              const data = newsArr.data;
              // 3 stiri random din cele returnate
              response.push(data[getRandomInt(1, data.length / 6)]);
              response.push(data[getRandomInt(data.length / 6 + 1, data.length / 3)]);
              response.push(data[getRandomInt(data.length / 3 + 1, data.length)]);
      
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(data));
            })
            .catch(error => {
              console.error("API request failed:", error);
            });
    }
}
module.exports = {NewsEndpoint};