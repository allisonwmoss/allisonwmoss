//Stardew Valley copyright 2016-2021 ConcernedApe LLC. 
//Please see Footnotes at end for sources/references of certain code blocks. Code blocks with a footnote are denoted like this:
//*number

//-------------------------------Global goodies--------------------------------------

//Establishes the starting difficulty of the game, and allows for the difficulty to increase with each subsequent round. Establishes the delay necessary for the sequence animation to run before the player is prompted to provide their echo sequence. 
let playerLevel = 0;
let animationDelay = (playerLevel * 500) + 500;
let winCondition = 0;

//Establish empty arrays for the possible colors the player will be shown, the randomly generated color sequence, and player's echo sequence.
let junimoColors = ['red', 'yellow', 'blue', 'purple', 'green']
let colorSequence = []
let echoSequence = []

//Grab our junimo divs, instruction box div, and start button

const difficultyDivs = document.getElementsByClassName('difficulty-junimo')
const gameplayContainer = document.getElementById('gameplay')
gameplayContainer.style.display = 'none';
const startButton = document.getElementById('game-button')
const resetButton = document.getElementById('reset-button')
const instruction = document.getElementById('instruction')
const scoreBox = document.getElementById('score-box')

const difficultyContainer = document.getElementById('difficulty-selection')

const gameModeOptions = [
    { id: 'green', mode: 'easy', playerLevel: 1, winCondition: 4 },
    { id: 'yellow', mode: 'medium', playerLevel: 3, winCondition: 6 },
    { id: 'red', mode: 'hard', playerLevel: 5, winCondition: 8 },
    { id: 'purple', mode: 'prairieking', playerLevel: 1, winCondition: Infinity }
]

const gameModeHandler = (e) => {
    const colorId = e.currentTarget.id
    const gameModeSelection = gameModeOptions.find(element => element.id === colorId)
    startGameMode(gameModeSelection)
}

//These two event handlers animate the junimo divs up and down when you hover on them. 
const junimoHoverEffectUp = (e) => {
    const junimo = e.currentTarget
    junimo.style.transform = 'translateY(-50px)'
    junimo.style.transition = '0.3s ease-in;'
    // junimoBounce(junimo)
}
const junimoHoverEffectDown = (e) => {
    const junimo = e.currentTarget
    junimo.style.transform = 'translateY(0px)'
    junimo.style.transition = '0.3s ease-in;'
}

for (let div of difficultyDivs) {
    div.addEventListener('click', gameModeHandler)
    div.addEventListener('mouseenter', junimoHoverEffectUp)
    div.addEventListener('mouseleave', junimoHoverEffectDown)
}

const startGameMode = (gameModeSelection) => {
    playerLevel = gameModeSelection.playerLevel
    console.log(playerLevel)
    winCondition = gameModeSelection.winCondition
    console.log(winCondition)
    animationDelay = (playerLevel * 500) + 500;
    console.log(animationDelay)
    while (difficultyContainer.firstChild) {
        difficultyContainer.removeChild(difficultyContainer.firstChild)
    }
    difficultyContainer.style.display = 'none';
    const junimoContainer = document.getElementById('junimo-container')
    for (let color of junimoColors) {
        const newJunimoDiv = document.createElement('div');
        newJunimoDiv.setAttribute('class', 'junimo');
        newJunimoDiv.setAttribute('id', color)
        newJunimoDiv.addEventListener('click', getPlayerResponse);
        newJunimoDiv.addEventListener('mouseenter', junimoHoverEffectUp)
        newJunimoDiv.addEventListener('mouseleave', junimoHoverEffectDown)
        junimoContainer.append(newJunimoDiv)
    }
    gameplayContainer.style.display = 'flex'
    playRound(playerLevel, animationDelay)
}

const allJunimos = document.getElementsByClassName('junimo')
console.log(allJunimos)

//--------------------------------GAME FUNCTIONS------------------------------------------

//This function checks if the player has won the game. If they have, it will congratulate them and encourage them to reset and play again. If they haven't, it will initiate the next round. 
const checkForWinCondition = () => {
    if (playerLevel === winCondition) {
        console.log('win condition met')
        newInstruction('Congratulations, you won! Press Reset to play again.')
        return
    } else {
        console.log('win condition not met')
        resetForNextTurn()
    }
}

//This function streamlines the process of flashing up a new instruction or feedback message for the player. 
const newInstruction = (message) => {
    instruction.innerHTML = "";
    const newH2 = document.createElement('h2')
    newH2.innerText = message;
    instruction.append(newH2)
    console.log(message)
}

//This function updates the user's level, which corresponds to the difficulty of each round, as well as adding a new "point" for the user to see in the form of a stardrop.
const updateScore = () => {
    playerLevel++
    animationDelay = (playerLevel * 500) + 500;
    const newStardrop = document.createElement('div')
    newStardrop.classList.add('stardrop')
    scoreBox.append(newStardrop)
}

//This function runs if the player gets the pattern correct. It adds a message that the player was correct, updates the player's level and score, and resets everything needed for the next round.
const correct = () => {
    newInstruction('Correct!')
    updateScore();
    checkForWinCondition();
}
//This function runs if the player gets the pattern incorrect. It removes all of the player's stardrops and adds a message that the pattern was wrong, and instructs the player to click Reset to start over. 
const incorrect = () => {
    scoreBox.innerHTML = ""
    newInstruction('Oh no, you got the pattern wrong! Click Reset to play again.')
}

//This function waits three seconds, resets all values needed to play another round, and starts another round. The delay is necessary, because without it, the player will never actually see the message from the correct function indicating that they got the sequence correct--it just starts the next round, which is confusing. 
const resetForNextTurn = async () => {
    await delay(3000)
    colorSequence = []
    echoSequence = []
    instruction.innerHTML = ""
    playRound(playerLevel, animationDelay)
}



//*****Deprecated by new difficulty choice, will need to fix******
//This function allows the player to reset the game to a neutral state so they can start over. 
const hardReset = () => {
    colorSequence = []
    echoSequence = []
    instruction.innerHTML = ""
    scoreBox.innerHTML = "";
    playerLevel = 1;
    animationDelay = (playerLevel * 500) + 500
    playRound(playerLevel, animationDelay)
}


//*3
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

//This function pulls the color id from a junimo div clicked by the player and adds it to the echo sequence. It then checks if the player has at least entered the right number of items in the echo sequence. If the player has, it will check if the echo sequence and the color sequence are the same, and run the correct or incorrect functions accordingly. 
const getPlayerResponse = (e) => {
    const junimoColor = e.currentTarget.id
    console.log(junimoColor)
    echoSequence.push(junimoColor)
    const checkIfCorrect = () => {
        if (echoSequence.length === colorSequence.length) {
            if (compareSequences(echoSequence, colorSequence) === 0) {
                correct()
            } else if (compareSequences(echoSequence, colorSequence) === 1) {
                incorrect()
            }
        }
    }
    checkIfCorrect();
}



//This function generates the random sequence of junimo colors that the player will be shown each round, logs that sequence to the console (for debugging), and returns the color sequence
const getColorSequence = (playerLevel) => {
    for (let i = 0; i < playerLevel; i++) {
        const randIndex = Math.floor(Math.random() * junimoColors.length)
        colorSequence.push(junimoColors[randIndex])
    }

    //This function checks if the player is about to be given a sequence that is all of the same color, since this would make for a really easy round. It does this by creating an array of the same length as the color sequence that contains only the first color of the color sequence, then running the versatile compareSequences function to determine if both are the same. If they perfectly match, we know it's a sequence of all one color, so it empties the color sequence array and starts the function over. Otherwise, it returns the color sequence. 
    const checkIfAllTheSame = (colorSequence) => {
        if (playerLevel === 1) {
            // console.log(colorSequence)
            return colorSequence;
        } else {
            let first = colorSequence[0]
            let arrOfFirst = []
            for (let i = 0; i < colorSequence.length; i++) {
                arrOfFirst.push(first)
            }
            if (compareSequences(colorSequence, arrOfFirst) === 0) {
                colorSequence = [];
                getColorSequence(playerLevel)
            } else {
                return colorSequence;
            }
        }
    }
    checkIfAllTheSame(colorSequence)
    console.log(colorSequence)
    return colorSequence;
}

//this function makes a given junimo div bounce up, then back down to baseline after 200 miliseconds
const junimoBounce = (junimoDiv) => {
    junimoDiv.style.transform = 'translateY(-70px)'
    junimoDiv.style.transition = '0.3s ease-in;'
    setTimeout(() => {
        junimoDiv.style.transform = 'translateY(0px)'
        junimoDiv.style.transition = '0.3s ease-in;'
    }, 200)
}

//This function creates a delay in the program for a given number of miliseconds, allowing animations to finish running before a prompt is given or giving the player time to read a prompt before moving on.
//*2
const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

//This function initiates the player's turn. It first waits for the animation to finish running, then prompts the player to echo back the sequence. 
const playerTurn = async (animationDelay) => {
    await delay(animationDelay)
    newInstruction('It\'s your turn!')
}

//This function calls the getColorSequence to get a sequence of five random colors. It then creates an empty array to hold the corresponding junimo sequence to be animated, and fills that array accordingly based on the random sequence returned by getColorSequence. Finally, it runs the animation sequence.
const showSequence = async (playerLevel) => {
    getColorSequence(playerLevel)
    let junimoSequence = [];
    for (let i = 0; i < colorSequence.length; i++) {
        let color = colorSequence[i];
        junimoSequence.push(allJunimos.namedItem(color))
    }

    //This function uses setTimeout to make each junimo bounce up 500 miliseconds after the previous one, allowing them to bounce one at a time rather than all at once. 
    //*1
    const animateJunimos = (junimoSequence) => {
        junimoSequence.forEach((junimoDiv, i) => {
            (setTimeout(() => {
                junimoBounce(junimoDiv)
            }, i * 500))
        })
    }
    animateJunimos(junimoSequence)
}

//This function runs the main game actions. It takes an argument of playerLevel, which will correspond to the player's level as they advance through the game, and which determines the difficulty of each round. It will show the animated random color sequence, then once that is done, it will prompt the player to respond by echoing the sequence.
const playRound = async (playerLevel, animationDelay) => {
    showSequence(playerLevel).then(playerTurn(animationDelay))
}

startButton.addEventListener('click', () => {
    playRound(playerLevel, animationDelay)
})
resetButton.addEventListener('click', hardReset)


//PSEUDOCODE / PLANNING

//MVP

// Offer to explain the game to me before playing.
    //This will use a modal box that opens when you click a button and hides when you click out of it. 
// Show me what the correct pattern is that I need to match, using animation of the Junimos to indicate the colors of the pattern. x
// Animate each Junimo when I click or hover over it, so I know which one I'm targeting.
// Allow me to restart the game at any time.
// Tell me when I get the pattern correct, and track my score in a way that I can see. 
// Inform me that I have lost if I get the pattern incorrect. 
// Inform me when I win the game.

//STRETCH/IF TIME ALLOWS

// Use a modal to have the game rules appear in a box, which I can then click out of to hide.
// Show me a cute animation of all the junimos jumping up and down at random when I win. 
// Give me an option of how many rounds I'd like to play, like Easy, Medium, and Hard modes, so that I can ease into the game or really put my skills to the test. 
// Require me to repeat the given pattern within a certain amount of time, and show me the time I have left as it ticks down. ()







//SOURCES/FOOTNOTES
//*1**This code block allows for each junimo to jump up on its own, then wait 500 ms before the next one jumps. Credit to Travis Horn, https://travishorn.com/delaying-foreach-iterations-2ebd4b29ad30 , for this solution for iterating over an array with a set delay between each item. 
//*2**This simple function allows me to create an artificial delay of a few miliseconds anywhere in the program that I need it, such as when I need to allow the player a few seconds to read an instruction before moving on. Credit to Daniel Sasse, https://dev.to/dsasse07/wait-for-it-implementing-a-sleep-function-in-js-2oac.
///*3 My dad, who is not a Javascript guy but is a software engineer, helped me brainstorm on this array comparison issue, and we reached this solution collaboratively. 