const mainDisplayBox=document.querySelector("#main-container");
const searchInput=document.querySelector(".search");
const pageInfo = document.getElementById('pageInfo');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const searchBtn=document.querySelector(".getSearch");
const delay=500;
let currPage=1,totalPage=1;


// const debounce = (func,delay) =>{
//     let interval;
//     return (...args)=>{
//         clearInterval(interval);//clear the prev call
//         interval=setTimeout(()=>{
//             func(...args)
//         },delay);
//     };
    
// }


const getMovie= async (query,page=1)=>{
    if (!query.trim()) {
        mainDisplayBox.innerHTML="";
        const message = document.createElement("p");
        message.innerHTML = "Please enter a movie name to search.";
        message.style.margin = "auto";
        message.style.fontWeight = "800";
        message.style.fontSize = "1.5rem";
        mainDisplayBox.appendChild(message);
        return;
    }

    mainDisplayBox.innerHTML="Loading....";
    let response =await fetch(`https://www.omdbapi.com/?s=${query}&apikey=e261d61f&page=${page}`);
    let data =await response.json();
    console.log(data);
    console.log("query:",query);
    mainDisplayBox.innerHTML="";

    if (!data.Search || data.Search.length === 0) {
        const message = document.createElement("p");
        message.innerHTML = "No movies found for this search query.";
        message.style.margin = "auto";
        message.style.fontWeight = "800";
        message.style.fontSize = "1.5rem";
        mainDisplayBox.appendChild(message);
        return;
    }

    mainDisplayBox.innerHTML=""; //clear prev content
    data.Search.forEach(movie =>{
      let movieBox=document.createElement('div');
      movieBox.classList.add("movieBox");
      movieBox.innerHTML=`
       <image src=${movie.Poster} alt=${movie.Title}>
       <h3>${movie.Title}</h3>
       <p>${movie.Year}<p>`;
       mainDisplayBox.appendChild(movieBox);
    });

    currPage=page;
    totalPage=Math.ceil(data.totalResults/10);
    pageInfo.textContent = `Page: ${currPage}`;
    prevBtn.disabled= currPage===1;
    nextBtn.disabled=currPage===totalPage;
};

window.addEventListener("DOMContentLoaded", () => {
    getMovie("All", 1);
});



// searchInput.addEventListener('input', debounce(() => {
//     const query = searchInput.value;
//     if (query.trim()) {
//         currPage = 1;
//         getMovie(query);
//     }

// }, delay));


let interval;
searchInput.addEventListener('input',()=>{
    clearInterval(interval);
    interval =setTimeout(()=>{
        const query = searchInput.value;
        if (query.trim()) {
            currPage = 1;
            getMovie(query);
        }
        else{
            getMovie("All");
        }
    },delay);
});

// searchBtn.addEventListener("click",
//     debounce(() => {
//         const query = searchInput.value;
//         if (query.trim()) {
//             currPage = 1;
//             getMovie(query);
//         }

//     }, delay)
// );

prevBtn.addEventListener("click", () => {
    const query = searchInput.value;
    if (currPage > 1) {
        getMovie(query, currPage - 1);
    }
});

nextBtn.addEventListener("click", () => {
    const query = searchInput.value;
    if (currPage < totalPage) {
        getMovie(query, currPage + 1);
    }
});
