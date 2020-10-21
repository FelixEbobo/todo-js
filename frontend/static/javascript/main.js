function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

var activeItem = null
var listSnapshot = []

document.getElementById('title').value = ''
buildlist()

function buildlist() {
    var wrapper = document.getElementById('list-wrapper');
    // wrapper.innerHTML = ''
    var url = 'http://localhost:8000/api/task-list/'
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){
        console.log("Data:", data)

        var list = data
        for (var i in list){

            try {
                document.getElementById(`data-row-${i}`).remove()
            } catch (err) {
                
            }

            var title = `<span class="title">${list[i].title}</span>`
            if (list[i].completed == true) {
                title = `<s class="title">${list[i].title}</s>`
            }
            var item = `
                <div id = "data-row-${i}" class="task-wrapper flex-wrapper">
                    <div style="flex:7">
                        ${title}
                    </div>
                    <div style="flex:1">
                        <button class="btn btn-sm btn-outline-info edit">Edit</button>
                    </div>
                    <div style="flex:1">
                        <button class="btn btn-sm btn-outline-danger delete">Delete</button>
                    </div>
                </div>
            `
            wrapper.innerHTML += item
        }

    if (listSnapshot.length > list.length) {
        for (var i = list.length; i < listSnapshot.length; i++) {
            document.getElementById(`data-row-${i}`).remove()
        }
    }
        
    listSnapshot = list

    for (var i in list) {
        var editBtn = document.getElementsByClassName('edit')[i]
        var deleteBtn = document.getElementsByClassName('delete')[i]
        var task = document.getElementsByClassName("title")[i]

        editBtn.addEventListener('click', (function(item){
            return function(){
                editItem(item);
            }
        })(list[i]))
        deleteBtn.addEventListener('click', (function(item){
            return function() {
                deleteItem(item)
            }
        })(list[i]))
        task.addEventListener('click', (function(item){
            return function() {
                strike(item)
            }
        })(list[i]))
    }
    })
}

var form = document.getElementById('form-wrapper')
    form.addEventListener('submit', function(e){
    e.preventDefault();
    console.log('Form submitted');
    var url = 'http://localhost:8000/api/task-create/'
    if (activeItem != null) {
        url = `http://localhost:8000/api/task-update/${activeItem.id}`
        activeItem = null
    }
    var title = document.getElementById('title').value
    fetch(url, {
        method:'POST',
        headers:{
            'Content-type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body:JSON.stringify({"title": title})
    })
    .then(function(response){
        buildlist();
        document.getElementById('form').reset()
    })
})

function editItem(item) {
    console.log('Item clicked', item)
    activeItem = item
    document.getElementById('title').value = activeItem.title
}

function deleteItem(item) {
    console.log('Item deleted', item)
    fetch(`http://localhost:8000/api/task-delete/${item.id}`, {
        method: "DELETE",
        headers: {
            "Content-type": 'application/json',
            "X-CSRFToken": csrftoken,
        }
    }).then((response) => {
        buildlist();
    })
}

function strike(item) {
    console.log('Item striked', item)
    fetch(`http://localhost:8000/api/task-update/${item.id}`, {
        method: "POST",
        headers: {
            "Content-type": 'application/json',
            "X-CSRFToken": csrftoken,
        },
        body:JSON.stringify({"title": item.title, "completed": !item.completed})
    }).then((response) => {
        buildlist();
    })
}