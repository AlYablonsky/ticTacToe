document.getElementById('ticTacToe').style.display = 'none';
document.getElementById('turnForm').style.display = 'none';
document.getElementById('reset').style.display = 'none';

var canvas = document.getElementById('ticTacToe'); 
var	ctx = canvas.getContext('2d'); 
var	msg = document.getElementById('message');
var	msg1 = document.getElementById('message1');
var	squareSize = 150; 
var	board = [0,0,0,0,0,0,0,0,0];

var notGone = 0, X = 1, O = -1;	
var mouse = {
	x : -1,
	y : -1,
};
var currentPlayer;   // set to either X alias 1 or O alias -1 for each turm 
var computerPlayer;   // bool true for 1 player and false for twoplayer
var isTie = false;    // true if tie
var gameOver = false;  // true if the game is over
var winSquares = [];    // squares the compose winning row, column or diagonal
var moveHuman = 0;    // # of moves for human player only exists for 1 player setup
var moveComputer = 0; // # of moves for computer player
var pointX = 0;
var pointO = 0;
var numberOfTies = 0;
var computerTurn;     // player value for computer either X alias 1 or O alias -1 does not change 
var positionTakenByHuman; // Prohibit computer move if human attempts to click an occupied spot

function chooseNumberOfPlayers(clicked_id){
	document.getElementById('numberOfPlayersForm').style.display = 'none';
	document.getElementById('turnForm').style.display = 'block';
	
		if (clicked_id === "1") {
			computerPlayer = true;
		}
		else if (clicked_id === "2") {
			computerPlayer = false;
		}	
}


function choosePlayerType(clicked_id){
	document.getElementById('turnForm').style.display = 'none';
	document.getElementById('ticTacToe').style.display = 'block';
	document.getElementById('reset').style.display = 'block';
	
	displayScore();
		if (clicked_id === "G") {
			history.go(0);
		}
	  
		else if (clicked_id === "X") {
			currentPlayer = X;		
				
		}
	
		else if (clicked_id === "O"){
			currentPlayer = O;
		}
	
		if (computerPlayer){
			computerTurn = -1 * currentPlayer;		
		}
	
		var goFirst = Math.floor(Math.random()*2);
		if (goFirst === 1)     {
					if (computerPlayer){
						currentPlayer *= -1;
						displayTurn();
						play();
				}
		}  
}

function resetFxn(){
	
	history.go(0);
}


canvas.width = canvas.height = 3 * squareSize;


canvas.addEventListener('mouseout', function(){  // Action voided When the moves out of the canvas
				mouse.x = mouse.y = -1;
});


canvas.addEventListener('mousemove', function(e){ // Gets coordinates based on hover
						
				mouse.x = e.pageX - canvas.offsetLeft,  // horizontal coordinate of event minus numbet of pixels upper left corner is offset to the left  
				mouse.y = e.pageY - canvas.offsetTop;   // vertical coordinate of event minus distance of the current element relative to the top of the parent 

});


canvas.addEventListener('click', function(e){ // On click gets the specific square clicked on
				
			play(getSquareByLocation(mouse.x, mouse.y));
			if (computerPlayer && positionTakenByHuman ){
				setTimeout(play, 1);
			}
});

function displayTurn(){
	
	msg.innerHTML = ((currentPlayer === X )?'X':'O') + '\'s turn.';	
}

function displayScore(){
	
	msg1.innerHTML= '<tr><th scope ="col">#Wins X</th><th scope="col">#Wins O</th><th scope ="col">#Ties</th></tr><tr><td> ' + pointX +' </td><td> ' + pointO +' </td><td> '+ numberOfTies +'</td></tr>';		
}

function play(square = -1){
	if (gameOver){
		return;
	}
	
	if (square === -1) {
	   var humanPlayer = -1 * currentPlayer;	
	   artificialIntelligence(currentPlayer, humanPlayer);
	}
	else {
	   if (board[square] !== notGone){
	      msg.innerHTML = 'Position Taken.';
	      setTimeout(function(){msg.innerHTML = '<br/>';},2000);
	      positionTakenByHuman = false;
	      return;
	    }
	    positionTakenByHuman = true;
	    board[square] = currentPlayer;
	}
		
	var winCheck = check4Win(currentPlayer);
	
	if (winCheck === true){
		
		gameOver = true;
		isTie = false;
		msg.innerHTML = ((currentPlayer === X )?'X':'O') + ' wins!';
		if (currentPlayer === X){
			pointX++;
		}
		else if (currentPlayer === O){ 	
			pointO++;
		}
		setTimeout(nextGame, 3000);
		return;
	}
	else if (isTie) {
		gameOver = true;
		msg.innerHTML = 'Tie!';
		numberOfTies++;
		setTimeout(nextGame, 3000);
		return;
	}
	if (square === -1){
			++moveComputer;
	}
	else {
		++moveHuman;
	}
	currentPlayer *= -1;
	displayTurn();
}


function nextGame() {
	
	gameOver = false;
	isTie = false;
	msg.innerHTML = '';
	displayScore();
	for (var i = 0; i < board.length; i++) { 
	 board[i] = notGone;
 	}	
	winSquares = [];
	
	if (computerPlayer === true){
			moveComputer = moveHuman =0;
		}
	
	var goFirst2 =  Math.floor(Math.random()*2);
	if (computerPlayer === false){ 
	
		if (goFirst2 ===1 && isTie === true){
			currentPlayer *= -1;
		}
		displayTurn();
	}
	else if (computerPlayer){
		currentPlayer = computerTurn;
		if (goFirst2){
			displayTurn();
			play();
		}
		else if (!goFirst2){
			currentPlayer *= -1;
			displayTurn();
		}
	}

}

function check4Win(player) {

	 //check rows
        for(var i = 0; i <= 6; i += 3) {
            if(board[i] === player && board[i] === board[i + 1] && board[i + 1] === board[i + 2]) {
                winSquares.push(i);
				winSquares.push(i + 1);
				winSquares.push(i + 2);
                return true;
            }
        }
	
	//check columns
        for(var i = 0; i <= 2 ; i++) {
            if(board[i] === player && board[i] === board[i + 3] && board[i + 3] === board[i + 6]) {
                winSquares.push(i);
				winSquares.push(i + 3);
				winSquares.push(i + 6);
                return true;
            }
        }
	
     //check diagonals
        for(var i = 0, j = 4; i <= 2 ; i = i + 2, j = j - 2) {
            if(board[i] === player && board[i] == board[i + j] && board[i + j] === board[i + 2*j]) {
                winSquares.push(i);
				winSquares.push(i + j);
				winSquares.push(i + 2 * j);
                return true;
            }
        }	
	
	// Tie Score
          if  (board.indexOf(notGone) === -1){
			  isTie = true; 
	          return false;		  
		  } 
	      return false;
}


function artificialIntelligence(player1, player2){
	
		if ( board[0] === notGone){                         // Advance Top Left - Bottom Right Diagonal
			if (board[4] === player1 && board[8] === player1) {
				board[0] = player1;
				return;
			}
		}
		if ( board[2] === notGone){                       // Advance Top Right - Bottom Left Diagonal
			if (board[4] === player1 && board[6] === player1) {
				board[2] = player1;
				return;
			}
		}
		if ( board[4] === notGone){                       // Advance Top Left - Bottom Right Diagonal
			if (board[0] === player1 && board[8] === player1) {
				board[4] = player1;
				return;
			}
			if (board[2] === player1 && board[6] === player1) {// Advance Top Right - Bottom Left Diagonal
				board[4] = player1;
				return;
			}	
		}
	    if ( board[6] === notGone){                       // Advance Top Right - Bottom Left Diagonal
			if (board[4] === player1 && board[2] === player1) {
				board[6] = player1;
				return;
			}
		}
		if ( board[8] === notGone){                       // Advance Top Right - Bottom Left Diagonal
			if (board[4] === player1 && board[0] === player1) {
				board[8] = player1;
				return;
			}
		}
	
	for (var i = 0; i < board.length; i++){
		
		if ( Math.floor(i/3) === 0 && board[i] === notGone ){             //  Advance Column from top	
			if (board[i + 3] === player1 && board[i + 6] === player1) {
				board[i] = player1;
				return;
			}
		}
		if ( Math.floor(i/3) === 1 && board[i] === notGone ){				//  Advance Column from Middle
			if (board[i - 3] === player1 && board[i + 3] === player1) {
				board[i] = player1;
				return;
			}
		}
		if ( Math.floor(i/3) === 2 && board[i] === notGone ){	          //  Advance Column from Botttom
			if (board[i - 3] === player1 && board[i - 6] === player1) {
				board[i] = player1;
				return;
			}
		}
		if ( i % 3 === 0 && board[i] === notGone ){                     //  Advance Row	from Left
			if (board[i + 1] === player1 && board[i + 2] === player1){
				board[i] = player1;
				return;
			}
		}
		if ( i % 3 === 1 && board[i] === notGone ){                     //  Advance Row	from Middle
			if (board[i - 1] === player1 && board[i + 1] === player1){
				board[i] = player1;
				return;
			}
		}
		if ( i % 3 === 2 && board[i] === notGone ){                     //  Advance Row from Right	
			if (board[i - 1] === player1 && board[i - 2] === player1){
				board[i] = player1;
				return;
			}
		}	
	}
	
	if ( board[0] === notGone){                         // Advance Top Left - Bottom Right Diagonal
			if (board[4] === player2 && board[8] === player2) {
				board[0] = player1;
				return;
			}
		}
		if ( board[2] === notGone){                       // Advance Top Right - Bottom Left Diagonal
			if (board[4] === player2 && board[6] === player2) {
				board[2] = player1;
				return;
			}
		}
		if ( board[4] === notGone){                       // Advance Top Left - Bottom Right Diagonal
			if (board[0] === player2 && board[8] === player2) {
				board[4] = player1;
				return;
			}
			if (board[2] === player2 && board[6] === player2) {// Advance Top Right - Bottom Left Diagonal
				board[4] = player1;
				return;
			}	
		}
	    if ( board[6] === notGone){                       // Advance Top Right - Bottom Left Diagonal
			if (board[4] === player2 && board[2] === player2) {
				board[6] = player1;
				return;
			}
		}
		if ( board[8] === notGone){                       // Advance Top Right - Bottom Left Diagonal
			if (board[4] === player2 && board[0] === player2) {
				board[8] = player1;
				return;
			}
		}
	
	
	for (var i = 0; i < board.length; i++){
		
		if ( Math.floor(i/3) === 0 && board[i] === notGone ){             //  Advance Top Row	
			if (board[i + 3] === player2 && board[i + 6] === player2) {
				board[i] = player1;
				return;
			}
		}
		if ( Math.floor(i/3) === 1 && board[i] === notGone ){				//  Advance Middle Row
			if (board[i - 3] === player2 && board[i + 3] === player2) {
				board[i] = player1;
				return;
			}
		}
		if ( Math.floor(i/3) === 2 && board[i] === notGone ){	          //  Advance Bottom Row
			if (board[i - 3] === player2 && board[i - 6] === player2) {
				board[i] = player1;
				return;
			}
		}
		if ( i % 3 === 0 && board[i] === notGone ){                     //  Advance Left Column	
			if (board[i + 1] === player2 && board[i + 2] === player2){
				board[i] = player1;
				return;
			}
		}
		if ( i % 3 === 1 && board[i] === notGone ){                     //  Advance Middle Column	
			if (board[i - 1] === player2 && board[i + 1] === player2){
				board[i] = player1;
				return;
			}
		}
		if ( i % 3 === 2 && board[i] === notGone ){                     //  Advance Right Column	
			if (board[i - 1] === player2 && board[i - 2] === player2){
				board[i] = player1;
				return;
			}
		}	
	}

	
	var selectSquare;
	
	if ( moveComputer === 0 && moveHuman === 0){
		selectSquare = 2 * Math.floor(Math.random()*5);
		board[selectSquare] = player1;
	}
	
	else if ( moveHuman === 1 && moveComputer === 0){

		if ( board[4] === notGone){
		   board[4] = player1;	
		}else {
			
		var result = Math.floor(Math.random()*4);
			if (result === 0) {selectSquare = 0;}
			else if (result === 1){ selectSquare = 2;}
			else if (result === 2){selectSquare = 6;}
			else if (result === 3) {selectSquare = 8;}
			board[selectSquare] = player1;
		}
	}
	
	else if (moveComputer === 1 && moveHuman === 1) {
	        if ( board[4] === notGone){
		   board[4] = player1;	
		}else {
			
	       do {
		    selectSquare = Math.floor(Math.random()*4);   
	
	       }while (board[ 2* selectSquare] !== notGone);
	       board[2 * selectSquare] = player1;	
		}
	}
	else if (moveComputer === 1 && moveHuman === 2) {
		var flag1 = flag2 = flag3 = flag4 = false;
		var flag5 = flag6 = flag7 = flag8 =  false;
		var flag9 = flag10 = false;
		var flag11 = flag12 = flag13 = flag14 = flag15 = flag16 = flag17 = flag18 = false;
		
		
	if (board[1] === player2 && board[5] === player2){
		flag1 = true;
	}
	else if (board[1] === player2 && board[3] === player2){
		flag2 = true;
	}
	else if (board[3] === player2 && board[7] === player2){
		flag3 = true;
	}
	else if (board[5] === player2 && board[7] === player2){
		flag4 = true;
	}
		
	else if 	(board[4] === player2 && board[0] === player2 && board[8] === player1){
		flag5 = true;
	}
	else if 	(board[4] === player2 && board[2] === player2 && board[6] === player1){
		flag6 = true;
	}	
	else if 	(board[4] === player2 && board[6] === player2 && board[2] === player1){
		flag7 = true;
	}		
	else if 	(board[4] === player2 && board[8] === player2 && board[0] === player1){
		flag8 = true;
	}		
	else if 	(board[0] === player2 && board[8] === player2 && board[4] === player1){
		flag9 = true;
	}			
	else if 	(board[2] === player2 && board[6] === player2 && board[4] === player1){
		flag10 = true;
	}
		
		
	else if 	(board[0] === player2 && board[4] === player1 && board[7] === player2){
		flag11 = true;
	}	
	else if 	(board[2] === player2 && board[4] === player1 && board[7] === player2){
		flag12 = true;
	}		
	else if 	(board[2] === player2 && board[4] === player1 && board[3] === player2){
		flag13 = true;
	}		
	else if 	(board[8] === player2 && board[4] === player1 && board[3] === player2){
		flag14 = true;
	}		
	else if 	(board[8] === player2 && board[4] === player1 && board[1] === player2){
		flag15 = true;
	}	
	else if 	(board[6] === player2 && board[4] === player1 && board[1] === player2){
		flag16 = true;
	}	
	else if 	(board[6] === player2 && board[4] === player1 && board[5] === player2){
		flag17 = true;
	}	
	else if 	(board[0] === player2 && board[4] === player1 && board[5] === player2){
		flag18 = true;
	}		
		
		
		
		
	
	if ( flag1 === true){	
		board[2] = player1;
		}
		else if (flag2 === true){	
		board[0] = player1;
	    }
		else if (flag3 === true){
				board[6] = player1;
	    }
		else if (flag4 === true){
				board[8] = player1;
				
	    } else if (flag5 === true || flag8 === true){
			var result = Math.floor(Math.random()*2); 
			if (result === 0){ selectSquare = 2;}
			else if (result === 1) { selectSquare = 6;}
			board[selectSquare] = player1;
	    }
		else if (flag6 === true || flag7 === true){
			var result = Math.floor(Math.random()*2); 
			if (result === 0){ selectSquare = 8;}
			else if (result === 1) { selectSquare = 0;}
			board[selectSquare] = player1;
	    }
		else if (flag9 === true || flag10 === true){
			var result = Math.floor(Math.random()*4); 
			if (result === 0){ selectSquare = 1;}
			else if (result === 1) { selectSquare = 3;}
			else if (result === 2) { selectSquare = 5;}
			else if (result === 3) { selectSquare = 7;}
		    board[selectSquare] = player1;
	    }
		else if (flag11 === true){
			var result = Math.floor(Math.random()*3); 
			if (result === 0){ selectSquare = 3;}
			else if (result === 1) { selectSquare = 6;}
			else if (result === 2) { selectSquare = 8;}
			board[selectSquare] = player1;
		}
		else if (flag12 === true){
			var result = Math.floor(Math.random()*3); 
			if (result === 0){ selectSquare = 5;}
			else if (result === 1) { selectSquare = 6;}
			else if (result === 2) { selectSquare = 8;}
			board[selectSquare] = player1;
		}
		else if (flag13 === true){
			var result = Math.floor(Math.random()*3); 
			if (result === 0){ selectSquare = 0;}
			else if (result === 1) { selectSquare = 6;}
			else if (result === 2) { selectSquare = 1;}
			board[selectSquare] = player1;
			
		}
		else if (flag14 === true){
			var result = Math.floor(Math.random()*3); 
			if (result === 0){ selectSquare = 0;}
			else if (result === 1) { selectSquare = 6;}
			else if (result === 2) { selectSquare = 7;}
			board[selectSquare] = player1;
			
		}
		else if (flag15 === true){
			var result = Math.floor(Math.random()*3); 
			if (result === 0){ selectSquare = 0;}
			else if (result === 1) { selectSquare = 2;}
			else if (result === 2) { selectSquare = 5;}
			board[selectSquare] = player1;
			
		}
		else if (flag16 === true){
			var result = Math.floor(Math.random()*3); 
			if (result === 0){ selectSquare = 0;}
			else if (result === 1) { selectSquare = 2;}
			else if (result === 2) { selectSquare = 3;}
			board[selectSquare] = player1;
		}
		else if (flag17 === true){
			var result = Math.floor(Math.random()*3); 
			if (result === 0){ selectSquare = 7;}
			else if (result === 1) { selectSquare = 2;}
			else if (result === 2) { selectSquare = 8;}
			board[selectSquare] = player1;
			
		}
		else if (flag18 === true){
			var result = Math.floor(Math.random()*3); 
			if (result === 0){ selectSquare = 1;}
			else if (result === 1) { selectSquare = 2;}
			else if (result === 2) { selectSquare = 8;}
			board[selectSquare] = player1;
			
		}
		else {
		   do {
		    selectSquare = Math.floor(Math.random()*9);   // Random number between 0-8
	
	       }while (board[selectSquare] !== notGone);
	       board[selectSquare] = player1;	
	   } 	
	}
	
	else {	
		do {
		selectSquare = Math.floor(Math.random()*9);   // Random number between 0-8
	
	}while (board[selectSquare] !== notGone);
	
	board[selectSquare] = player1;
		
	} 	
	return;
}



function write(){
		
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	writeMouseHighlight();
	writeWinHighlight();
	writeGrid();
	fillGrid();
			
		function writeMouseHighlight(){
			
			if (gameOver){
				return;
			}
			
			var squareNum = getSquareByLocation(mouse.x, mouse.y),
				squareLocation = getSquareCoord(squareNum);
			
			
			if (board[squareNum] === notGone) {
				ctx.fillStyle = 'rgba(255,255,255,0.3)';
				ctx.fillRect(squareLocation.x, squareLocation.y, squareSize, squareSize);
			
				ctx.save();
				ctx.strokeStyle = 'rgba(255,255,255,0.85)';
				ctx.translate(squareLocation.x + squareSize/2, squareLocation.y + squareSize/2);
			
				if (currentPlayer === X){
					writeX();
				}
				else {
					writeO();
				}
			
				ctx.restore();
			}
			else {
				ctx.fillStyle = 'rgba(255,0,0,0.3)';
				ctx.fillRect(squareLocation.x, squareLocation.y, squareSize, squareSize);
			}
		}

	
		function writeWinHighlight(){
			
			if (gameOver){
				ctx.fillStyle = 'rgba(0,0,255,0.35)';
				winSquares.forEach(function(i){
					var squareLocation = getSquareCoord(i);
					ctx.fillRect(squareLocation.x, squareLocation.y, squareSize, squareSize);
				});
			
			}
		}
 
	
		function writeGrid() {
			
			ctx.strokeStyle = "white";
			ctx.lineWidth = 10;
			
			ctx.beginPath();
			ctx.moveTo(squareSize, 0);
			ctx.lineTo(squareSize, canvas.height);
			ctx.closePath();
			ctx.stroke();
			
			
			ctx.beginPath();
			ctx.moveTo( 2* squareSize, 0);
			ctx.lineTo( 2* squareSize, canvas.height);
			ctx.closePath();
			ctx.stroke();
			
			
			ctx.beginPath();
			ctx.moveTo(0, squareSize);
			ctx.lineTo(canvas.width, squareSize);
			ctx.closePath();
			ctx.stroke();
			
			
			ctx.beginPath();
			ctx.moveTo(0, 2 * squareSize);
			ctx.lineTo(canvas.width, 2 * squareSize);
			ctx.closePath();
			ctx.stroke();
			
			
		}
		
		function fillGrid() {
			
			for (var i =0; i < board.length; i++){
				
				ctx.strokeStyle = "white";
				ctx.lineWidth = 5;
				var Location = getSquareCoord(i);
				ctx.save();
				ctx.translate(Location.x + squareSize/2, Location.y + squareSize/2);  // Move origin to center of square
				
				if (board[i] === X) {
					
					writeX();
					
				}else if (board[i] === O){
					
					writeO();
					
				}
				ctx.restore();		
			}
		}
		
		function writeX(){
			
			ctx.beginPath();
			ctx.moveTo(-squareSize/3, -squareSize/3);
			ctx.lineTo(squareSize/3, squareSize/3);
			ctx.moveTo(squareSize/3, -squareSize/3);
			ctx.lineTo(-squareSize/3, squareSize/3);
			ctx.closePath();
			ctx.stroke();
			
		}
		
		function writeO(){
			
			ctx.beginPath();
			ctx.arc(0, 0, squareSize/3, 0, Math.PI*2);
			ctx.closePath();
			ctx.stroke();
			
		}
	
		
		requestAnimationFrame(write);
}



	function getSquareCoord(square){     
		
	var x = (square % 3) * squareSize;
	var y = Math.floor(square / 3) * squareSize;
		
		return {
			
			'x': x,
			'y': y,
		};
		
	}

	function getSquareByLocation(x, y){  // pass in Location get square number
	
		return (Math.floor(x / squareSize) % 3) + Math.floor(y / squareSize) * 3;
			

}    
	
write();
    



