
document.addEventListener('DOMContentLoaded',() => {
    const gameContainer = document.querySelector('.game');
    const resetBtn = document.querySelector('.reset-btn');
    const movesDisplay = document.querySelector('.moves');
    const timerDisplay = document.querySelector('.timer');
    
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let timer = 0;
    let timerInterval;
    let gameStarted = false;
    
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', 
                    '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔'];
    
    function initGame() {
        // Clear the game container
        gameContainer.innerHTML = '';
        cards = [];
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        timer = 0;
        gameStarted = false;

        movesDisplay.textContent = 'Moves: 0';
        timerDisplay.textContent = 'Time: 0s';
        
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        
        // Create pairs of cards
        const gameCards = emojis.slice(0, 8).concat(emojis.slice(0, 8));

        shuffleArray(gameCards);

        gameCards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.index = index;
            card.dataset.emoji = emoji;
            card.addEventListener('click', flipCard);
            gameContainer.appendChild(card);
            cards.push(card);
        });
    }   
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function flipCard() {
        if (this.classList.contains('flipped') || 
            this.classList.contains('matched') || 
            flippedCards.length === 2) {
            return;
        }
        if (!gameStarted) {
            startTimer();
            gameStarted = true;
        }

        this.classList.add('flipped');
        this.textContent = this.dataset.emoji;
        flippedCards.push(this);
        
        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = `Moves: ${moves}`;
            
            if (flippedCards[0].dataset.emoji === flippedCards[1].dataset.emoji) {

                flippedCards.forEach(card => {
                    card.classList.add('matched');
                });
                matchedPairs++;
                flippedCards = [];
                
                if (matchedPairs === 8) {
                    endGame();
                }
            } else {
                // No match, flip back after delay
                setTimeout(() => {
                    flippedCards.forEach(card => {
                        card.classList.remove('flipped');
                        card.textContent = '';
                    });
                    flippedCards = [];
                }, 1000);
            }
        }
    }
    
    function startTimer() {
        timerInterval = setInterval(() => {
            timer++;
            timerDisplay.textContent = `Time: ${timer}s`;
        }, 1000);
    }

    function endGame() {
        clearInterval(timerInterval);
        
        const overlay = document.getElementById('win-overlay');
        const stats = document.getElementById('final-stats');
        stats.textContent = `You finished in ${moves} moves and ${timer} seconds!`;
        overlay.style.display = 'flex';

        const fireworkInterval = setInterval(createFirework, 300);
        
        setTimeout(() => clearInterval(fireworkInterval), 6000);
    }

    function createFirework() {
        const overlay = document.getElementById('win-overlay');
        const particleCount = 20;
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'firework';
            
            const angle = (i / particleCount) * Math.PI * 2;
            const velocity = 50 + Math.random() * 50;
            const xDestination = Math.cos(angle) * velocity;
            const yDestination = Math.sin(angle) * velocity;

            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.setProperty('--x', `${xDestination}px`);
            particle.style.setProperty('--y', `${yDestination}px`);

            overlay.appendChild(particle);
            setTimeout(() => particle.remove(), 1000);
        }
    } 
    
    // Reset button event listener
    resetBtn.addEventListener('click', initGame);
 
    initGame();
});