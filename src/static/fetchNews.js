let news = '';
async function updateNewsContent() {
    news = await fetch('/api/news')
        .then(response =>{
            return response.json();
        })
    
    const imageElement = document.querySelector('.news-image');
    const linkElement = document.querySelector('#news-anchor');
    const textElement = document.querySelector('.text');
  
    console.log(news);
    const imgObj = news.image;
    imageElement.src = imgObj.url;
    linkElement.href = news.url;
    textElement.textContent = news.title;

  }
  document.querySelector('#changeNewsBtn').addEventListener('click', () => {
    updateNewsContent();
  });
  document.querySelector('#open-news-text').addEventListener('click', () => {

    Swal.fire({
        title: news.title,
        text: news.body,
        grow: 'row'
    });
  });
updateNewsContent();