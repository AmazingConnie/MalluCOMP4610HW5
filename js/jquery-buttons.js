/*
Name: Rohan Mallu
Date Created: December 17th 2024
File: jquery-buttons.js
GUI Assignment: Implementing a Bit of Scrabble with Drag-and-Drop
Description: This JS file contains the jQuery logic for each of the three buttons,
including what events the buttons should invoke after clicking them.
*/

/**
 * Resources:
 * jQuery text() Method (for setting and getting text of score elements): 
 * https://www.w3schools.com/jquery/html_text.asp
 * 
 * jQuery Misc each() Method (for iterating over the board squares): 
 * https://www.w3schools.com/jquery/misc_each.asp 
 * 
 * jQuery - If element has class do this (general reference for has class): 
 * https://stackoverflow.com/questions/4565075/jquery-if-element-has-class-do-this 
 * 
 * How to Add or Remove class in jQuery? (to add and remove classes for board squares and tiles):
 * https://www.geeksforgeeks.org/how-to-add-or-remove-class-in-jquery/
 * 
 * How to disable a jQuery-ui draggable of widget? (for disabling the tiles when tile count is below zero):
 * https://www.geeksforgeeks.org/how-to-disable-a-jquery-ui-draggable-of-widget/
 * 
 * How to Handle Button Click Events in jQuery? (for handling events on button clicks):
 * https://stackoverflow.com/questions/4323848/how-to-handle-button-click-events-in-jquery 
 * 
 * HTML DOM Document querySelector() (for clearing the tile list): 
 * https://www.w3schools.com/jsref/met_document_queryselector.asp 
 */

$(document).ready(function() {
    let totalScore = 0; // initialize total score to 0

    // do the following actions after clicking the "Submit Word" button
    $("#submit").click(function() {

        // remove dashes from the word by using a for loop
        var word = $("#word").text();
        var newWord = "";

        // form new word without dashes
        for(let k = 0; k < word.length; k++) {
            if(word[k] != "-") {
                newWord += word[k];
            }
        }

        // check for dropped tiles
        $(".square").each(function() {
            if ($(this).hasClass("occupied")) {
                $(".dropped").remove(); // remove dropped tiles if they are found
                $(this).removeClass("occupied"); // Clear the occupied state of the board
                $(".scored").remove(); // remove scored tiles if any are found
            }

        });


        // generate new tiles to replace used tiles
        var remainingTiles = $(".tile-list img").length;
        var newTileCount = 7 - remainingTiles;
        newTiles(newTileCount); 

        // reset the word string, initial score, and disable the buttons
        resetScores(newWord); 
        
    });
    

    // do the following actions after clicking the "New Tiles" button
    $("#swap-tiles").click(function() {
        // check for dropped tiles
        $(".square").each(function() {
            if ($(this).hasClass("occupied")) {
                $(".dropped").remove(); // remove dropped tiles if they are found
                $(this).removeClass("occupied"); // Clear the occupied state of the board
                $(".scored").remove(); // remove scored tiles if any are found
            }

        });

        // clear the word array
        wordArray.clear();
        
        // set word string to empty and round score to 0
        $("#word").text("---------------");
        score = 0;
        $("#score").text(score);

        // reset isFirstTilePlaced to false if there are any tiles on the board
        isFirstTilePlaced = false;
       
        // function to clear tiles and select new tiles
        clearTiles();
    });
    

    // do the following actions after clicking the "Reset Game" button
    $("#reset").click(function() {
        /// check for dropped tiles
        $(".square").each(function() {
            if ($(this).hasClass("occupied")) {
                $(".dropped").remove(); // Remove dropped tiles if they are found
                $(this).removeClass("occupied"); // Clear the occupied state of the board
                $(".scored").remove();  // Remove scored tiles if any are found
            }
        });

        // Update word string to be empty and disable the submit word button
        $("#word").text("---------------");
        $("#submit").button({disabled: true});
     
        // clear the word array, and reinitialize scores to 0
        wordArray.clear();

        totalScore = 0;
        $("#total-score").text(totalScore);
     
        score = 0;
        $("#score").text(score);

        // clear tiles and call the start game function to start over
        let containerReset = document.querySelector(".tile-list");
        containerReset.innerHTML = "";

        // reset isFirstTilePlaced to false if there are any tiles on the board
        isFirstTilePlaced = false;

        // call the startGame() function
        startGame();
        
    });
    

    // 
    /**
     * Function to generate replacement tiles
     * @param {*} newCount The number of replacement tiles needed
     * Returns a set of new tiles added to the tile container
     */
    function newTiles(newCount) {
        // create new tiles based on the remaining tiles availale in the .tileList
        let getTiles = randomTiles(data, newCount);

        // retrieve the tile list
        const imgContainer = document.querySelector(".tile-list");

        // for each new tile, create an img element with image, score, and letter attributes
        // and append it to the tile list
        for(let i = 0; i < getTiles.length; i++) {
            const image = document.createElement("img");
            image.src = getTiles[i].image;
            image.setAttribute('data-score', getTiles[i].value);
            image.setAttribute('data-letter', getTiles[i].letter);
            image.classList.add("myTiles");
            imgContainer.append(image);
        }
        // make the new tiles draggable
        $(".myTiles").draggable({snap:".square", snapMode: "inner", snapTolerance: 50, revert:"invalid"});
    }
    
    /**
     * Reset any variables, scores, and elements needed after submitting a word
     * @param {*} word Word submitted by the user; Used to calculate the number of 
     * new tiles needed
     * Returns nothing, just resets the scores and other UI components
     */
    function resetScores(word) {
        // calculate tile count based on the length of each word submitted
        let remainingTiles = parseInt($("#tile-count").text(), 10);
        let newTileCount = remainingTiles - word.length;
        $("#tile-count").text(newTileCount);
    

       // reset word string, disable submit button, and clear wordArray
       $("#word").text("---------------");
       $("#submit").button({disabled: true});
    
       wordArray.clear();
       
       // add the score from word submitted to the total score
       totalScore = parseInt($("#total-score").text(), 10);
       let currentScore = parseInt($("#score").text(), 10);
       totalScore += currentScore;
       $("#total-score").text(totalScore);

       // reset word score to 0
       score = 0;
       $("#score").text(score);

       // mark the placement of the first tile as false since no tiles are on the board
       isFirstTilePlaced = false;
       
       // if player runs out of tiles, disable the "New Tiles" and "Reset Game" buttons
       if(newTileCount <= 0) {
        $("#submit").button({disabled: true});
        $("#swap-tiles").button({disabled: true});
        $(".myTiles").draggable({disabled: true});
       }
    
    }

    // 
    /**
     * Function to generate new tiles if the user cannot make words out of their current tiles
     * Generates a new set of seven tiles
     */
    function clearTiles() { 
        // clear the tile list
        let container = document.querySelector(".tile-list");
        container.innerHTML = "";

        // generate 7 new tiles from the data collection in the JSON string 
        let numOfTiles = 7;
        let getTiles = randomTiles(data, numOfTiles);

        // retrieve the tile list
        const imgContainer = document.querySelector(".tile-list");

        // for each new tile, create an img element with image, score, and letter attributes
        // and append it to the tile list
        for(let i = 0; i < getTiles.length; i++) {
            const image = document.createElement("img");
            image.src = getTiles[i].image;
            image.setAttribute('data-score', getTiles[i].value);
            image.setAttribute('data-letter', getTiles[i].letter);
            image.classList.add("myTiles");
            imgContainer.append(image);
        }
        // make the new tiles draggable
        $(".myTiles").draggable({snap:".square", snapMode: "inner", snapTolerance: 50, revert:"invalid"});
    }


});


