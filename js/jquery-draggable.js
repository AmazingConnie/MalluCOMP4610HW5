/*
Name: Rohan Mallu
Date Created: December 11th 2024
File: jquery-draggable.js
GUI Assignment: Implementing a Bit of Scrabble with Drag-and-Drop
Description: This JS file contains jQuery logic and JS helper functions for updating
the tiles, board squares, and other UI components in the game.
*/

/**
 * Resources: 
 * JavaScript Maps (for inserting/removing board square id and tile letter pairs to/from the wordArray): 
 * https://www.w3schools.com/js/js_maps.asp 
 * 
 * jQueryUI Draggable: Snap to element or grid (for making the tiles draggable and snappable to the the board): 
 * https://jqueryui.com/draggable/#snap-to 
 *  
 * JqueryUI - Button (for enabling and disabling buttons):
 * https://www.tutorialspoint.com//jqueryui/jqueryui_button.htm
 * 
 * jQueryUI Button (for decorating button): https://jqueryui.com/button/
 * 
 * jQueryUI Droppable: Photo Manager (for dragging and dropping objects between the board and the rack): 
 * https://jqueryui.com/droppable/#photo-manager
 * 
 * jQueryUI Droppable: Revert Draggable Position (for reverting tiles): 
 * https://jqueryui.com/droppable/#revert 
 * 
 * jQuery UI - Droppable only accept one draggable (for implementing accept logic): https://stackoverflow.com/questions/3948447/jquery-ui-droppable-only-accept-one-draggable 
 * https://stackoverflow.com/questions/3948447/jquery-ui-droppable-only-accept-one-draggable
 * 
 * Centering draggable elements inside droppable using jquery-ui (for centering tiles when placed on board):
 * https://stackoverflow.com/questions/26589508/centering-draggable-elements-inside-droppable-using-jquery-ui
 * 
 * jQuery UI Draggable: Get drag offset of A LOT of dynamically created elements (for using offset on tiles):
 * https://stackoverflow.com/questions/41232654/jquery-ui-draggable-get-drag-offset-of-a-lot-of-dynamically-created-elements 
 * 
 * jQuery draggable + droppable: how to snap dropped element to dropped-on element (for adding and removing classes for board squares and tiles): 
 * https://stackoverflow.com/questions/1254665/jquery-draggable-droppable-how-to-snap-dropped-element-to-dropped-on-element 
 * 
 * jQuery UI Droppable out Event (for implementing logic when tile is removed from the board):
 * https://www.geeksforgeeks.org/jquery-ui-droppable-out-event/
 * 
 * jQuery animate() Method (for reverting the tile if a gap is detected): 
 * https://www.w3schools.com/jquery/eff_animate.asp 
 * 
 * jQuery counting elements by class - what is the best way to implement this? (for counting instances of a class):
 * https://stackoverflow.com/questions/2727303/jquery-counting-elements-by-class-what-is-the-best-way-to-implement-this 
 * 
 * jQuery text() Method (for setting and getting text of score elements): 
 * https://www.w3schools.com/jquery/html_text.asp
 * 
 * jQuery ui.draggable - how to get data attribute from a div (for finding and setting data attributes):
 * https://stackoverflow.com/questions/36479988/jquery-ui-draggable-how-to-get-data-attribute-from-a-div 
 * 
 * How can I get the data-id attribute? (for getting and setting data attributes such as multiplier and score):
 * https://stackoverflow.com/questions/5309926/how-can-i-get-the-data-id-attribute 
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
 */

// declare global variables for wordArray and score so they can be accessed by other .js files
let wordArray = new Map();
let score = 0;

// check to see if first tile is placed to avoid gaps between
// the first tile and subsequent tiles placed on the board
let isFirstTilePlaced = false;

$(document).ready(function() {
    // disable button until user places more than one tile on the board
    $("#submit").button({disabled: true});

    // make the tiles draggable and revert them if they are invalid
    $(".myTiles").draggable({snap:".square", snapMode: "inner", snapTolerance: 50, revert:"invalid"});

    // set the double letter and double word board squares as multipliers
    $("#square2, #square6, #square8, #square12").data("multiplier", 2);
    
    // make the rack a droppable area as well
    $(".tile-holder").droppable({accept: ".myTiles", revert:"invalid"});

    // add droppable functionality for each board square
    $(".square").droppable({
        accept: function(draggable) {
            // revert tile if board square already has a tile on it
            // this is meant to prevent stacking of tiles on the same square
            return !$(this).hasClass("occupied") || draggable.hasClass("dropped");
        }, 
        drop: function(event, ui) {
            // intialize variables for the board sqaure and the draggable tiles
            var $square = $(this);
            var $tile = ui.draggable;

            // if the first tile is placed down and there are gaps between the first tile and second
            // tiles, return the tile back to the rack
            if(isFirstTilePlaced) {
                if(!checkSquares($square)) {
                    $tile.animate({top: 0, left: 0}, "slow");
                    return;
                }
            } else {
                isFirstTilePlaced = true; // set to true if first tile has been placed
            }

            // when placing the tile onto the board, adjust the position so that if fits cleanly
            // inside the board square
            $tile.offset({
                left: $square.offset().left + ($square.width() - $tile.width()) / 8,
                top: $square.offset().top + ($square.height() - $tile.height()) / 8
            });
        
            // retrieve the score of the tile if it has been placed on the board
            if(!$tile.hasClass("scored")) {
                // if a tile is placed on a double word score or double letter score tile
                // set the multiplier to 2, else leave it as 1
                var multiplier = 1;
                if($square.data("multiplier")) {
                    multiplier = $square.data("multiplier");
                }

                // update round score
                var tileScore = $tile.data("score"); 
                score += (multiplier * tileScore);
                $("#score").text(score);

                // add class "scored" so that the tile's score is not recalculated.
                $tile.addClass("scored");
            }
        
            // mark board square as "occupied" and tile as "dropped" when a tile is dropped onto the board
            $square.addClass("occupied");
            $tile.addClass("dropped");

            // insert board square id and tile letter into the wordArray
            // this will be used to update the empty word string in updateWord()
            let letter = $tile.data('letter');
            let squareId = $square.attr('id');
            wordArray.set(squareId, letter);

            // enable the submit button if user places more than two tiles on the board
            var count = $('.occupied').length;
            if(count > 1) {
                $("#submit").button({disabled: false});
            }

            // call the update word function
            updateWord();

       
       },
       out: function(event, ui) {
        // intialize variables for the board sqaure and the draggable tiles
        var $square = $(this);
        var $tile = ui.draggable;

        // if tile is removed from board square
        if($square.hasClass("occupied")) {
            // remove the score of the tile from the initial score
            // along with the multiplier
            if($tile.hasClass("scored")) {
                var multiplier = 1;
                if($square.data("multiplier")) {
                    multiplier = $square.data("multiplier");
                }
                var tileScore = $tile.data("score");
                score -= (multiplier * tileScore);
                $("#score").text(score);
            }
            $tile.removeClass("scored");
        }

        // remove "occupied" and "dropped" classes after tile has been removed from the board
        $square.removeClass("occupied");
        $tile.removeClass("dropped");

        // remove letter entry from wordArray
        let squareId = $square.attr('id');
        wordArray.delete(squareId);

        // call updateWord() function to reflect removed letter
        updateWord();

        // disable the button if there are fewer than two tiles on the board
        var count = $('.occupied').length;
        if(count < 2) {
            $("#submit").button({disabled: true});
        }

        // if there are no tiles on the board, set isFirstTilePlaced to false
        if(count == 0) {
            isFirstTilePlaced = false;
        }
        
       }
    
    });

    /**
     * Function to concatenate word and update the empty string
     * Updates the Word UI component with the new word
     */ 
    function updateWord() {
        // create an array to store the tile characters
        let word = [];

        // for each board square, insert the tile letter into the wordArray if a tile
        // is dropped on the square
        $(".square").each(function() {
            var $square = $(this);
            let tileLetter = $square.attr('id');
            if(wordArray.has(tileLetter)) {
                let value = wordArray.get(tileLetter);
                word.push(value);
            } else {
                word.push('-');
            }
        });
    
        // update the empty string with the word joined together
        let finalWord = word.join('');
        $("#word").text(finalWord);
    }
    
    /**
     * Check if the squares adjacent to the occupied square are occupied
     * if true, revert the tile back to the rack 
     * @param {*} $square The board square that is occupied by the tile
     * @returns Whether or not the squares next to the occupied square are
     * occupied or not to prevent stacking and gaps between tiles.
     */

    function checkSquares($square) {
        var $prevSquare = $square.prev(".square");
        var $nextSquare = $square.next(".square");
    
        return($prevSquare.hasClass("occupied") || $nextSquare.hasClass("occupied"));
    }

   
});

