/* Introduction
* Farhad Uneci, 9708253, Jan 2020
* Second Project Of Algorithms Design
*/

/* -------------------------------------------------------------------------- */
/*                                  Variables                                 */
/* -------------------------------------------------------------------------- */

/** re Variable
 * Regex re will be used to split the input into array.
 * 
 * This regex will find pattern which include a ',' and
 * as many as space afterwards.
 */

const re = /,\s*/

// Html input Tag
const form = document.getElementById('form')
const input = document.getElementById('input')

const playingArea = document.getElementById('playingArea')

// This flag shows if the input was wrong or not
let errorFlag = false

// Cards array will represent the cards order taken from user input
let cards = [];

// Possibilities array will be created to find the best answer
let possibilities = []; //MORE INFO ARE DESCRIBED AT ITS SECTION !

// Best possible answer to divide the coins between people
let bestCase = 0;

// Init a timeout variable to be used below
let timeout = null;

// Answer
let firstPartOfAnswer = [];
let secondPartOfAnswer = [];

/* -------------------------------------------------------------------------- */
/*                                Main Program                                */
/* -------------------------------------------------------------------------- */

// Update Input Text
input.addEventListener('input', updateInputText)

// Update DOM
form.addEventListener('submit', updateAnswer)

// Clear the input if backspace or delete was pressed
input.addEventListener('keydown', function(event) {
    const key = event.key;

    if (key === "Backspace" || key === "Delete") {
        input.value = ''
        playingArea.innerHTML = ''
        cards = []
    }
});

/** Update Input Text
 * This function will be called on input change event and will update the input value
 * by appending a ',' and space at the end of its value.
 */

// Listen for keystroke events
function updateInputText() {
    /**
     * Clear the timeout if it has already been set.
     * This will prevent the previous task from executing
     * if it has been less than <MILLISECONDS>
     */

    clearTimeout(timeout);

    if (errorFlag) {
        playingArea.innerHTML = ""
        cards = []
        
        errorFlag = false
    }

    // Make a new timeout set to go off in 500ms (1/2 second)
    timeout = setTimeout(function () {
        playingArea.innerHTML = ""

        input.value += ", "
        
        // Create a new node with the last element of input array
        input.value.trim().split(re).filter(x => x).forEach(element => {
            createNode(element)
        });
    }, 300);
};

/** Update Answer
 * This function will calculate the answer of the input and update the DOM
 */

function updateAnswer(e) {
    /** Cards Array
     * Take the input from the input tag and split it in an array,
     * all values will be parsed to integer.
     */

    cards = input.value.trim().split(re).filter(x => x).map(x => parseInt(x))

    // Find the answer
    let answer = calcAnswer();

    answer.hasAnswer
        ? updateDom(answer)
        : createErrorNode()

    e.preventDefault();
}

function updateDom(answer) {
    let flipCards = () => {
        playingArea.childNodes.forEach(card => {
            card.classList.toggle("flipped")
        });
    }

    setTimeout(() => {
        // Hide the cards and calc the result
        flipCards()
    }, 100);

    // Then show them back
    setTimeout(() => {
        playingArea.innerHTML = ''

        answer.firstPartOfAnswer.forEach(element => {
            createNode(element, "Bob")
        });
        
        answer.secondPartOfAnswer.forEach(element => {
            createNode(element, "Patrick")
        });
    }, 800);

    setTimeout(() => {
        // Hide the cards and calc the result
        flipCards()

        let firstSum = firstPartOfAnswer.reduce((a,b) => a + b)
        let secondSum = secondPartOfAnswer.reduce((a,b) => a + b)

        alert(`Best case was: ${firstSum}/${secondSum}`)
    }, 1000);

}

function calcAnswer() {
    /** Best Case Variable
     * The best case of every input will be equally spreading the values
     * between individuals, same as sum of all elements / 2, but the answer
     * might have floating point (like 15/2 = 7.5) and we need to round the
     * answer down like what the Math.floor() function does. but here i use |
     * operator to OR all the bits with 0 for this purpose.
     */
   
    /**
     * OR operator will round the number downward.
     * Cards.reduce equals to sum of all elements.
     */

    bestCase = cards.reduce((a, b) => a + b)/2 | 0
    
    /** Possibilities Array
     * The possibilities array will help us to calculate every possible case
     * based on the Subset Sum Problem in which this array will represent if
     * its possible to create a pre-determined sum with specific element.
     * 
     * This array will look like this
     *   0 1 2 3
     * 1 T T F F
     * 2 T T T T
     * 4 T T T T
     * 
     * As you see its a boolean array only representing if its possible to create
     * a sum with the given numbers or not.
     * 
     * Array[2][5] shows if its possible to create 5 from [1, 2, 4]
     * 
     * For more information and more in-depth explanation visit the like below,
     * https://thecodingsimplified.com/subset-sum-problem/
     */

    possibilities = createPossibilitiesMatrix(bestCase);

    /** Finding The Answer
     * Here after having access to the possibilities array we try to find a number
     * CLOSEST OT EQUAL to the best case sum we have already calculated, at every step
     * we check if we can create sum of the best case calculated value, if yes we find the
     * numbers leading to that sum and if not, we go for the next BEST choice which is best case - 1
     */

    while (bestCase > 0) {
        if (canCreateSumOf(bestCase)) {
            firstPartOfAnswer = findSumOf(bestCase)
            break // If we find the sum, we need to exit the loop
        } else
            bestCase --
    }

    // Clone the cards array
    secondPartOfAnswer = [...cards]

    // Delete all elements in the second part of the answer which are
    // included in the first part.

    firstPartOfAnswer.forEach(element => {
        secondPartOfAnswer.deleteElement(element)
    });

    return {
        'hasAnswer':
            firstPartOfAnswer.length === 0 ||
            secondPartOfAnswer.length === 0
                ? false : true,
        firstPartOfAnswer,
        secondPartOfAnswer
    }
}

/* -------------------------------------------------------------------------- */
/*                               Other Functions                              */
/* -------------------------------------------------------------------------- */

function findSumOf(bestCase) {
    // Numbers which will create the sum
    let numbers = [];

    // For the next steps, we subtract every found answer from the remaining number
    // and we call the function recursively to find the next answer

    let remainingNumberToFind = bestCase;

    while (remainingNumberToFind > 0) {
        for (let i = 0; i < cards.length; i++) {
            let element = possibilities[i][remainingNumberToFind]
            if (element === true) {
                let numberToAdd = cards[i];
                remainingNumberToFind -= numberToAdd
                numbers.push(numberToAdd)
                findSumOf(remainingNumberToFind)
                break
            }
        }
    }

    return numbers;
}

function canCreateSumOf(number) {
    // [cards.length - 1] equals to last row
    // [cards.length - 1][number] equals to the number's column value of the last row
    return possibilities[cards.length - 1][number];
}

function createPossibilitiesMatrix(bestCase) {
    cards.sort();

    let possibilities = createArray(cards.length, bestCase + 1)

    for(let i = 0; i < cards.length; i++) {
      possibilities[i][0] = true;
    }
    
    for (let j = 0; j <= bestCase; j++) {
        if(j == cards[0]) {
            possibilities[0][j] = true;
            break
        }   
    }
    
    for (let i = 1; i < possibilities.length; i++) {
        for (let j = 0; j <= bestCase; j++) {
            if(possibilities[i - 1][j]) {
                possibilities[i][j] = true;
              } else {
                if(j >= cards[i]) {
                  possibilities[i][j] = possibilities[i - 1][j - cards[i]];  
                }
            }
        }
    }

    return possibilities;
}

function createErrorNode() {
    errorFlag = true

    playingArea.innerHTML = ""
    
    var node = document.createElement('div');
    var pTag = document.createElement('p');
    var span = document.createElement('span');

    span.className = "animate-pulse"
    
    node.className = "bg-red-200 p-8 rounded-lg flex w-full h-32 items-center"

    pTag.className = "text-5xl font-black uppercase text-red-700 ml-5"
    pTag.appendChild(document.createTextNode('Data not valid!'))

    span.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" width="50px" viewBox="0 0 20 20" fill="#9e1c1c"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>'

    node.appendChild(span)
    node.appendChild(pTag)
    
    playingArea.appendChild(node)
}

function createNode(text, name) {
    name === undefined
    ? playingArea.innerHTML += `<div class="card bg-black shadow rounded-xl is-flipped m-2"><div class="card__face card__face--front rounded-xl flex flex-col justify-center"><h2 class="text-8xl font-black text-gray-300">${text}</h2></div><div class="card__face card__face--back rounded-xl"></div></div>`
    : playingArea.innerHTML += `<div class="card flipped bg-black shadow rounded-xl is-flipped m-2"><div class="card__face card__face--front rounded-xl flex flex-col justify-center dark:bg-gray-300"><h2 class="text-8xl font-black text-gray-300 dark:text-black">${text}</h2><span class="text-black dark:text-gray-300 text-xl font-semibold bg-gray-300 dark:bg-black p-1 mx-6 rounded-lg mt-4">${name}</span></div><div class="card__face card__face--back rounded-xl"></div></div>`

    if (name == 'Patrick') {
        playingArea.lastElementChild.classList.add('dark')
    }
}

// This function creates a 2D array based on its input values
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

// This function will be added to the Array prototype and will help us to
// Access a function called deleteElement on all arrays
Array.prototype.deleteElement = function(number) {
    let index = this.indexOf(number);
    this.splice(index, 1)
}