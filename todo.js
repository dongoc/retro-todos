// filter buttons
const filterRedBtn = document.querySelector('.not_started');
const filterYellowBtn = document.querySelector('.in_progress');
const filterGreenBtn = document.querySelector('.completed');

// todo input
const todoInput = document.querySelector('#todoInput');

// lists
const ul = document.querySelector('ul');
const allList = document.querySelectorAll('li');

var todoData = [];
if (localStorage.getItem('todo')) {
  todoData = JSON.parse(localStorage.getItem('todo'))
}
// localStorage.setItem('todo', JSON.stringify(todoData));

//--------------------------------------create---------------------------------
// 실험 해보기
function createEl(tagName, className) {
  let el = document.createElement(`${tagName}`);
  let classList = [...arguments].slice(1);
  for (let i of classList) {
    el.classList.add(`${i}`);
  }
  return el;
}

function createListEl(data) {
  // create all tags
  const li = document.createElement('li');
  li.id = data.id;
  
  const progressBtn = document.createElement('button');
  progressBtn.classList.add('progress_button', `${data.progress}`);
  progressBtn.addEventListener('click', changeProgressStatus); // not yet

  const contentContainer = document.createElement('div');
  contentContainer.classList.add('content_container');

  const todoContent = document.createElement('div');
  todoContent.classList.add('todos');
  todoContent.textContent = data.todo;

  const hr = document.createElement('hr');

  const createdDate = document.createElement('div');
  createdDate.classList.add('createdDate');
  createdDate.textContent = data.createdAt;

  const editContaitner = document.createElement('div');
  editContaitner.classList.add('edit_container');

  const editBtn = document.createElement('button');
  editBtn.classList.add('listBtn', 'editBtn');
  editBtn.addEventListener('click', editTodoList); // not yet

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('listBtn', 'deleteBtn');
  deleteBtn.addEventListener('click', deleteTodoList); // not yet

  // append
  contentContainer.append(todoContent, hr, createdDate);
  editContaitner.append(editBtn, deleteBtn);
  li.append(progressBtn, contentContainer, editContaitner);

  return li;
}

todoInput.addEventListener('keydown', addNewList);

// add new list
function addNewList(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    if (!todoInput.value) {
      alert('Add new todos.') 
    } 
    else {
      let listObj = {};
      listObj.id = todoData.length;
      listObj.todo = todoInput.value;
      listObj.progress = 'not_started';
      listObj.createdAt = new Date().format();
  
      todoData.push(listObj);
      localStorage.setItem('todo', JSON.stringify(todoData));
  
      printList(listObj);
      todoInput.value = '';
    }
  }
}


//-----------------------------------------read----------------------------------
function printList(data) {
  ul.append(createListEl(data));
}

function printAllList(data) {
  removeAllAtScreen(data);
  data.forEach(printList);
}

printAllList(todoData);

//------------------------------------update--------------------------------------
function changeProgressStatus(event) {
  event.preventDefault()
  let target = event.target; 
  let progressType = ['not_started', 'in_progress', 'completed', 'not_started'];
  let targetProgressStatus = [...target.classList].filter(className => className !== 'progress_button')[0];
  let targetProgressIdx = progressType.indexOf(targetProgressStatus);

  if (target.classList.contains(`${targetProgressStatus}`)) {
    target.classList.remove(`${targetProgressStatus}`);
    target.classList.add(`${progressType[targetProgressIdx + 1]}`)
    todoData[target.parentElement.id].progress = `${progressType[targetProgressIdx + 1]}`;
    localStorage.setItem('todo', JSON.stringify(todoData));
  }
}

function editTodoList(event) {
  event.preventDefault();
  // todo content -> display none
  // edit input
}
//-------------------------------------delete---------------------------------------
function deleteTodoList(event) {
  event.preventDefault();
  // list remove;
}

function removeAllAtScreen() {
  allList.forEach(el => el.remove());
}
//-----------------------------------Date format--------------------------------------
Number.prototype.padLeft = function() {
  if (this < 10) {
    return `0${this}`;
  }
  else {
    return `${this}`;
  }
}

Date.prototype.format = function() {
 let day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
 var yyyy = this.getFullYear();
 var mm = (this.getMonth() + 1).padLeft();
 var dd = (this.getDate()).padLeft();
 var dy = day[this.getDay()];

 var format = [yyyy, mm, dd].join('.') + ' ' + dy;
 return format;
}

//-----------------------------------filter-------------------------------------