/**
 * Farhad Uneci, 9708253, Dec 2020
 * First Project Of Algorithms Design
 */
const NUMBER_OF_CITIES = 5
const re = /\s+/

//Html input Tag
const input = document.getElementById('cities')
const form = document.getElementById('form')
const lower_rings = document.getElementById('lower_rings')
const upper_rings = document.getElementById('upper_rings')

//Array to store increasing numbers
let inc_numbers = []

//Array to store splitted numbers
let lower_cities = []

form.addEventListener('submit', updateDom)

function updateDom(e) {
    inc_numbers = []; lower_cities = []; lower_rings.innerHTML = ""

    lower_cities = input.value.trim().split(re)

    validate_input(lower_cities)
    ? createNewNodes()
    : createErrorNode() 

    e.preventDefault();
}

function createNewNodes() {
    calcAnswer()

    lower_cities.forEach(city => {
        let node = createNode(city);
        node.classList.add(
            inc_numbers.includes(parseInt(city))
            ? "bg-gray-700"
            : "bg-gray-300"
        )
        lower_rings.appendChild(node)  
    });

    upper_rings.innerHTML = ""
    
    for (let i = 1; i <= 5; i++) {
        let node = createNode(i.toString());
        node.classList.add(
            inc_numbers.includes(i)
            ? "bg-gray-700"
            : "bg-gray-300"
        )
        upper_rings.appendChild(node) 
    }
}

function calcAnswer() {
    let key = parseInt(lower_cities[0]),
    next_item = 0, last_item = 0, answer = []

    inc_numbers.push(key)

    for (let i = 1; i < NUMBER_OF_CITIES; i++) {
        last_item = parseInt(inc_numbers.slice(-1)[0] )
        next_item = parseInt(lower_cities[i])

        if (next_item > last_item) {
            inc_numbers.push(next_item)
        } else if (next_item < last_item && i < (NUMBER_OF_CITIES/2)+1) {
            answer = inc_numbers
            inc_numbers = []
            inc_numbers.push(next_item)
        }
    }

    if (answer.length > inc_numbers.length)
        inc_numbers = answer
}

function createErrorNode() {
    lower_rings.innerHTML = ""
    var pTag = document.createElement('p')
    pTag.className = "bg-red-200 p-8 rounded-lg text-5xl font-black uppercase text-red-700"
    pTag.appendChild(document.createTextNode('Data not valid!'))
    lower_rings.appendChild(pTag)
}

function createNode(text) {
    let ring = document.createElement('span')
    let number = document.createElement('p')

    ring.className = "inline-block w-32 h-32 rounded-full ring-8 ring-offset-4 ring-gray-500 mx-auto md:mx-0"
    number.className = "text-gray-200 text-center text-8xl leading-snug font-bold"

    number.appendChild(document.createTextNode(text))

    ring.appendChild(number)

    return ring
}

function validate_input(input) {
    if (input.length == NUMBER_OF_CITIES) {
        try {
            input.forEach(element => {
                if (parseInt(element) > NUMBER_OF_CITIES)
                    throw error
            })   
        } catch (error) {
            return false
        }
        return true
    }
    return false
}