// =============================================
// GREEDY: THE DICE GAME
// Complete rewrite with full scoring logic
// =============================================

// ---- GAME STATE ----
const state = {
    dice: [0, 0, 0, 0, 0, 0],       // Current face values (1-6)
    selected: [false, false, false, false, false, false],  // Player-selected this roll
    held: [false, false, false, false, false, false],      // Locked in from prev rolls
    scores: [0, 0],                   // Banked scores [p1, p2]
    turnScore: 0,                     // Points accumulated this turn (banked sub-rolls)
    currentPlayer: 0,                 // 0 = P1, 1 = P2
    hasRolled: false,                 // Has player rolled at least once this turn
    onTheBoard: [false, false],       // Has each player scored 500+ to get on the board
    finalRound: false,                // True when someone hits 10,000
    finalRoundPlayer: -1,            // Who triggered final round
    gameOver: false,
};

// ---- SCORING ENGINE ----

/**
 * Calculate score for a given set of dice values.
 * Returns { score, scoringIndices }
 */
function calculateScore(diceValues) {
    const counts = [0, 0, 0, 0, 0, 0]; // index 0 = face 1, etc.
    diceValues.forEach(v => counts[v - 1]++);

    let score = 0;

    // Check for straight (1-2-3-4-5-6)
    if (counts.every(c => c === 1)) return { score: 1500, allScore: true };

    // Check for three pairs
    const pairs = counts.filter(c => c === 2).length;
    if (pairs === 3) return { score: 1500, allScore: true };

    // Count up combos
    for (let face = 1; face <= 6; face++) {
        const count = counts[face - 1];
        if (count === 0) continue;

        const threeOfAKind = face === 1 ? 1000 : face * 100;

        if (count >= 3) {
            const multiplier = count - 2; // 3=1x, 4=2x, 5=3x, 6=4x
            score += threeOfAKind * multiplier;
            // Singles beyond the three-of-a-kind
            // (already counted in multiplier for 4+)
        } else {
            // Singles: only 1s and 5s score alone
            if (face === 1) score += count * 100;
            if (face === 5) score += count * 50;
        }
    }

    return { score, allScore: false };
}

/**
 * Calculate score for the currently SELECTED dice only.
 */
function getSelectedScore() {
    const selectedValues = state.dice.filter((_, i) => state.selected[i]);
    if (selectedValues.length === 0) return 0;
    return calculateScore(selectedValues).score;
}

/**
 * Check if a set of dice values contains ANY scoring dice.
 */
function hasAnyScore(diceValues) {
    if (diceValues.length === 0) return false;
    return calculateScore(diceValues).score > 0;
}

/**
 * Check which individual dice can score (for UI hints).
 */
function getScoringDiceIndices(diceValues, indices) {
    const scoring = [];
    diceValues.forEach((v, i) => {
        if (v === 1 || v === 5) scoring.push(indices[i]);
    });
    // Also flag three-of-a-kind groups
    const counts = {};
    diceValues.forEach((v, i) => {
        if (!counts[v]) counts[v] = [];
        counts[v].push(indices[i]);
    });
    Object.values(counts).forEach(group => {
        if (group.length >= 3) group.forEach(i => { if (!scoring.includes(i)) scoring.push(i); });
    });
    return scoring;
}

// ---- DICE RENDERING ----
const FACE_NAMES = ['one', 'two', 'three', 'four', 'five', 'six'];

function renderDie(index, value) {
    if (!value) return;
    const img = document.getElementById(`die${index + 1}`);
    img.src = `assets/images/${FACE_NAMES[value - 1]}.jpg`;
}

function renderAllDice() {
    state.dice.forEach((val, i) => renderDie(i, val));
}

// ---- UNUSED PIP LAYOUTS (kept for reference) ----
const PIP_LAYOUTS = {
    1: [[{ gridArea: '2/2' }]],
    2: [[{ gridArea: '1/1' }], [{ gridArea: '3/3' }]],
    3: [[{ gridArea: '1/1' }], [{ gridArea: '2/2' }], [{ gridArea: '3/3' }]],
    4: [[{ gridArea: '1/1' }], [{ gridArea: '1/3' }], [{ gridArea: '3/1' }], [{ gridArea: '3/3' }]],
    5: [[{ gridArea: '1/1' }], [{ gridArea: '1/3' }], [{ gridArea: '2/2' }], [{ gridArea: '3/1' }], [{ gridArea: '3/3' }]],
    6: [[{ gridArea: '1/1' }], [{ gridArea: '1/3' }], [{ gridArea: '2/1' }], [{ gridArea: '2/3' }], [{ gridArea: '3/1' }], [{ gridArea: '3/3' }]],
};



function updateDieClasses() {
    for (let i = 0; i < 6; i++) {
        const el = document.getElementById(`die${i + 1}`);
        el.className = 'die';
        if (state.held[i]) el.classList.add('held');
        else if (state.selected[i]) el.classList.add('selected');
    }
}

// ---- UI UPDATES ----

function setAlert(message, type = '') {
    const box = document.getElementById('alert-box');
    box.textContent = message;
    box.className = 'alert-box' + (type ? ` ${type}` : '');
}

function updateScoreDisplay() {
    document.getElementById('p1score').textContent = state.scores[0].toLocaleString();
    document.getElementById('p2score').textContent = state.scores[1].toLocaleString();

    // Highlight active player card
    document.getElementById('p1-card').classList.toggle('active', state.currentPlayer === 0);
    document.getElementById('p2-card').classList.toggle('active', state.currentPlayer === 1);

    // Turn score
    const selectedScore = getSelectedScore();
    const total = state.turnScore + selectedScore;
    document.getElementById('turn-score').textContent = total.toLocaleString();

    if (selectedScore > 0) {
        document.getElementById('selected-score-label').textContent =
            `(+${selectedScore.toLocaleString()} selected)`;
    } else {
        document.getElementById('selected-score-label').textContent = '';
    }
}

function updateTurnLabel() {
    const p = state.currentPlayer + 1;
    let label = `Player ${p}'s Turn`;
    if (state.finalRound && state.currentPlayer !== state.finalRoundPlayer) {
        label += ' — Final Turn!';
    }
    document.getElementById('turn-label').textContent = label;
}

function setButtonStates() {
    const rollBtn = document.getElementById('roll-button');
    const endBtn = document.getElementById('end-turn-button');

    // Can roll if: game not over AND (haven't rolled yet OR have selected at least one die)
    const hasSelected = state.selected.some(s => s);
    const canRoll = !state.gameOver && (!state.hasRolled || hasSelected);
    rollBtn.disabled = !canRoll;

    // Can end turn if: have rolled AND have accumulated some turn score AND not zero
    const selectedScore = getSelectedScore();
    const totalTurnScore = state.turnScore + selectedScore;
    const canEnd = state.hasRolled && totalTurnScore > 0 && !state.gameOver;
    endBtn.disabled = !canEnd;
}

// ---- ROLL LOGIC ----

function rollClick() {
    if (state.gameOver) return;

    // Lock in selected dice as held
    for (let i = 0; i < 6; i++) {
        if (state.selected[i]) {
            state.held[i] = true;
            state.selected[i] = false;
        }
    }

    // Add selected score to turn score before rolling
    // (already added when selecting, so recalculate cleanly)
    // Actually: recalculate turn score from all held dice
    const heldValues = state.dice.filter((_, i) => state.held[i]);
    if (heldValues.length > 0) {
        state.turnScore = calculateScore(heldValues).score;
    }

    // Check if all dice are held — if so, reset all dice (hot dice!)
    const heldCount = state.held.filter(h => h).length;
    if (heldCount === 6) {
        state.held = [false, false, false, false, false, false];
        state.selected = [false, false, false, false, false, false];
        setAlert('🔥 Hot dice! Roll all six again!', 'success');
    }

    // Roll un-held dice
    const rollingIndices = [];
    for (let i = 0; i < 6; i++) {
        if (!state.held[i]) {
            state.dice[i] = Math.floor(Math.random() * 6) + 1;
            rollingIndices.push(i);
        }
    }

    state.hasRolled = true;

    // Animate rolling dice
    rollingIndices.forEach(i => {
        const el = document.getElementById(`die${i + 1}`);
        el.classList.add('rolling');
        setTimeout(() => el.classList.remove('rolling'), 300);
    });

    setTimeout(() => {
        renderAllDice();
        updateDieClasses();

        // Check for farkle (no scoring dice among un-held)
        const freeIndices = [];
        const freeValues = [];
        for (let i = 0; i < 6; i++) {
            if (!state.held[i]) {
                freeIndices.push(i);
                freeValues.push(state.dice[i]);
            }
        }

        if (!hasAnyScore(freeValues)) {
            // FARKLE!
            setAlert('FARKLE! No scoring dice. Turn over — you lose your turn points.', 'farkle');
            state.turnScore = 0;
            // Mark non-scoring dice visually
            freeIndices.forEach(i => document.getElementById(`die${i + 1}`).classList.add('farkled'));
            updateScoreDisplay();
            setTimeout(() => endTurn(true), 1800);
        } else {
            if (!document.getElementById('alert-box').classList.contains('success')) {
                setAlert('Select scoring dice, then Roll again or End Turn.');
            }
            updateScoreDisplay();
            setButtonStates();
        }
    }, 320);

    updateDieClasses();
    setButtonStates();
}

// ---- SELECTION LOGIC ----

function dieClick(index) {
    if (!state.hasRolled) return;
    if (state.held[index]) return; // Can't deselect held dice
    if (state.gameOver) return;

    // Check if this die can score
    const currentVal = state.dice[index];

    state.selected[index] = !state.selected[index];
    updateDieClasses();
    updateScoreDisplay();
    setButtonStates();
}

// ---- END TURN ----

function endTurnClick() {
    if (state.gameOver) return;

    // Lock any currently selected dice
    for (let i = 0; i < 6; i++) {
        if (state.selected[i]) {
            state.held[i] = true;
            state.selected[i] = false;
        }
    }

    const heldValues = state.dice.filter((_, i) => state.held[i]);
    const finalTurnScore = heldValues.length > 0 ? calculateScore(heldValues).score : 0;

    const p = state.currentPlayer;

    // Check on-the-board requirement
    if (!state.onTheBoard[p] && finalTurnScore < 500) {
        setAlert(`Need at least 500 points to get on the board! (You have ${finalTurnScore})`, 'warning');
        return;
    }

    state.onTheBoard[p] = true;
    state.scores[p] += finalTurnScore;
    updateScoreDisplay();

    // Check for win condition
    if (state.scores[p] >= 10000 && !state.finalRound) {
        state.finalRound = true;
        state.finalRoundPlayer = p;
        const other = p === 0 ? 2 : 1;
        setAlert(`Player ${p + 1} hit 10,000! Player ${other} gets one final turn!`, 'success');
        setTimeout(() => endTurn(false), 1500);
        return;
    }

    // Check if final round is over
    if (state.finalRound && state.currentPlayer !== state.finalRoundPlayer) {
        endTurn(false);
        checkWin();
        return;
    }

    setAlert(`Player ${p + 1} banks ${finalTurnScore.toLocaleString()} points!`, 'success');
    setTimeout(() => endTurn(false), 800);
}

function endTurn(wasFarkle) {
    // Switch players
    state.currentPlayer = state.currentPlayer === 0 ? 1 : 0;
    state.turnScore = 0;
    state.hasRolled = false;
    state.held = [false, false, false, false, false, false];
    state.selected = [false, false, false, false, false, false];

    // Reset dice to 1-6 display
    state.dice = [1, 2, 3, 4, 5, 6];
    renderAllDice();
    updateDieClasses();
    updateScoreDisplay();
    updateTurnLabel();
    setButtonStates();

    if (!wasFarkle) {
        setAlert(`Player ${state.currentPlayer + 1}, it's your turn. Roll to begin!`);
    }

    checkWin();
}

function checkWin() {
    if (!state.finalRound) return;

    // Final round is over when the non-triggering player has had their turn
    // (endTurn switches player, so check if we're back to the triggering player)
    if (state.currentPlayer === state.finalRoundPlayer) {
        state.gameOver = true;
        const winner = state.scores[0] > state.scores[1] ? 1 : 2;
        const loser = winner === 1 ? 2 : 1;
        showWinScreen(winner, state.scores[winner - 1], state.scores[loser - 1]);
    }
}

// ---- WIN SCREEN ----

function showWinScreen(winner, winScore, loseScore) {
    const overlay = document.createElement('div');
    overlay.className = 'win-overlay';
    overlay.innerHTML = `
        <div class="win-card">
            <h2>Player ${winner} Wins!</h2>
            <p>Final score: <strong>${winScore.toLocaleString()}</strong> vs ${loseScore.toLocaleString()}</p>
            <button onclick="resetGame()">Play Again</button>
        </div>
    `;
    document.body.appendChild(overlay);
}

// ---- RESET ----

function resetGame() {
    // Remove win overlay if present
    const overlay = document.querySelector('.win-overlay');
    if (overlay) overlay.remove();

    Object.assign(state, {
        dice: [1, 2, 3, 4, 5, 6],
        selected: [false, false, false, false, false, false],
        held: [false, false, false, false, false, false],
        scores: [0, 0],
        turnScore: 0,
        currentPlayer: 0,
        hasRolled: false,
        onTheBoard: [false, false],
        finalRound: false,
        finalRoundPlayer: -1,
        gameOver: false,
    });

    renderAllDice();
    updateDieClasses();
    updateScoreDisplay();
    updateTurnLabel();
    setButtonStates();
    setAlert('New game started. Player 1, roll to begin!');
}

// ---- INIT ----
resetGame();
