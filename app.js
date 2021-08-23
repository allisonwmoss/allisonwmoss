//Stardew Valley copyright 2016-2021 ConcernedApe LLC. 
//.
//Please see Footnotes at end for sources/references of certain code blocks. Code blocks with a footnote are denoted like this:
//*number

//-------------------------------Global goodies--------------------------------------
//Grab our junimo divs, instruction box div, and start button
const allJunimos = document.getElementsByClassName('junimo')
const startButton = document.getElementById('game-button')
const resetButton = document.getElementById('reset-button')
const instruction = document.getElementById('instruction')
const scoreBox = document.getElementById('score-box')

//Establish empty arrays for the possible colors the player will be shown, the randomly generated color sequence, and player's echo sequence.
let junimoColors = []
let colorSequence = []
let echoSequence = []

//Establishes the baseline difficulty of the game, and allows for the difficulty to increase with each subsequent round. Establishes the delay necessary for the sequence animation to run before the player is prompted to provide their echo sequence. 
let playerLevel = 5;
let animationDelay = (playerLevel * 500) + 500;

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
    resetForNextTurn()
}
//This function runs if the player gets the pattern incorrect. It removes all of the player's stardrops and adds a message that the pattern was wrong, and instructs the player to click Reset to start over. 
const incorrect = () => {
    scoreBox.innerHTML = ""
    newInstruction('Oh no, you got the pattern wrong! Click Reset to play again.')
}

//This function waits three seconds, resets all values needed to play another round, and starts another round. The delay is necessary, because without it, the player will never actually see the message from the correct function indicating that they got the sequence correct--it just starts the next round, which is confusing. 
const resetForNextTurn = async () => {
    await delay(3000)
    console.log('delay done!')
    colorSequence = []
    echoSequence = []
    instruction.innerHTML = ""
    playRound(playerLevel)
}

//This function allows the player to reset the game to a neutral state so they can start over. 
const hardReset = () => {
    colorSequence = []
    echoSequence = []
    instruction.innerHTML = ""
    scoreBox.innerHTML = "";
    playerLevel = 5;

}

//*3
//This function compares the echo sequence to the color sequence and checks if all items in the echo are identical to the items in the color sequence. It accomplishes this with a counter variable that increments by one for each identical item found when iterating through both arrays, then comparing the value of the counter variable to the length of the echo sequence. 
//This is necessary because, as i found out, just checking whether array1 === array2 does not actually work. 
const compare = (echoSequence, colorSequence) => {
    let counter = 0;
    for (let i = 0; i < echoSequence.length; i++) {
        if (echoSequence[i] === colorSequence[i]) {
            counter++
        }
    }
    if (counter === echoSequence.length) {
        return 0;
    } else {
        return 1;
    }
}

//This function pulls the color id from a junimo div clicked by the player and adds it to the echo sequence. It then checks if the player has at least entered the right number of items in the echo sequence. If the player has, it will check if the echo sequence and the color sequence are the same, and run the correct or incorrect functions accordingly. 
const getPlayerResponse = (e) => {
    console.log('get player response was called')
    const junimoColor = e.currentTarget.id
    console.log(junimoColor)
    echoSequence.push(junimoColor)
    console.log(echoSequence)
    console.log(colorSequence)
    const checkIfCorrect = () => {
        if (echoSequence.length === colorSequence.length) {
            console.log('length is same!')
            if (compare(echoSequence, colorSequence) === 0) {
                correct()
            } else if (compare(echoSequence, colorSequence) === 1) {
                incorrect()
            }
        }
    }
    checkIfCorrect();
}

//This fills the array of possible colors with the color ids of all the junimo divs on the page and adds an event listener to each junimo div which will call the getPlayerResponse function when clicked
for (let junimo of allJunimos) {
    junimoColors.push(junimo.id)
    junimo.addEventListener('click', getPlayerResponse)
}

//This function generates the random sequence of junimo colors that the player will be shown each round, logs that sequence to the console (for debugging), and returns the color sequence
const getColorSequence = (num) => {
    console.log('color sequence was called')
    for (let i = 0; i < num; i++) {
        const randIndex = Math.floor(Math.random() * junimoColors.length)
        colorSequence.push(junimoColors[randIndex])
    }
    console.log(colorSequence)
    return colorSequence;
}

//this function makes a given junimo div bounce up, then back down to baseline after 200 miliseconds
const junimoBounce = (junimoDiv) => {
    junimoDiv.style.transform = 'translateY(-50px)'
    setTimeout(() => {
        junimoDiv.style.transform = 'translateY(0px)'
    }, 200)
}

//This function just creates a delay in the program for a given number of miliseconds. Currently I'm using it to make the program wait for the end of the junimo animation sequence before it prompts the player to enter their response. This is a temporary bandaid solution until I can really figure out how promises and async functions are supposed to work
//*2
const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

//This function is supposed to run the actions of the player's turn, like waiting for the player to enter 5 colors into the echoSequence array before calling the checkIfCorrect function, but it doesn't work currently. It just uses the delay function to create a delay of a given number of miliseconds to allow the junimo animation to finish before prompting the player to enter their sequence. I tried to use a loop for waiting and checking but it just hung the browser up and never called checkIfCorrect 
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
// Require me to repeat the given pattern within a certain amount of time, and show me the time I have left as it ticks down. 







//SOURCES/FOOTNOTES
//*1**This code block allows for each junimo to jump up on its own, then wait 500 ms before the next one jumps. Credit to Travis Horn, https://travishorn.com/delaying-foreach-iterations-2ebd4b29ad30 , for this solution for iterating over an array with a set delay between each item. 
//*2**This simple function allows me to create an artificial delay of a few miliseconds anywhere in the program that I need it, such as when I need to allow the player a few seconds to read an instruction before moving on. Credit to Daniel Sasse, https://dev.to/dsasse07/wait-for-it-implementing-a-sleep-function-in-js-2oac.
///*3 My dad, who is not a Javascript guy but is a software engineer, helped me brainstorm on this array comparison issue, and we reached this solution collaboratively. 


//CODE GRAVEYARD
// *1
    // junimoSequence.forEach((junimoDiv, i) => {
    //     return new Promise(resolve => {
    //         (setTimeout(() => {
    //             resolve(junimoBounce(junimoDiv))
    //         }, i * 500))
    //     })
    // })

    //*1
    // new Promise(resolve => junimoSequence.forEach((junimoDiv, i) => {
    //     (setTimeout(() => {
    //         (junimoBounce(junimoDiv))
    //     }, i * 500))
    // }))
    // return resolve

// const newH2 = document.createElement('h2')
    // newH2.innerText = "Now it's your turn!"
    // instruction.append(newH2)

    // const getColor = (e) => {
//     const junimoColor = e.currentTarget.id
//     echoSequence.push(junimoColor)
// }

// const checkIfAllTheSame = (sequence) => {
//     //**Credit to @bilal-hungund, Geeks For Geeks, https://www.geeksforgeeks.org/all-elements-in-an-array-are-same-or-not/ , for the inspiration behind this method that checks whether all colors in the sequence array are the same by checking if each one is identical to the first. This function prevents the player from getting an entire sequence of the same color. 
//     let first = sequence[0]
//     for (let i = 1; i < sequence.length; i++) {
//         if (sequence[i] != first) {
//             return
//         }
//         else {
//             getSequence(sequence.length)
//         }
//     }
// }