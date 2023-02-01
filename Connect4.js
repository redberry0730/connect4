const BLANK = 0;
const YELLOW = 1;
const RED = 2;

export class Connect4 {
    constructor(canvas, messageBox) {
        /*
        Initialize member variables, including a blank board
        */
        this.canvas = canvas;
        this.messageBox = messageBox;
        this.board = [];
        for (let i = 0; i < 42; i++) {
            this.board.push(BLANK);
        }
        messageBox.innerHTML = "Let the game begin! Yellow's turn.";
        this.player = YELLOW;
        this.gameOver = false;
    }

    getBoardPiece(i, j) {
        /*
        Return the value of the piece in row i column j. Top-left is (0,0).
        */

        return this.board[i * 7 + j];
    }

    setBoardPiece(i, j, value) {
        /*
        Overwrite the value of the piece in row i column j. Top-left is (0,0).
        */

        this.board[i * 7 + j] = value;
    }

    clickHandler(e) {
        /*
        Handle a click event. This means drop a piece in the
        appropriate column and check if the game is over.
        */
        if (this.gameOver) {
            return;
        }
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const column = Math.floor(x / this.canvas.width * 7);
        this.dropPiece(column);
        this.drawBoard();
        this.gameLogic();
    }

    dropPiece(column) {
        /*
        Update board and messageBox by dropping a piece in the given column.
        */

        for (let i = 5; i >= 0; i--) {
            if (this.getBoardPiece(i, column) == BLANK) {
                this.setBoardPiece(i, column, this.player);
                this.togglePlayer();
                return;
            }
            else {
                this.messageBox.innerHTML = "This column is full!<br>Please select a different column."
            }
        }        
    }

    togglePlayer() {
        /*
        Switch whose turn it is.
        */
        if (this.player === YELLOW) {
            this.player = RED;
            this.messageBox.innerHTML = "Red's turn.";
        } else if (this.player === RED) {
            this.player = YELLOW;
            this.messageBox.innerHTML = "Yellow's turn.";
        }
    }

    gameLogic() {
        /*
        Determine if the current board is an end state and
        if so, end the game with a message.
        */
        const wh = this.horizontalWinner();
        const wv = this.verticalWinner();
        const wd = this.diagonalWinner();
        if (wh === YELLOW || wv === YELLOW || wd === YELLOW) {
            this.messageBox.innerHTML = "Yellow wins! Game over.";
            this.gameOver = true;
        }
        if (wh === RED || wv === RED || wd === RED) {
            this.messageBox.innerHTML = "Red wins! Game over.";
            this.gameOver = true;
        }

        let count = 0;
        for (let j = 0; j < 7; j++) {
            if (this.getBoardPiece(0, j) != BLANK) {
                count += 1;
            }
        }
        if (count == 7) {
            this.messageBox.innerHTML = "It's a tie! Game over.";
            this.gameOver = true;
        }
    }

    horizontalWinner() {
        /*
        Determine if there is a player with 4 adjacent horizontal pieces.
        If so, return which player it is. Otherwise return null;
        */        

        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 4; j++) {
                let curr = this.getBoardPiece(i, j);
                if (curr != BLANK) {
                    if (curr == this.getBoardPiece(i, j+1)
                        && curr == this.getBoardPiece(i, j+2)
                        && curr == this.getBoardPiece(i, j+3)) {
                            return curr;
                    }
                }
            }
        }
       return null;
    }
    
    verticalWinner() {
        /*
        Determine if there is a player with 4 adjacent vertical pieces.
        If so, return which player it is. Otherwise return null.
        */

        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 3; j++) {
                let curr = this.getBoardPiece(j, i);
                if (curr != BLANK) {
                    if (curr == this.getBoardPiece(j+1, i)
                        && curr == this.getBoardPiece(j+2, i)
                        && curr == this.getBoardPiece(j+3, i)) {
                            return curr;
                    }
                }
            }
        }
        return null;
    }

    diagonalWinner() {
        /*
        Determine if there is a player with 4 adjacent diagonal pieces.
        If so, return which player it is. Otherwise return null.
        */

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 4; j++) {
                let curr = this.getBoardPiece(i, j);
                if (curr != BLANK) {
                    if (curr == this.getBoardPiece(i+1, j+1) 
                        && curr == this.getBoardPiece(i+2, j+2) 
                        && curr == this.getBoardPiece(i+3, j+3)) {
                            return curr;
                    }
                }
            }
        }
        for (let i = 3; i < 6; i++) {
            for (let j = 0; j < 4; j++) {
                let curr = this.getBoardPiece(i, j);
                if (curr != BLANK) {
                    if (curr == this.getBoardPiece(i-1, j+1) 
                        && curr == this.getBoardPiece(i-2, j+2) 
                        && curr == this.getBoardPiece(i-3, j+3)) {
                            return curr;
                    }
                }
            }
        }
        return null;
    }

    drawBoard() {
        /*
        Clear the drawing area and draw the board
        */
        this.drawBackground();
        const rowHeight = this.canvas.height / 6;
        const columnWidth = this.canvas.width / 7;
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 7; j++) {
                const cx = j * columnWidth + columnWidth / 2;
                const cy = i * rowHeight + rowHeight / 2;
                let color = '#ffffff';
                if (this.getBoardPiece(i, j) === YELLOW) {
                    color = '#ffff00';
                } else if (this.getBoardPiece(i, j) === RED) {
                    color = '#ff0000';
                }
                this.drawPiece(cx, cy, color);
            }
        }
    }

    drawBackground() {
        /*
        Clear the drawing area
        */
        let context = this.canvas.getContext('2d');
        context.fillStyle = '#1ba8c4';
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawPiece(cx, cy, color) {
        /*
        Draw a piece at (cx, cy) with given color
        */
        let context = this.canvas.getContext('2d');
        const radius = this.canvas.width / 20;
        context.fillStyle = color;
        context.beginPath();
        context.arc(cx, cy, radius, 0, 2 * Math.PI);
        context.fill();
    }
}