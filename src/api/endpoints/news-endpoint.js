const {Endpoint} = require('./endpoint');
let axios = require('axios');
const sessionsManager = require('../sessionManager');

var news = [];
class NewsEndpoint extends Endpoint {
  constructor(){super();}
  
  async get(req, res) {
    console.log('checkpoint: ', 1);
    let flag = await sessionsManager(req);
    if (flag == false) {
        console.log("FALS");
        res.setHeader("Location", "/login");
        res.statusCode = 302;
        res.end();
    } else {
      function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
      }
        if (news.length == 0) {
          console.log('news array empty');
          const fetchData = async () => {
            const options = {
              method: 'GET',
              url: 'https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/search/NewsSearchAPI',
              params: {
                q: 'terrorism',
                pageNumber: '1',
                pageSize: '50',
                autoCorrect: 'true',
                withThumbnails: 'true',
                fromPublishedDate: '2023-06-01T00:00:01',
                toPublishedDate: 'null'
              },
              headers: {
                'X-RapidAPI-Key': '586835d4c1msh01957fc912c357bp163e5djsne9dcb886b679',
                'X-RapidAPI-Host': 'contextualwebsearch-websearch-v1.p.rapidapi.com'
              }
            };
            console.log('checkpoint: ', 3);
            try {
              // console.log("Waiting for the API response...");
              const response = await axios.request(options);
              console.log("Got the API response!");
              return response.data.value;
            } catch (error) {
              console.error(error);
              throw error;
            }
          };
          fetchData()
            .then(newsArr => {
              console.log('checkpoint: ', 4);
              news = newsArr;
              console.log('checkpoint: ', 5);
            })
            .then(() => {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              const index = getRandomInt(1,news.length);
              res.end(JSON.stringify(news[index]));
              news.splice(index, 1);
            })
            .catch(error => {
              console.error("API request failed:", error);
            });
        }
        else {
          console.log('news array NOT empty.');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          const index = getRandomInt(1,news.length);
          res.end(JSON.stringify(news[index]));
          news.splice(index, 1);
        }
    }
  }
}
module.exports = {NewsEndpoint};