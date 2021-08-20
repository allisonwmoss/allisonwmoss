const allJunimos = document.getElementsByClassName('junimo')
const startButton = document.getElementById('game-button')
let junimoColors = []

const getColor = (e) => {
    const junimo = e.currentTarget.id
    console.log(junimo)
}


for (let junimo of allJunimos) {
    junimoColors.push(junimo.id)
    junimo.addEventListener('click', getColor)
}

const gameStart = () => {
    console.log('game starting!')
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
