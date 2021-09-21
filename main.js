const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const idInput = $('input[name="id"]') 
const firstNameInput = $('input[name="firstName"]')
const lastNameInput = $('input[name="lastName"]')
const emailInput = $('input[name="email"]')
const gradeInput = $('input[name="grade"]')
const scoreInput = $('input[name="score"]')

const apiAddress = "http://localhost:3000/student/"

function start() {
    getStudents(renderStudent)
    handleAddStudent()
}

start()

// function

function getStudents(callback) {
    fetch(apiAddress)
        .then(response => response.json())
        .then(callback)
}

function renderStudent(student) {
    const htmls = student.map(item =>
        ` 
        <tr class = "row student-item-${item.id}">
            <td class = "id-data">${item.id}</td>
            <td class = "firstName-data">${item.firstName}</td>
            <td class = "lastName-data">${item.lastName}</td>
            <td class = "email-data">${item.email}</td>
            <td class = "grade-data">${item.grade}</td>
            <td class = "score-data">${item.score}</td>
            <td>
            <div class="progress">
            <p class="percent">${item.score}%</p>
            <div class="bar" style="width:${item.score}%">
            </div>
            </div>
            </td>
            <td class = "button-form">
            <button class = "btn-delete" onclick = "getResquestDeleteStudent(${item.id}, handleDeleteStudent)"><i class = "ti-trash"></i></button>
            <button class = "btn-edit" onclick = "getInfoStudentInForm(${item.id})" ><i class = "ti-pencil"></i></button>
            </td>
        </tr>
        `).join('')
        $('.table-body').innerHTML = htmls
}

// handle add Student
function handleAddStudent() {
    const addBtn = $('.btn-save')
    addBtn.addEventListener('click', e => {
        e.stopPropagation()
        let firstName = firstNameInput.value
        let id = idInput.value
        let lastName = lastNameInput.value
        let email = emailInput.value
        let grade = gradeInput.value
        let score = scoreInput.value
        const student = {
            id, firstName, lastName, email, grade, score,
        }
        if(Number.isInteger(parseInt(id))) {
            addStudent(student, () => getStudents(renderStudent))
        } else {
            alert("The ID field can't be blank or not a number!")
        }
    })
}

function addStudent(data,callback) {
    const option = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
          },
    }
    fetch(apiAddress, option) 
        .then(response => response.json())
        .then(callback)
        .catch(err => alert(err.message))
}

// Handle Edit Student

function getInfoById(data) {
    const id = data.querySelector('.id-data').innerText
    const firstName = data.querySelector('.firstName-data').innerText
    const lastName = data.querySelector('.lastName-data').innerText
    const email = data.querySelector('.email-data').innerText
    const grade = data.querySelector('.grade-data').innerText
    const score = data.querySelector('.score-data').innerText
    return {id, firstName, lastName, email, grade, score}
}

function getInfoStudentInForm(idData) {
    $('.modal-heading').textContent = 'Edit Student'
    $('.update-student').style.display = 'inline-block'
    $('.btn-save').style.display = 'none'
    $('.modal').style.display = 'flex'
    $('.modal-container').style.display = 'block'
    let newData
    const elementById = $('.student-item-'+idData)
    const data = getInfoById(elementById)
    idInput.value = data.id
    firstNameInput.value = data.firstName
    lastNameInput.value = data.lastName
    emailInput.value = data.email
    gradeInput.value = data.grade
    scoreInput.value = data.score
    $('.update-student').onclick = () => {
        const id = idInput.value
        const firstName = firstNameInput.value
        const lastName = lastNameInput.value
        const email = emailInput.value
        const grade = gradeInput.value
        const score = scoreInput.value
         newData =   {id, firstName, lastName, email, grade, score}
         handleEditStudent(newData, idData)
         $('.modal').style.display = 'none'
    }
}

function handleEditStudent(data, newId) {
    const option = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }
    fetch(apiAddress + '/' + data.id, option) 
        .then(response => response.json())
        .then(() => {
            const idElement = $('.student-item-' + newId)
            idElement.querySelector('.firstName-data').innerText = data.firstName
            idElement.querySelector('.lastName-data').innerText = data.lastName
            idElement.querySelector('.email-data').innerText = data.email
            idElement.querySelector('.grade-data').innerText = data.grade
            idElement.querySelector('.score-data').innerText = data.score
        })
}

// Handle delete Student

function getResquestDeleteStudent(id, callback) {
    $('.modal-delete').style.display = 'flex'
    $('.modal-btn-delete').onclick = () => {
        callback(id)
        $('.modal-delete').style.display = 'none'
    }
    $('.modal__delete-close-btn').onclick = () => { $('.modal-delete').style.display = 'none'}
    $('.modal-delete-overlay').onclick = () => { $('.modal-delete').style.display = 'none' }
    $('.modal-delete-cancel-btn').onclick = () => { $('.modal-delete').style.display = 'none'}
}

function handleDeleteStudent(id) {
    const option = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    }
    fetch(apiAddress +'/' +id, option) 
        .then(response => response.json())
        .then(() => {
            $('.student-item-'+id).remove()
        })
}

// Sort Data

window.onload = () => {
    function sortTableByColumn(column, asc = true) {
        const dirModifier = asc ? 1 : -1
        const tBody = $('.table-body')
        const rows = Array.from(tBody.querySelectorAll('tr'))
        
        // Sort each row
        const sortedRows = rows.sort((a, b) => {
            const aColText = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim().toLowerCase()
            const bColText = b.querySelector(`td:nth-child(${column + 1})`).textContent.trim().toLowerCase()
            if(!isNaN(aColText) && !isNaN(bColText)) {
                return Number(aColText) > Number(bColText) ? (1 * dirModifier) : (-1 * dirModifier)
            } else {
                return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier)
            }
        })
        while(tBody.firstChild) {
            tBody.removeChild(tBody.firstChild) 
        }
        tBody.append(...sortedRows)
    }
    
    $$('.title-row button').forEach((btn, index) => {
        btn.onclick = (e) => {
            e.preventDefault()
            const btnDown = btn.querySelector('.ti')
            if(btnDown.classList.contains('ti-angle-down')) {
                btnDown.classList.remove('ti-angle-down')
                btnDown.classList.add('ti-angle-up')
                sortTableByColumn(index, true)

            } else {
                btnDown.classList.add('ti-angle-down')
                btnDown.classList.remove('ti-angle-up')
                sortTableByColumn(index, false)
            }
           
        }
    })   
    
    $('.header-search').onkeyup = (e) => {
        const tBody = $('.table-body')
        const rows = Array.from(tBody.querySelectorAll('tr'))
        rows.forEach(row => {
            if(row.querySelector('.firstName-data').textContent.trim().toLowerCase().includes(e.target.value)){
                row.style.display = 'table-row'
            } else {
                row.style.display = 'none'
            }
        })
    }
}

$('.add-student').onclick = () => {
    $('.modal-heading').textContent = 'Add New Student'
    $('.modal').style.display = 'flex'
    $('.modal-container').style.display = 'block'
    $('.update-student').style.display = 'none'
    $('.btn-save').style.display = 'inline-block'
    idInput.value = ''
    firstNameInput.value = ''
    lastNameInput.value = ''
    emailInput.value = ''
    gradeInput.value = ''
    scoreInput.value = ''
}

$('.modal-overlay').onclick = () => { $('.modal').style.display = 'none'}

$('.btn-close').onclick = () => { $('.modal').style.display = 'none'}

$('.btn-cancel').onclick = () => { $('.modal').style.display = 'none'}






