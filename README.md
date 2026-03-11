# Greedy: The Dice Game

**A browser-based implementation of the classic push-your-luck dice game Farkle (also known as 10,000)**

---

## 🎲 [Play it here!](https://desinoelle.github.io/Greedy-Game/)

---

## Overview

Greedy is a two-player dice game built with vanilla JavaScript, HTML, and CSS. Players take turns rolling six dice, banking points from scoring combinations, and deciding whether to push their luck for more — or walk away before they lose it all.

The first player to reach **10,000 points** wins, but the other player gets one final turn to beat their score.

---

## How to Play

- Roll the dice and select which ones to score
- You **must** roll at least 500 points to get on the board
- Bank your points and end your turn, or keep rolling the unscored dice to push your luck
- **Warning:** if you roll and score nothing, you lose all points earned that turn

Both players share the same browser window and take turns.

---

## Scoring

| Combination | Points |
|---|---|
| Single 1 | 100 |
| Single 5 | 50 |
| Three 1s | 1,000 |
| Three of a kind (2–6) | Face value × 100 |
| Four of a kind | 2× the three-of-a-kind score |
| Five of a kind | 3× the three-of-a-kind score |
| Six of a kind | 4× the three-of-a-kind score |
| 1–6 straight | 1,500 |
| Three pairs | 1,500 |

---

## Built With

- Vanilla JavaScript
- HTML5 / CSS3

---

## About

Built as a personal project to practice JavaScript logic and DOM manipulation. Greedy was one of my earliest forays into programming game mechanics — scoring combinations, turn management, and push-your-luck risk/reward systems all implemented from scratch.
