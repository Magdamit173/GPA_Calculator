
let active_popup  = undefined

const midterm_course_collection = document.querySelector("[data-midterm_course_collection]")
const final_course_collection = document.querySelector("[data-final_course_collection]")

const add_midterm = document.querySelector("[data-add_midterm]")
const add_final_grade = document.querySelector("[data-add_final_grade]")

const dummy_subject = ["math", "science", "physics", "hahaha"]

const gpa_indicator = document.querySelector("[data-indicator]")

/* <div class="course_container" >
    <input class="course_input course_name" type="text" placeholder="Course Name">

    <input class="course_input course_units" type="text" placeholder="Units">

    <input class="course_input course_grade" type="text" placeholder="Grade">
</div> */

function randint() {
    return Math.round(Math.random() * 5)
}

function choice(item) {
    return item[Math.floor(Math.random() * item.length)]
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(() => {
        resolve()
    }, ms))
}

function generateCourse(name = "", units = 0, grade = 0) {

    const course_container = document.createElement("div")
    course_container.setAttribute("class", "course_container")
    course_container.setAttribute("data-course_container", "")

    const course_name = document.createElement("input")
    course_name.type = "text"
    course_name.setAttribute("class", "course_input course_name")
    course_name.placeholder = "Course Name"
    course_name.setAttribute("data-course_name", "")

    const course_units = document.createElement("input")
    course_units.type = "text"
    course_units.setAttribute("class", "course_input course_units")
    course_units.placeholder = "Units"
    course_units.setAttribute("data-course_units", "")

    const course_grade = document.createElement("input")
    course_grade.type = "text"
    course_grade.setAttribute("class", "course_input course_grade")
    course_grade.placeholder = "Grade"
    course_grade.setAttribute("data-course_grade", "")

    course_name.value = name
    course_units.value = units
    course_grade.value = grade

    // course_name.value = choice(dummy_subject)
    // course_units.value = randint()
    // course_grade.value = randint()

    const remove = document.createElement("div")
    remove.setAttribute("class", "remove")
    remove.textContent = "X"

    remove.addEventListener("click", () => {
        course_container.remove()
    })

    course_container.append(course_name, course_units, course_grade, remove)


    return course_container
}

function enumerate(course_collection) {
    const course_table = new Array()

    // not recommended nested for loop
    for (let course_container of course_collection.children) {
        const cache = new Array()
        for (let course_input of course_container.children) {
            if (course_input.hasAttribute("data-course_name")) cache[0] = course_input.value || ""
            if (course_input.hasAttribute("data-course_units")) cache[1] = parseFloat(course_input.value) || 0
            if (course_input.hasAttribute("data-course_grade")) cache[2] = parseFloat(course_input.value) || 0
        }

        if (cache.some(entry => entry !== null)) course_table.push(cache)
    }

    return course_table
}

function computeGrades(enumerable) {
    let totalGrades = 0

    for(let [_, [name, units, grades]] of enumerable.entries()) {
        totalGrades += units * grades
    }

    return totalGrades
}

function computeUnits(enumerable) {
    let totalUnits = 0

    for(let [_, [name, units, grades]] of enumerable.entries()) {
        totalUnits += units
    }

    return totalUnits
}

function localSave(any, name_of_save) {
    try {
        if (!name_of_save) throw new Error("Storage name is required")
        localStorage.setItem(name_of_save, JSON.stringify(any))
    }
    catch (error) {
        console.error("localSave error:", error)
    }
}

function localLoad(name_of_save) {
    try {
        if (!name_of_save) throw new Error("Storage name is required")
        const data = localStorage.getItem(name_of_save)
        return data ? JSON.parse(data) : null // ternary 
    }
    catch (error) {
        console.error("localLoad error:", error)
        return null
    }
}



function computeOnType() {
    const midterm_data = enumerate(midterm_course_collection)
    const final_grade_data = enumerate(final_course_collection)

    localSave(midterm_data, "midterm")
    localSave(final_grade_data, "final_grade")

    const midterm_grade = computeGrades(midterm_data)
    const final_grade = computeGrades(final_grade_data)

    const midterm_units = computeUnits(midterm_data)
    const final_grade_units = computeUnits(final_grade_data)

    const midterm_mean = midterm_grade / midterm_units
    const final_grade_mean = final_grade / final_grade_units

    const gpa = (midterm_mean + final_grade_mean) / 2

    manifest(`GPA: ${gpa.toFixed(2)}`)
}

function manifest(text) {
    gpa_indicator.textContent = text
}

function computeOnload() {
    const midterm_data = localLoad("midterm")
    const final_grade_data = localLoad("final_grade")

    for(let course of midterm_data) {
        midterm_course_collection.append(generateCourse(course[0], course[1], course[2]))
    }

    for(let course of final_grade_data) {
        final_course_collection.append(generateCourse(course[0], course[1], course[2]))
    }
}


add_midterm.addEventListener("click", () => {
    midterm_course_collection.append(generateCourse())
})

add_final_grade.addEventListener("click", () => {
    final_course_collection.append(generateCourse())
})

addEventListener("load",async () => {
    computeOnload()
    await confirmPopUp("Left Column As Midterm, Right Column As Final Grade")
    await sleep(10000)
    computeOnType()
    
})

addEventListener("input", () => {
    computeOnType()
})

addEventListener("click", () => {
    computeOnType()
})