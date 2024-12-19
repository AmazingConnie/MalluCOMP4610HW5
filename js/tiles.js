/*
Name: Rohan Mallu
Date Created: December 3rd 2024
File: tiles.js
GUI Assignment: Implementing a Bit of Scrabble with Drag-and-Drop
Description: This JS file contains the logic to generate tiles for the game.
*/

/**
 * Resources:
 * JSON Array String: Created from pieces.json by Ramon Meza, given by instructor
 * 
 * Convert data from JSON file to JavaScript Array? (for parsing JSON string): https://stackoverflow.com/questions/73400619/convert-data-from-json-file-to-javascript-array
 * 
 * Easy Ways to Render a List of Images: HTML vs. JavaScript (for creating image tiles): https://dev.to/vivecodes/render-a-list-of-images-with-and-without-javascript-3dhj 
 *
 * JavaScript – Select a Random Element from JS Array (for randomly choosing elements from the data structure): https://www.geeksforgeeks.org/how-to-select-a-random-element-from-array-in-javascript/
 * 
 * HTML DOM Element setAttribute() (for creating new attributes for the image): https://www.w3schools.com/jsref/met_element_setattribute.asp 
 * 
 * HTML DOM Element classList (for adding the myTiles class to each tile): https://www.w3schools.com/jsref/prop_element_classlist.asp 
 * 
 * JQuery UI Draggable: Snap to element or grid (for making the tiles draggable and snappable to the the board): https://jqueryui.com/draggable/#snap-to 
 * 
 * HTML DOM Document querySelector() (for appending the tile list): https://www.w3schools.com/jsref/met_document_queryselector.asp 


 */
// data structure for all of the tiles; I was not able to parse them through the .json file using AJAX 
// due to issues with how my code was set up so this was my workaround
// each entry contains a tile's letter, point value, tile amount, and associated image.
const json = `[
	{"letter":"A", "value":1, "amount":9, "image":"graphics_data/Scrabble_Tiles/Scrabble_Tile_A.jpg"},
	{"letter":"B", "value":3, "amount":2, "image":"graphics_data/Scrabble_Tiles/Scrabble_Tile_B.jpg"},
	{"letter":"C", "value":3, "amount":2, "image":"graphics_data/Scrabble_Tiles/Scrabble_Tile_C.jpg"},
	{"letter":"D", "value":2, "amount":4, "image":"graphics_data/Scrabble_Tiles/Scrabble_Tile_D.jpg"},
	{"letter":"E", "value":1, "amount":12, "image":"graphics_data/Scrabble_Tiles/Scrabble_Tile_E.jpg"},
	{"letter":"F", "value":4, "amount":2, "image":"graphics_data/Scrabble_Tiles/Scrabble_Tile_F.jpg"},
	{"letter":"G", "value":2, "amount":3, "image":"graphics_data/Scrabble_Tiles/Scrabble_Tile_G.jpg"},
	{"letter":"H", "value":4, "amount":2, "image":"graphics_data/Scrabble_Tiles/Scrabble_Tile_H.jpg"},
	{"letter":"I", "value":1, "amount":9, "image":"graphics_data/Scrabble_Tiles/Scrabble_Tile_I.jpg"},
	{"letter":"J", "value":8, "amount":1, "image":"graphics_data/Scrabble_Tiles/Scrabble_Tile_J.jpg"},
	{"letter":"K", "value":5, "amount":1, "image":"graphics_data/Scrabble_Tiles/Scrabble_Tile_K.jpg"},
	{"letter":"L", "value":1, "amount":4, "image":"graphics_data/Scrabble_Tiles/Scrabble_Tile_L.jpg"},
	{"letter":"M", "value":3, "amount":2, "image":"graphics_data/Scrabble_Tiles/Scrabble_Tile_M.jpg"},
	{"letter":"N", "value":1, "amount":5, "image":"graphics_data/Scrabble_Tiles/Scrabble_Tile_N.jpg"},
	{"letter":"O", "value":1, "amount":8, "image":"graphics_data/Scrabble_Tiles/Scrabble_Tile_O.jpg"},
	{"letter":"P", "value":3, "amount":2, "image":"graphics_data/Scrabble_Tiles/Scrabble_Tile_P.jpg"},
	{"letter":"Q", "value":10, "amount":1,"image":"graphics_data/Scrabble_Tiles/Scrabble_Tile_Q.jpg"},
	{"letter":"R", "value":1, "amount":6, "image":"graphics_data/Scrabble_Tiles/Scrabble_Tile_R.jpg"},
	{"letter":"S", "value":1, "amount":4, "image":"graphics_data/Scrabble_Tiles/Scrabble_Tile_S.jpg"},
	{"letter":"T", "value":1, "amount":6, "image":"graphics_data/Scrabble_Tiles/Scrabble_Tile_T.jpg"},
	{"letter":"U", "value":1, "amount":4, "image":"graphics_data/Scrabble_Tiles/Scrabble_Tile_U.jpg"},
	{"letter":"V", "value":4, "amount":2, "image":"graphics_data/Scrabble_Tiles/Scrabble_Tile_V.jpg"},
	{"letter":"W", "value":4, "amount":2, "image":"graphics_data/Scrabble_Tiles/Scrabble_Tile_W.jpg"},
	{"letter":"X", "value":8, "amount":1, "image":"graphics_data/Scrabble_Tiles/Scrabble_Tile_X.jpg"},
	{"letter":"Y", "value":4, "amount":2, "image":"graphics_data/Scrabble_Tiles/Scrabble_Tile_Y.jpg"},
	{"letter":"Z", "value":10, "amount":1, "image":"graphics_data/Scrabble_Tiles/Scrabble_Tile_Z.jpg"},
	{"letter":"_", "value":0, "amount":2, "image":"graphics_data/Scrabble_Tiles/Scrabble_Tile_Blank.jpg"}
]`;

// parse the JSON string array
const data = JSON.parse(json);

// generate an array of random values based on the data and tile amount
/**
 * 
 * @param {*} values The list of letters from the JSON string array
 * @param {*} tile_amount The amount of values needed to create tiles
 * @returns A set of random values that can be used to generate tiles
 */
function randomTiles(values, tile_amount) {
	let newTiles = [];
	for(let i = 0; i < tile_amount; i++) {
		var a = Math.floor(Math.random() * values.length);
		var num = values[a];
		newTiles.push(num);
	}
	return newTiles;
}


/**
 * Start the game by generating the tiles and appending them to the tile list
 * Which is laid over the rack
 */
function startGame() {
	// generate seven random tiles
	let intial_tiles = 7;
	let getTiles = randomTiles(data, intial_tiles);

	// keep track of the amount of tiles used
	let tileCount = 100;
	const tileCountText = document.getElementById("tile-count");

	// create new tiles by adding an image, score, letter, and class .myTiles
	// to each tile, then append the tile to the tile list
	const imgContainer = document.querySelector(".tile-list");
	for(let i = 0; i < getTiles.length; i++) {
		const image = document.createElement("img");
		image.src = getTiles[i].image;
		image.setAttribute('data-score', getTiles[i].value);
		image.setAttribute('data-letter', getTiles[i].letter);
		image.classList.add("myTiles");
		imgContainer.append(image);

		// decrement the tile count for each new tile created
		tileCount -= 1;
		tileCountText.textContent = tileCount;
	}
	// make the tiles draggable
	$(".myTiles").draggable({snap:".square", snapMode: "inner", snapTolerance: 50, revert:"invalid"});
}

// call startGame() function
startGame();





