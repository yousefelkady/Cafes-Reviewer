const mongoose = require('mongoose');
const Cafe = require('./models/cafe.js')
const city = require('cities.json');
const cafeNames = require('./sample.js');
const axios = require('axios').default;
require('dotenv').config();



const db = mongoose.connect('mongodb://127.0.0.1:27017/cafe')
    .then(() => {
        console.log("Connected");
    }).catch((error) => {
        console.log(error, "Happened");
    });


const randomCafeID = Math.floor(Math.random() * 54) + 10;
const randomCityID = Math.floor(Math.random() * 200) + 20;
const RandomPrice = Math.floor(Math.random() * 20) + 100;
const randomImageID = Math.floor(Math.random() * 5);
let randomURL = `https://api.unsplash.com/photos/random?client_id=${process.env.client_ID}&query=coffeeshop`;
let imageData = null;
axios.get(randomURL)
    .then((response) => {
        const image = response.data.urls['regular'];
        imageData = image;
        console.log(imageData);
        createCafe(imageData)
    })
    .catch((err) => {
        console.log(err);
    })

function createCafe(imageData) {
    const cafes = [
        {
            name: cafeNames.names[randomCafeID],
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ac auctor augue mauris augue neque. Pellentesque sit amet porttitor eget. Ut aliquam purus sit amet luctus venenatis lectus magna. Egestas erat imperdiet sed euismod nisi. Nibh ipsum consequat nisl vel. Non tellus orci ac auctor augue mauris augue neque gravida. Tellus molestie nunc non blandit massa. Ut aliquam purus sit amet luctus venenatis lectus magna fringilla. Dignissim convallis aenean et tortor at risus viverra adipiscing at. Fermentum posuere urna nec tincidunt praesent semper feugiat nibh sed. Tincidunt vitae semper quis lectus nulla.",
            price: RandomPrice,
            location: `${city[randomCityID].name}, ${city[randomCityID].country}`,
            image: imageData
        }
    ]
    Cafe.insertMany(cafes)
        .then((data) => {
            console.log(data);
        })
        .catch((err) => {
            console.log(err);
        })
    return cafes;
}


// console.log(cafes);

// // Cafe.DeleteMany({});


