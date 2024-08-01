const task = document.getElementById("input");
const taskButton = document.getElementById("button");
const form = document.getElementById("form");
const tagList = document.querySelectorAll('.tag')
const todoItemContainer = document.getElementById("todo-item-container")
const doneItemContainer = document.getElementById("done-item-container")
const displayTasks = document.getElementById("display")


task.addEventListener("input", function(event){
    event.preventDefault();

    if (task.value.length > 0) {
        taskButton.style.backgroundColor = "#000000";
        taskButton.style.color = "#ffffff";
    }
    
})

//object to keep track of selected tags
const selectedTags = {
    Design: false,
    Chores: false,
    Code: false
}


//tag selection
tagList.forEach(function(tag){
    tag.addEventListener("click", function(){
        const tagName = tag.getAttribute('value')
        selectedTags[tagName] = !selectedTags[tagName]
        tag.style.backgroundColor = "#000000"
        tag.classList.toggle('selected', selectedTags[tagName])
    })
})

function resetTags(){
    Object.keys(selectedTags).forEach(function(tag){
        selectedTags[tag] = false;
    })
    tagList.forEach(function(tag){
        tag.classList.remove('selected')
        tag.style.backgroundColor = ''
    })
}

let createdTaskArray = []

form.addEventListener("submit", function(event){
    event.preventDefault()

    let todoTask = task.value

    const tags = Object.keys(selectedTags).filter(function(tag){
        return selectedTags[tag]
    })

    if(todoTask.length === 0){
        alert("Enter a Todo Task!!!")
    } else {
        const taskData = {
            taskName: todoTask,
            completed: false,
            tagSelected: tags
        }
        createdTaskArray.push(taskData)
    }
    // push the task data from the array to the local Storage
    localStorage.setItem("todoTasks", JSON.stringify(createdTaskArray))

    form.reset()
    resetTags()
    fetchTodoTasks()
    printTodoTasksOnUi()
    
})


// grab the task items from local storage and push to the array
function fetchTodoTasks(){
    if (localStorage.getItem("todoTasks")){
        createdTaskArray = JSON.parse(localStorage.getItem("todoTasks"))
    }
    printTodoTasksOnUi()
}


// Print the tasks to the UI
function printTodoTasksOnUi(){
    todoItemContainer.innerHTML = ''
    doneItemContainer.innerHTML = ''
    displayTasks.classList.add("display")

    let titleTodo = document.createElement("div")
    titleTodo.classList.add("title")

    let titleCategoryTextToDo = document.createElement("h3")
    titleCategoryTextToDo.textContent = "TO-DO"

    titleTodo.appendChild(titleCategoryTextToDo)

    let titleDone = document.createElement("div")
    titleDone.classList.add("title")

    let titleCategoryTextDone = document.createElement("h3")
    titleCategoryTextDone.textContent = "DONE"

    titleDone.appendChild(titleCategoryTextDone)

    let todoTasks = []
    let doneTasks = []
        

    createdTaskArray.forEach(function(todoTask, index){
        let todoTaskTitle = todoTask.taskName
        let todoTags = todoTask.tagSelected

        // let taskContainer = document.createElement("div")
        // taskContainer.classList.add("tasks")

        let taskItem = document.createElement("div")
        taskItem.classList.add("task-container")

        let taskItemTop = document.createElement("div")
        taskItemTop.classList.add("task-container-top")

        let taskItemBottom = document.createElement("div")
        taskItemBottom.classList.add("task-container-bottom")

        const taskTitle = document.createElement("h4")
        taskTitle.innerText = todoTaskTitle

        const checkMark = document.createElement("img");
        checkMark.src = "./checkmark-circle.svg";
        // checkMark.style.cursor = "pointer";
        checkMark.addEventListener('click', function(){
            createdTaskArray[index].completed = true;
            localStorage.setItem("todoTasks", JSON.stringify(createdTaskArray))
            fetchTodoTasks()
        });

        const checkMarkComplete = document.createElement("img")
        checkMarkComplete.src = "./checkmark-circle-checked.svg"
        checkMarkComplete.addEventListener('click', function(){
            createdTaskArray[index].completed = false;
            localStorage.setItem("todoTasks", JSON.stringify(createdTaskArray))
            fetchTodoTasks()
        });
        

        let tagsContainer = document.createElement("div")
        tagsContainer.classList.add("tags")

        if (todoTags.includes("Design")){
            let designTag = document.createElement("div")
            designTag.classList.add("selected")
            designTag.id = "tag-design"

            let designTagP = document.createElement("p")
            designTagP.innerText = "Design"

            designTag.append(designTagP)
            tagsContainer.append(designTag)
        }

        if (todoTags.includes("Chores")){
            let choresTag = document.createElement("div")
            choresTag.classList.add("selected")
            choresTag.id = "tag-chores"

            let choresTagP = document.createElement("p")
            choresTagP.innerText = "Chores"

            choresTag.append(choresTagP)
            tagsContainer.append(choresTag)
        }

        if (todoTags.includes("Code")){
            let codeTag = document.createElement("div")
            codeTag.classList.add("selected")
            codeTag.id = "tag-code"

            let codeTagP = document.createElement("p")
            codeTagP.innerText = "Code"

            codeTag.append(codeTagP)
            tagsContainer.append(codeTag)
        }

        let actionsContainer = document.createElement("div")
        actionsContainer.classList.add("actions")

        
        const editPencil = document.createElement("img");
        editPencil.src = "./pencil-edit-02.svg";
        editPencil.addEventListener("click", function(){
            task.value = todoTask.taskName
            tagList.forEach(function(tag){
                let tagName = tag.getAttribute("value")
                if (todoTask.tagSelected.includes(tagName)){
                    selectedTags[tagName] = true
                    tag.classList.add('selected')
                    tag.style.backgroundColor = "#000000"
                } else {
                    selectedTags[tagName] = false
                    tag.classList.remove('selected')
                    tag.style.backgroundColor = ''
                }
            })
            createdTaskArray.splice(index, 1)
            localStorage.setItem("todoTasks", JSON.stringify(createdTaskArray))
            fetchTodoTasks()
        })

        if(!createdTaskArray[index].completed){
            editPencil.style.display = "flex"
        } else{
            editPencil.style.display = "none"
        }

        const deleteAction = document.createElement("img");
        deleteAction.src = "./delete-02.svg";
        deleteAction.addEventListener("click", function(){
            createdTaskArray.splice(index, 1)
            localStorage.setItem("todoTasks", JSON.stringify(createdTaskArray))
            fetchTodoTasks()
        })


        actionsContainer.appendChild(editPencil);
        actionsContainer.appendChild(deleteAction);

        taskItemBottom.append(tagsContainer)
        taskItemBottom.append(actionsContainer)

        
        if (createdTaskArray[index].completed){
            taskItemTop.appendChild(checkMarkComplete)
        } else{
            taskItemTop.appendChild(checkMark)
        }
        taskItemTop.append(taskTitle)

        taskItem.append(taskItemTop)
        taskItem.append(taskItemBottom)

        // taskContainer.append(taskItem)

        if (todoTask.completed) {
            doneTasks.push(taskItem)
            // doneItemContainer.append(titleDone)
            // doneItemContainer.append(taskContainer)
        } else {
            todoTasks.push(taskItem)
            // todoItemContainer.append(titleTodo)
            // todoItemContainer.append(taskContainer)
        }

    })

    if (todoTasks.length > 0) {
        todoItemContainer.append(titleTodo)
        todoTasks.forEach(function(task){
            todoItemContainer.append(task)
        })
    }

    if (doneTasks.length > 0) {
        doneItemContainer.append(titleDone)
        doneTasks.forEach(function(task){
            doneItemContainer.append(task)
        })
    }

}

fetchTodoTasks()


