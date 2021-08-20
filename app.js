const allJunimos = document.getElementsByClassName('junimo')
console.log(allJunimos)
const startButton = document.getElementById('game-button')
let junimoColors = []
let sequence = []
// let sequence = []
let echoSequence = []

const getColor = (e) => {
    const junimo = e.currentTarget.id
    echoSequence.push(junimo)
}


for (let junimo of allJunimos) {
    junimoColors.push(junimo.id)
    junimo.addEventListener('click', getColor)
}

const getSequence = (num) => {
    for (let i = 0; i < num; i++) {
        const randIndex = Math.floor(Math.random() * junimoColors.length)
        sequence.push(junimoColors[randIndex])
    }
    // checkIfAllTheSame(sequence);
    return sequence;
}




//I need a function that executes getSequence and animates each junimo according to that function
//this will require using setInterval so they don't all jump instantly
//



const checkIfAllTheSame = (sequence) => {
    //check if all the colors are the same, i.e. we're just giving the user the same color for the entire sequence
    //Method via: @bilal-hungund, Geeks For Geeks, https://www.geeksforgeeks.org/all-elements-in-an-array-are-same-or-not/
    let first = sequence[0]
    for (let i = 1; i < sequence.length; i++) {
        if (sequence[i] != first) {
            return
        }
        else {
            getSequence(sequence.length)
        }
    }
}


const junimoBounce = (junimoDiv) => {
    console.log('junimo jump was called')
    junimoDiv.style.transform = 'translateY(-50px)'
}

// const junimoLand = (junimoDiv, i) => {
//     setTimeout(() => {
//         junimoLand(junimoDiv);
//     }, i * 500)
//     console.log('junimo land was called')
//     junimoDiv.style.transform = 'translateY(50px)'
// }

const gameStart = () => {
    // console.log('game button works')
    getSequence(5)
    console.log(`Sequence: ${sequence}`)
    let junimoSequenceArr = [];
    for (let i = 0; i < sequence.length; i++) {
        let color = sequence[i];
        junimoSequenceArr.push(allJunimos.namedItem(color))
        // const junimoJumpInterval = setInterval(() => {
        //     // console.log('hello' + i)
        //     
        //     // console.log(color)
        //     const matchingJunimo = allJunimos.namedItem(color)
        //     // console.log(matchingJunimo)
        //     matchingJunimo.style.transform = 'translateY(-50px)'
        // }, 1000)
    }
    junimoSequenceArr.forEach((junimoDiv, i) => {
        setTimeout(() => {
            junimoBounce(junimoDiv)
        }, i * 500)

    });

    // setInterval(junimoJump(matchingJunimo), 1000)
    //use an array method
    //or wrap in set interval
    //Research other ways of organizing this logic
    //setInterval in an array / in for loop 
}

startButton.addEventListener('click', gameStart

    // () => {
    //     console.log('game button works')
    // }
)


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
