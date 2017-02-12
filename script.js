var $div = $("<div>", {id: "foo", "class": "habla-container"});
$("body").append($div);

var $div = $("<div>", {id: "poo", "class": "habla-content"});
$div.text('fuck with me you know I got it');
$("#foo").append($div);
var $other = $div;
$other.text('changed!');

console.log("I did it!");