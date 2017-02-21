card1 = {
    title : "NXP Thing",
    content : "Lorem ipsum blah blah blah",
    image : "media/car.jpg"
};

card2 = {
    title : "NXP Thing",
    content : "Lorem ipsum blah blah blah",
    image : "media/car.jpg"
};

cards = []
cards.push(card1)
cards.push(card2)

json = JSON.stringify(cards)
json = "var contentJson = " + json
console.log(json);

var blob = new Blob([json], {type: "application/js"});
var url  = URL.createObjectURL(blob);
var b = $("#saveButton");
b.attr("download", "content.js");
b.attr("href", url);

console.log("Read in the data")
console.log(contentJson)
