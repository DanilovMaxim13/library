let favorites = [];
let ratingStorage = {};

let JSONdata;

document.addEventListener("DOMContentLoaded", function() { 
  checkFavorites();
  checkRating();
  createCatalog();
});

function createCatalog() {
  let xhr = new XMLHttpRequest ();
  xhr.open("GET", "books.json");
  xhr.onload = function() {
    JSONdata = JSON.parse(xhr.responseText);  
    for (let key of favorites)
      createCart(key);
    favoriteOnlick();
    ratingOnClick();
  }  
  xhr.send();
}; 

function checkFavorites() {
  if (localStorage.getItem("favorites") != null) {
    favorites = JSON.parse(localStorage.getItem("favorites"))
  }
};

function checkRating() {
  if (localStorage.getItem("rating") != null) {
    ratingStorage = JSON.parse(localStorage.getItem("rating"))
  }
}

function ratingOnClick() {
  let plusButton = document.getElementsByClassName("rating__plus");
  [].forEach.call( plusButton, function(item) {
    item.onclick = function() {
      let articul = item.getAttribute("articul");
      if (ratingStorage[articul] < 10) ratingStorage[articul]++;
      localStorage.setItem("rating", JSON.stringify(ratingStorage));
      document.querySelector(".rating__rating[articul=\""+ articul + "\"]").textContent = ratingStorage[articul];
    };
  });

  let minusButton = document.getElementsByClassName("rating__minus");
  [].forEach.call( minusButton, function(item) {
    item.onclick = function() {
      let articul = item.getAttribute("articul");
      if (ratingStorage[articul] > 1) ratingStorage[articul]--;
      localStorage.setItem("rating", JSON.stringify(ratingStorage));
      document.querySelector(".rating__rating[articul=\""+ articul + "\"]").textContent = ratingStorage[articul];
    };
  });
}

function favoriteOnlick() {
  let favoritesButton = document.getElementsByClassName("card__favorites");
  [].forEach.call( favoritesButton, function(item) {
    item.onclick = function() {
      setFavorites(item.getAttribute("articul"));
    };
  });

  function setFavorites(articul) {
    let index = favorites.indexOf(articul);
    if (index !== -1) {
      favorites.splice(index, 1);
      document.querySelector( ".card__favorites[articul=\""+ articul + "\"]" ).style.color = 'black';
      document.querySelector( ".card[articul=\""+ articul + "\"]" ).style.display = "none";
    } else {
      favorites.unshift(articul);
      document.querySelector( ".card__favorites[articul=\""+ articul + "\"]"  ).style.color = 'blue';
    };
    localStorage.setItem("favorites", JSON.stringify(favorites));
  };
}

function createCart(key) {
  let card = document.createElement("article");
  card.setAttribute("articul", key);
  card.className = "card";

  let photoWrapper = document.createElement("div");
  photoWrapper.className = "photo-wrapper";
  let photo = document.createElement("img");
  photo.className = "card__image-book";
  photo.src = JSONdata[key]["image"];
  photo.alt = "Книга \"" + JSONdata[key]["name"] + "\"";
  photoWrapper.append(photo);
  card.append(photoWrapper);

  let nameInform = document.createElement("div");
  nameInform.className = "name-information";
  nameInform.innerHTML += "<h2 class=\"card__book-name\">" + JSONdata[key]["name"] + "</h2>"
  nameInform.innerHTML += "<p class=\"card__book-author\">" +  JSONdata[key]["author"] + "</p>"
  card.append(nameInform);

  let additInform = document.createElement("div");
  additInform.className = "additional-information";
  
  if(ratingStorage[key] === undefined) {ratingStorage[key] = 5;}
  let rating = document.createElement("article");
  rating.className = "rating";
  rating.innerHTML += "<button class=\"rating__minus\" articul=\"" + key + "\">-</button>" 
  rating.innerHTML += "<p class=\"rating__rating\" articul=\"" + key + "\">" +  ratingStorage[key] + "</p>"
  rating.innerHTML += "<button class=\"rating__plus\" articul=\"" + key + "\">+</button>"
  additInform.append(rating);

  let checkFavorites = document.createElement("button");
  checkFavorites.className = "card__favorites";
  checkFavorites.setAttribute("articul", key);
  if (favorites.indexOf(key) !== -1) {
    checkFavorites.style.color = 'blue';
  }
  checkFavorites.textContent = "ИЗБРАННОЕ";
  additInform.append(checkFavorites);
  card.append(additInform);

  document.getElementById("content").append(card);
}


