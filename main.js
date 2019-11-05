const calorieList = document.querySelector('#calories-list')
const progressBar = document.querySelector('.uk-progress')
const newCalorieForm = document.querySelector('#new-calorie-form')
const bmrCalculatorForm = document.querySelector('#bmr-calulator')
const editCalorieForm = document.querySelector('#edit-calorie-form')

let value = 0

fetch('http://localhost:3000/api/v1/calorie_entries') //eslint-disable-line
  .then(response => response.json())
  .then((entries) => {
    calorieList.innerHTML = ''
    for (const entry of entries) {
      insertEntry(entry)
    }
  })

newCalorieForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const calorie = parseInt(e.target.querySelector('.uk-input').value)
  const notes = e.target.querySelector('.uk-textarea').value
  postNewCalorie(calorie, notes).then(insertEntry)
})

bmrCalculatorForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const lowerRangeSpan = document.querySelector('#lower-bmr-range')
  const higherRangeSpan = document.querySelector('#higher-bmr-range')
  const weightInPounds = parseInt(e.target.weight_in_pounds.value)
  const age = parseInt(e.target.age_in_years.value)
  const height = parseInt(e.target.heigt_in_inches.value)
  lowerRangeSpan.innerText = parseInt(655 + (4.35 * weightInPounds) + (4.7 * height) - (4.7 * age))
  higherRangeSpan.innerText = parseInt(66 + (6.23 * weightInPounds) + (12.7 * height) - (6.8 * age))
  progressBar.max = higherRangeSpan.innerText
})

editCalorieForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const calorieInput = e.target.querySelector('.uk-input').value
  const noteTextArea = e.target.querySelector('.uk-textarea').value
  const id = e.target.querySelector('.uk-input').dataset.item_id
  fetch(`http://localhost:3000/api/v1/calorie_entries/${id}`, { //eslint-disable-line 
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      api_v1_calorie_entry: {
        calorie: calorieInput,
        note: noteTextArea
      }
    })
  })
    .then(response => response.json())
    .then((entry) => {
      const strong = document.querySelector(`#calorie-for-${entry.id}`)
      strong.innerText = entry.calorie
      const note = document.querySelector(`#note-for-${entry.id}`)
      note.innerText = entry.note
      progressBar.click()
    })
})

function insertEntry (entry) {
  const li = document.createElement('li')
  li.className = 'calories-list-item'
  li.id = `entry-for-${entry.id}`
  calorieList.prepend(li)
  // const li = createAndAppendElement('li', calorieList, (el) => { el.className = 'calories-list-item' })
  const divGrid = createAndAppendElement('div', li, (el) => { el.className = 'uk-grid' })

  const divColCal = createAndAppendElement('div', divGrid, (el) => { el.className = 'uk-width-1-6' })
  createAndAppendElement('strong', divColCal, (el) => { el.innerText = entry.calorie; el.id = `calorie-for-${entry.id}` })
  createAndAppendElement('span', divColCal, (el) => { el.innerText = 'kcal' })
  const divColNote = createAndAppendElement('div', divGrid, (el) => { el.className = 'uk-width-4-5' })
  createAndAppendElement('em', divColNote, (el) => {
    el.id = `note-for-${entry.id}`
    el.innerText = entry.note
    el.className = 'uk-text-meta'
  })

  const listItemMenu = createAndAppendElement('div', li, (el) => { el.className = 'list-item-menu' })
  createAndAppendElement('a', listItemMenu, (el) => {
    el.setAttribute('uk-icon', 'icon: pencil')
    el.setAttribute('uk-toggle', 'target: #edit-form-container')
    el.addEventListener('click', (e) => {
      editCalorieForm.querySelector('.uk-input').dataset.item_id = entry.id
      editCalorieForm.querySelector('.uk-input').value = entry.calorie
      editCalorieForm.querySelector('.uk-textarea').value = entry.note
    })
    el.className = 'edit-button'
  })

  createAndAppendElement('a', listItemMenu, (el) => {
    el.setAttribute('uk-icon', 'icon: trash')
    el.className = 'delete-button'
  })
  value += entry.calorie
  progressBar.value = value
}

function postNewCalorie (calorie, notes) {
  return fetch('http://localhost:3000/api/v1/calorie_entries', { //eslint-disable-line
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      api_v1_calorie_entry: {
        calorie: calorie,
        note: notes
      }
    })
  }).then((response) => response.json())
}

function createAndAppendElement (tag, parent, callback) {
  const element = document.createElement(tag)
  parent.append(element)
  if (callback !== undefined) {
    callback(element)
  }
  return element
}
