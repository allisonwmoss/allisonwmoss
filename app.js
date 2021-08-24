//Stardew Valley copyright 2016-2021 ConcernedApe LLC. 

//Please see Footnotes at end for sources/references of certain code blocks. Code blocks with a footnote are denoted like this:
//*number


//Establishes the starting difficulty of the game, and allows for the difficulty to increase with each subsequent round. Establishes the delay necessary for the sequence animation to run before the player is prompted to provide their echo sequence. 
let playerLevel = 0;
let animationDelay = (playerLevel * 500) + 1500;
let winCondition = 0;
// let timeLimit = animationDelay + 3000

//Establish arrays for the possible colors the player will be shown, the randomly generated color sequence, and player's echo sequence. Establish an empty object to hold the player's choice of game mode. 
const junimoColors = ['red', 'yellow', 'blue', 'purple', 'green']
let colorSequence = []
let echoSequence = []
let playerModeChoice = {}

//Grab our junimo divs, instruction box div, and start button
const allJunimos = document.getElementsByClassName('junimo')
const difficultyDivs = document.getElementsByClassName('difficulty-junimo')
const gameplayContainer = document.getElementById('gameplay')
gameplayContainer.style.display = 'none';
const resetButton = document.getElementById('reset-button')
const instruction = document.getElementById('instruction')
const scoreBox = document.getElementById('score-box')
const scoreDiv = document.getElementById('score-div')
const timerBox = document.getElementById('timer-box')
const difficultyContainer = document.getElementById('difficulty-selection')

//Establish the game difficulty modes the player can choose from
const gameModeOptions = [
    { id: 'green-diff', mode: 'easy', playerLevel: 1, winCondition: 4 },
    { id: 'yellow-diff', mode: 'medium', playerLevel: 3, winCondition: 6 },
    { id: 'red-diff', mode: 'hard', playerLevel: 5, winCondition: 8 },
    { id: 'purple-diff', mode: 'prairieking', playerLevel: 1, winCondition: Infinity }
]

//--------------------------------GLOBAL UTILITIES-------------------------------------

//This function streamlines the process of flashing up a new instruction or feedback message for the player. 
const newInstruction = (message, outcome) => {
    instruction.innerHTML = "";
    const newH2 = document.createElement('h2')
    newH2.innerText = message;
    instruction.append(newH2)
    if (outcome) {
        const outcomeDiv = document.createElement('div');
        outcomeDiv.setAttribute('class', 'outcome')
        if (outcome === 'win') {
            outcomeDiv.setAttribute('id', 'win')
        }
        if (outcome === 'lose') {
            outcomeDiv.setAttribute('id', 'lose')
        }
        instruction.append(outcomeDiv)
    }
}

//*1
//This function compares one array to another and determines whether all items in the first are equal to all items in the second. It accomplishes this with a counter variable that increments by one for each identical item found when iterating through both arrays, then comparing the value of the counter variable to the length of the echo sequence. This is necessary because, as i found out, just checking whether array1 === array2 does not actually work. This function is used as both a correctness checker for the echo sequence and an are-they-all-the-same checker for the color sequence.  
const compareSequences = (array1, array2) => {
    let counter = 0;
    for (let i = 0; i < array1.length; i++) {
        if (array1[i] === array2[i]) {
            counter++
        }
    }
    if (counter === array1.length) {
        return 0;
    } else {
        return 1;
    }
}

//This function uses setTimeout to make each junimo bounce up 500 miliseconds after the previous one, allowing them to bounce one at a time rather than all at once.
//*2 (Footnote is for animateJunimos only--junimoBounce is entirely my own work.)
const animateJunimos = (junimoSequence, delay = 500) => {
    junimoSequence.forEach((junimoDiv, i) => {
        (setTimeout(() => {
            //This function makes a given junimo div bounce up, then back down to baseline after 200 miliseconds
            const junimoBounce = (junimoDiv) => {
                junimoDiv.style.transform = 'translateY(-70px)'
                junimoDiv.style.transition = '0.3s ease-in;'
                setTimeout(() => {
                    junimoDiv.style.transform = 'translateY(0px)'
                    junimoDiv.style.transition = '0.3s ease-in;'
                }, 200)
            }
            junimoBounce(junimoDiv)
        }, i * delay))
    })
}



//*3
let timeoutID;
let intervalID;
let playerTimer = 5000;
const turnTimer = () => {
    timerBox.innerText = (playerTimer / 1000)
    intervalID = setInterval(() => {
        playerTimer -= 1000
        timerBox.innerText = (playerTimer / 1000)
    }, 1000)
}
const turnTimeLimit = () => {
    turnTimer()
    timerBox.style.display = 'flex'
    timeoutID = setTimeout(() => {
        clearInterval(intervalID)
        for (let junimo of allJunimos) {
            junimo.style.display = 'none'
        }
        timerBox.style.display = 'none'
        playerTimer = 5000;
        newInstruction('Oh no, you ran out of time! Click Reset to try again.', 'lose')
    }, 5000)

}

for (let div of difficultyDivs) {
    //These two event handlers animate the junimo divs up and down when you hover on them. 
    const junimoHoverEffectUp = (e) => {
        const junimo = e.currentTarget
        junimo.style.transform = 'translateY(-50px)'
        junimo.style.transition = '0.5s ease-in;'
    }
    const junimoHoverEffectDown = (e) => {
        const junimo = e.currentTarget
        junimo.style.transform = 'translateY(0px)'
        junimo.style.transition = '0.5s ease-in;'
    }
    //This event handler pulls the player's game mode selection from the div they clicked and starts the game with the corresponding game mode values. It also hides the difficulty selection container and makes visible the gameplay container, and adds a hover effect to the difficulty selection divs.  
    div.addEventListener('click', (e) => {
        const colorId = e.currentTarget.id
        const gameModeSelection = gameModeOptions.find(element => element.id === colorId)
        const startGameMode = (gameModeSelection) => {
            playerModeChoice = gameModeSelection;
            playerLevel = gameModeSelection.playerLevel
            winCondition = gameModeSelection.winCondition
            animationDelay = (playerLevel * 500) + 1000;
            difficultyContainer.style.display = 'none';
            for (let junimo of allJunimos) {
                junimo.addEventListener('mouseenter', junimoHoverEffectUp)
                junimo.addEventListener('mouseleave', junimoHoverEffectDown)
                junimo.style.display = 'flex'
            }
            gameplayContainer.style.display = 'flex'
            playRound(playerLevel, animationDelay)
        }
        startGameMode(gameModeSelection)
    })
    div.addEventListener('mouseenter', junimoHoverEffectUp)
    div.addEventListener('mouseleave', junimoHoverEffectDown)
}

//This function runs the main game actions. It takes an argument of playerLevel, which will correspond to the player's level as they advance through the game, and which determines the difficulty of each round. It will show the animated random color sequence, then once that is done, it will prompt the player to respond by echoing the sequence.
const playRound = async (playerLevel, animationDelay) => {
    // turnTimeLimit(animationDelay)
    //This function generates the random sequence of junimo colors that the player will be shown each round, logs that sequence to the console (for debugging), and returns the color sequence
    const getColorSequence = (playerLevel) => {
        for (let i = 0; i < playerLevel; i++) {
            const randIndex = Math.floor(Math.random() * junimoColors.length)
            colorSequence.push(junimoColors[randIndex])
        }
        //----The function below is currently out of commission. I determined it was causing a bug where a player playing in easy mode on their second round after a reset would SOMETIMES get a sequence of 4 junimos instead of 2, and I can't for the life of me figure out why, or why it only impacts this one circumstance some of the time. ----
        //This function checks if the player is about to be given a sequence that is all of the same color. It does this by creating an array of the same length as the color sequence that contains only the first color of the color sequence, then running the versatile compareSequences function to determine if both are the same. If they perfectly match, it empties the color sequence array and starts the function over. Otherwise, it returns the color sequence. 
        // const checkIfAllTheSame = (colorSequence) => {
        //     if (colorSequence.length === 1) {
        //         return colorSequence;
        //     } else {
        //         let first = colorSequence[0]
        //         let arrOfFirst = []
        //         for (let i = 0; i < colorSequence.length; i++) {
        //             arrOfFirst.push(first)
        //         }
        //         if (compareSequences(colorSequence, arrOfFirst) === 0) {
        //             colorSequence = [];
        //             getColorSequence(playerLevel)
        //         } else {
        //             return colorSequence;
        //         }
        //     }
        // }
        // checkIfAllTheSame(colorSequence)
        return colorSequence;
    }
    //This function shows the junimo sequence after a 1 second "breather" delay. I found it jarring for the user to have to go straight into the first animation from choosing their game mode. 
    const showSequence = async (playerLevel) => {
        setTimeout(() => {
            getColorSequence(playerLevel)
            let junimoSequence = [];
            for (let i = 0; i < colorSequence.length; i++) {
                let color = colorSequence[i];
                junimoSequence.push(allJunimos.namedItem(color))
            }
            animateJunimos(junimoSequence)
        }, 1000)
    }

    //This function initiates the player's turn. It first waits for the animation to finish running, then prompts the player to echo back the sequence. 
    const playerTurn = async (animationDelay) => {
        setTimeout(() => {
            newInstruction('It\'s your turn!')
            turnTimeLimit()
        }, animationDelay)
    }
    showSequence(playerLevel).then(playerTurn(animationDelay))
}

//This event handler pulls the color id from a junimo div clicked by the player and adds it to the echo sequence. It then checks if the player has at least entered the right number of items in the echo sequence. If the player has, it will check if the echo sequence and the color sequence are the same, and end or move the game along accordingly. 
for (let junimo of allJunimos) {
    junimo.addEventListener('click', (e) => {
        const junimoColor = e.currentTarget.id
        echoSequence.push(junimoColor)
        const checkIfCorrect = async () => {
            if (echoSequence.length === colorSequence.length) {
                clearTimeout(timeoutID)
                clearInterval(intervalID)
                timerBox.style.display = 'none'
                if (compareSequences(echoSequence, colorSequence) === 0) {
                    //This function runs if the player gets the pattern correct. It adds a message that the player was correct, updates the player's level and score, and resets everything needed for the next round.
                    const correct = () => {
                        newInstruction('Correct!')
                        //This function updates the user's level, which corresponds to the difficulty of each round, as well as adding a new "point" for the user to see in the form of a stardrop.
                        const updateScore = () => {
                            playerLevel++
                            animationDelay = (playerLevel * 500) + 1500;
                            const newStardrop = document.createElement('div')
                            newStardrop.classList.add('stardrop')
                            scoreBox.append(newStardrop)
                        }
                        updateScore();
                        //This function checks if the player has won the game. If they have, it will congratulate them, show them a cute animation of randomly bouncing junimos (and temporarily hide the reset button to avoid a bug), and encourage them to reset and play again. If they haven't won the game, it will initiate the next round. 
                        const checkForWinCondition = async () => {
                            if (playerLevel === winCondition) {
                                clearInterval(intervalID)
                                clearTimeout(timeoutID)
                                timerBox.style.display = 'none'
                                resetButton.style.display = 'none'
                                scoreDiv.style.display = 'none'
                                newInstruction('Congratulations, you won!', 'win')
                                let celebrationColorSequence = []
                                let celebrationJunimoSequence = []
                                for (let i = 0; i < 30; i++) {
                                    const randIndex = Math.floor(Math.random() * junimoColors.length)
                                    celebrationColorSequence.push(junimoColors[randIndex])
                                }
                                for (let i = 0; i < 30; i++) {
                                    let color = celebrationColorSequence[i];
                                    celebrationJunimoSequence.push(allJunimos.namedItem(color))
                                }

                                animateJunimos(celebrationJunimoSequence, 100)
                                setTimeout(() => {
                                    for (let junimo of allJunimos) {
                                        junimo.style.display = 'none'
                                    }
                                    resetButton.style.display = 'flex'
                                    scoreDiv.style.display = 'flex'
                                    newInstruction('Click the Reset button to play again.', 'win')
                                }, 3000)
                                return;
                            } else {
                                //This function waits three seconds, resets all values needed to play another round, and starts another round. The delay is necessary, because without it, the player will never actually see the message from the correct function indicating that they got the sequence correct--it just starts the next round, which is confusing. 
                                const resetForNextTurn = async () => {
                                    clearInterval(intervalID)
                                    clearTimeout(timeoutID)
                                    playerTimer = 5000
                                    timerBox.style.display = 'none'
                                    setTimeout(() => {
                                        colorSequence = []
                                        echoSequence = []
                                        instruction.innerHTML = ""
                                        playRound(playerLevel, animationDelay)
                                    }, 3000)

                                }
                                resetForNextTurn()
                            }
                        }
                        checkForWinCondition();
                    }
                    correct();
                } else if (compareSequences(echoSequence, colorSequence) === 1) {
                    //This function runs if the player gets the pattern incorrect. It removes all of the player's stardrops, adds a message that the pattern was wrong, and instructs the player to click Reset to start over. 
                    const incorrect = () => {
                        scoreBox.innerHTML = ""
                        for (let junimo of allJunimos) {
                            junimo.style.display = 'none'
                        }
                        newInstruction('Oh no, you got the pattern wrong! Click Reset to play again.', 'lose')
                    }
                    incorrect()
                }
            }
        }
        checkIfCorrect();
    });
}

//This event handler allows the player to reset the game to a neutral state so they can start over from the game mode selection screen. 
resetButton.addEventListener('click', () => {
    colorSequence = []
    echoSequence = []
    instruction.innerHTML = ""
    scoreBox.innerHTML = "";
    playerLevel = 0;
    winCondition = 0;
    animationDelay = (playerLevel * 500) + 1500
    gameplayContainer.style.display = 'none';
    difficultyContainer.style.display = 'flex'
    clearInterval(intervalID)
    clearTimeout(timeoutID)
    playerTimer = 5000

})

//Countdown timer/player timeout brainstorming
//What do i need to do?
//I want a timeout that starts running when the player's turn starts, waits 5 seconds or so, then tells them they ran out of time, removes the ability for them to get the sequence right after this point, and prompts them to reset. 
//wrap the whole chunk of code that handles the player's response in a setTimeout?
//No, that would just delay the running of all of that code, which is the opposite of what we want. 
//Precede (or follow up? does the order matter?) all of that code with a setTimeout that will fire a function at the end which tells the player they ran out of time, maybe hide all of the junimo divs so they can't click them??? and prompt the player to reset the game and start over. 
//Will the setTimeout need to account for the differing lengths of the animationDelay? Probably




//create an empty div on the page called "timer" or something and save it to a variable
//





//-----------------------SOURCES/FOOTNOTES------------------------------
///*1** My dad, who is not a Javascript guy but is a software engineer, helped me brainstorm on this array comparison issue, and we reached this solution in compareSequences collaboratively. 
//*2**This code block allows for each junimo to jump up on its own, then wait 500 ms before the next one jumps. Credit to Travis Horn, https://travishorn.com/delaying-foreach-iterations-2ebd4b29ad30 , for this solution for iterating over an array with a set delay between each item. 
//*3 Credit to MDN for teaching me how to set and clear a timeout using the returned timeoutID: https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout