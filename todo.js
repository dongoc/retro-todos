const ul = document.querySelector('ul');
const todoInput = document.querySelector('#todoInput');
const filterNotStarted = document.querySelector('.not_started');
const filterInProgress = document.querySelector('.in_progress');
const filterCompleted = document.querySelector('completed');
const allLists = document.querySelectorAll('li');

const listArray = localStorage.getItem('todo')
  ? JSON.parse(localStorage.getItem('todo'))
  : [];

localStorage.setItem('todo', JSON.stringify(listArray));
const data =  JSON.parse(localStorage.getItem('todo'))

//------------------------------------------Create-------------------------------------

// 리스트 생성
function createdList(data) {
  const li = document.createElement('li');
  li.id = data.id; 

  const progressBtn = document.createElement('button');
  progressBtn.classList.add('progress_button', 'not_started');
  progressBtn.addEventListener('click', changeBtnColor);

  const contentContainer = document.createElement('div');
  contentContainer.classList.add('content_container');

  const todos = document.createElement('div');
  todos.classList.add('todos')
  todos.textContent = data.content; 

  const hr = document.createElement('hr');
  
  const createdDate = document.createElement('div');
  createdDate.classList.add('createdDate');
  createdDate.textContent = data.createdAt;

  contentContainer.append(todos, hr, createdDate);
 
  const editContainer = document.createElement('div');
  editContainer.classList.add('edit_container');

  const editBtn = document.createElement('button');
  editBtn.classList.add("listBtn", "editBtn");
  //editBtn.addEventListener('click', editList);

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('listBtn', 'deleteBtn');
  deleteBtn.addEventListener('click', removeOneAtScreen);
  
  editContainer.append(editBtn, deleteBtn);

  li.append(progressBtn, contentContainer, editContainer); 
  return li;
}


//--------------------------------------Print-------------------------------------------

// 하나의 리스트 출력
function printList(data) {
  ul.append(createdList(data));
}

// 모든 리스트 출력
function printAllLists(data) {
  removeAllAtScreen();
  data.forEach(printList);
}

// 로드시 실행
//printAllLists(data);

//---------------------------------------Delete---------------------------------------

// remove all list (not local Storrage)
function removeAllAtScreen() {
  allLists.forEach(function(list) {
    list.remove();
  })
}

// remove one list with addEventListener
function removeOneAtScreen(event) {
  const target = event.target.parentElement.parentElement
  // 화면에서 지움
  target.remove();
  // 로컬에서 지움
  listArray.splice(target.id, 1);
  localStorage.setItem('todo', JSON.stringify(listArray));
}

// reset addEventListener
function clearLocalStorage() {
  removeAllAtScreen();
  localStorage.clear();
}

//------------------------------------------Add----------------------------------------

// 새로운 투두
todoInput.addEventListener('keydown', function(el) {
  // 엔터키를 누르면
  if (el.keyCode === 13) {
    el.preventDefault();

    if (todoInput.value.trim() === '') {
      alert('Add your todos.')
    } 
    else {
      let newTodo = {};

      // id count
      let idCount = 0;
      if (JSON.parse(localStorage.getItem('todo'))) {
        idCount = JSON.parse(localStorage.getItem('todo')).length - 1;
      }
      
      newTodo.id = idCount + 1;
      newTodo.progress = 'not_started';
      newTodo.content = todoInput.value;
      newTodo.createdAt = new Date().format()

      listArray.push(newTodo);
      localStorage.setItem('todo', JSON.stringify(listArray))
      printList(newTodo);
      todoInput.value = ''
    }
  }
})

//--------------------------------------------date-----------------------------------------

Number.prototype.padLeft = function() {
  if(this < 10) {
    return `0${this}`;
  }
  else {
    return `${this}`;
  }
}

Date.prototype.format = function() {
  let day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  var yyyy = this.getFullYear();
  var month = (this.getMonth() + 1).padLeft();
  var dd = this.getDate().padLeft();
  var dy = day[this.getDay()]

  var format = [yyyy, month, dd].join('.') + ' ' + dy;
  return format;  
}

//-------------------------------------------------Update-----------------------------------
// 리스트 수정
function editList(event) {
  event.preventDefault();

  const target = event.target.parentElement.parentElement
  target.children[1].children[0].style.display = 'none';
  
  const editInput = document.createElement('input');
  editInput.classList.add('edit_input');
  editInput.setAttribute('type', 'text');
  target.children[1].prepend(editInput)
  editInput.value = listArray[target.id].content;
  
  // 입력이 안 되는 문제

  event.target.removeEventListener('click', editList);
  event.target.addEventListener('click', printEditList);
  editInput.addEventListener('keydown', printEditList)

  function printEditList(event) {
    event.preventDefault();

    if (event.keyCode === 13) {
      listArray[target.id].content = editInput.value;
      localStorage.setItem('todo', listArray);
      editInput.style.display = 'none';
      // display문제
      target.children[1].children[0].style.display = 'block';
      target.children[1].children[0].value = listArray[target.id].content;

      event.target.removeEventListener('click', printEditList);
      event.target.addEventListener('click', editList);
    }
  }
}

// 체크버튼 누르면 색깔도 바꾸기
function changeBtnColor(event) {
  const target = event.target.parentElement
  console.dir(target.id)
  if (event.target.classList.contains('not_started')) {
    listArray[target.id].progress = 'in_progress';
    localStorage.setItem('todo', listArray);
    event.target.classList.remove('not_started');
    event.target.classList.add('in_progress');
  }
  else if (event.target.classList.contains('in_progress')) {
    listArray[target.id].progress = 'completed';
    localStorage.setItem('todo', listArray);
    event.target.classList.remove('in_progress');
    event.target.classList.add('completed');
  }
  else if (event.target.classList.contains('completed')) {
    listArray[target.id].progress = 'not_started';
    localStorage.setItem('todo', listArray);
    event.target.classList.remove('completed');
    event.target.classList.add('not_started');
  }
}

//--------------------------------------------------filter----------------------------------

// 필터(속성별)


// 필터(데이트)

//-----------------------------------------------CSS----------------------------

// opacitiy
function opacitiyDown(event) {
  
}