/**
 * 해야할 것 : 
 * 1. CSS 포지션 고치기
 * 2. 휴지통 넣기
 * 3. date 고민하기
 */

// todo input
const todoInput = document.querySelector('#todoInput');

// lists
const ul = document.querySelector('ul');
const allList = document.querySelectorAll('li');

// data & local storage
var todoData = [];
if (localStorage.getItem('todo')) {
  todoData = JSON.parse(localStorage.getItem('todo'))
}

var progressFilterOnOff = {not_started: 'on', in_progress: 'on', completed: 'on'};
if (localStorage.getItem('progress')) {
  progressFilterOnOff = JSON.parse(localStorage.getItem('progress'))
}
localStorage.setItem('progress', JSON.stringify(progressFilterOnOff));

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
  progressBtn.addEventListener('click', changeProgressStatus); 

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
  deleteBtn.addEventListener('click', deleteTodoList); 

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
      listObj.id = 0;
      if (todoData.length) {
        listObj.id = todoData[todoData.length - 1].id + 1;
      }
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
    // id는 인덱스로 작용하면 안 됨! 정확한 id 찾는 작업 필요
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
  if (confirm('Are you sure?')) {
    let target = event.target; 
    let targetLiEl = target.parentElement.parentElement
    targetLiEl.remove();
    // 정확한 id값 필요
    todoData.splice([targetLiEl.id], 1);
    localStorage.setItem('todo', JSON.stringify(todoData));
  };
}

function removeAllAtScreen() {
  allList.forEach(el => el.remove());
}

// localStorage clear;
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
// filter by progress
const filterRedBtn = document.querySelector('.not_started');
const filterYellowBtn = document.querySelector('.in_progress');
const filterGreenBtn = document.querySelector('.completed');

filterRedBtn.addEventListener('click', filterByProgress);
filterYellowBtn.addEventListener('click', filterByProgress);
filterGreenBtn.addEventListener('click', filterByProgress);

function progressFilterDefault() {
  if (i) {} // code here
}

progressFilterDefault();

function filterByProgress(event) {
  event.preventDefault();

  let target = event.target;
  let progressType = ['not_started', 'in_progress', 'completed'];
  let targetProgressType = [...target.classList].filter(className => progressType.includes(className))[0];

  let allLists = document.querySelectorAll('li')

  if (progressFilterOnOff[targetProgressType] === 'on') {
    progressFilterOnOff[targetProgressType] = 'off';
    localStorage.setItem('progress', JSON.stringify(progressFilterOnOff));
    let filtered = [...allLists].filter(list => list.children[0].classList.contains(`${targetProgressType}`));
    filtered.forEach(list => list.style.display = 'none');
    opacityDown(target);
  } 
  else {
    progressFilterOnOff[targetProgressType] = 'on';
    localStorage.setItem('progress', JSON.stringify(progressFilterOnOff));
    let filtered = [...allLists].filter(list => list.children[0].classList.contains(`${targetProgressType}`));
    filtered.forEach(list => list.style.display = 'flex');
    opacityUp(target);
  }
}

function progressOnState() {
  // code here
}

function progressOfState() {
  // code here
}

//-----------------------------------------------css----------------------------------------------------

function opacityDown(target) {
  target.style.opacity = 0.5;
}

function opacityUp(target) {
  target.style.opacity = 1;
}