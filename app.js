const allJunimos = document.getElementsByClassName('junimo')
const startButton = document.getElementById('game-button')
const instruction = document.getElementById('instruction')
let junimoColors = []
let colorSequence = []
let echoSequence = []

// const getColor = (e) => {
//     const junimoColor = e.currentTarget.id
//     echoSequence.push(junimoColor)
// }

const getPlayerResponse = (e) => {
    console.log('get player response was called')
    const junimoColor = e.currentTarget.id
    echoSequence.push(junimoColor)
}

for (let junimo of allJunimos) {
    junimoColors.push(junimo.id)
    junimo.addEventListener('click', getPlayerResponse)
}

const getColorSequence = (num) => {
    for (let i = 0; i < num; i++) {
        const randIndex = Math.floor(Math.random() * junimoColors.length)
        colorSequence.push(junimoColors[randIndex])
    }
    console.log(colorSequence)
    // checkIfAllTheSame(sequence);
    return colorSequence;
}

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

const junimoBounce = (junimoDiv) => {
    junimoDiv.style.transform = 'translateY(-50px)'
    setTimeout(() => {
        junimoDiv.style.transform = 'translateY(0px)'
    }, 200)
}

//*2
const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const checkIfCorrect = async () => {
    // console.log(echoSequence)
    if (echoSequence.length === colorSequence.length && echoSequence === colorSequence) {
        console.log('correct!')
    } else {
        await delay(1000)
    }
}

const playerTurn = async (ms) => {
    await delay(ms)
    console.log('your turn!')
    return new Promise(resolve => {
        do {
            checkIfCorrect()
        } while (echoSequence.length != colorSequence.length)
    })
    // const newH2 = document.createElement('h2')
    // newH2.innerText = "Now it's your turn!"
    // instruction.append(newH2)
}




const showSequence = () => {
    getColorSequence(5)
    let junimoSequence = [];
    for (let i = 0; i < colorSequence.length; i++) {
        let color = colorSequence[i];
        junimoSequence.push(allJunimos.namedItem(color))
    }

    // *1
    const animateJunimos = (junimoSequence) => {
        junimoSequence.forEach((junimoDiv, i) => {
            (setTimeout(() => {
                junimoBounce(junimoDiv)
            }, i * 500))
        })
    }
    animateJunimos(junimoSequence)
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




}


const gameStart = () => {
    // await showSequence()
    // playerTurn();
    showSequence();
    playerTurn(3000);
}

startButton.addEventListener('click', gameStart)


//PSEUDOCODE / PLANNING

//MVP

// Offer to explain the game to me before playing.
    //This will use a modal box that opens when you click a button and hides when you click out of it. 
// Show me what the correct pattern is that I need to match, using animation of the Junimos to indicate the colors of the pattern.
// Animate each Junimo when I click or hover over it, so I know which one I'm targeting. 
    //I have accomplished this with CSS. Junimos jump when hovered over. 
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
//*2**https://dev.to/dsasse07/wait-for-it-implementing-a-sleep-function-in-js-2oac