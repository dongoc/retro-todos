/**
 * 해야할 것 : 
 * 3. date 고민하기
 * 4. this
 * 5. 폴님이 주신 영상 보기
 * 6. 재귀 사용하기
 */

const todoInput = document.querySelector('#todoInput');
const ul = document.querySelector('ul');

// data & local storage
var todoData = [];
if (localStorage.getItem('todo')) {
  todoData = JSON.parse(localStorage.getItem('todo'))
}

var progressFilterOnOff = {not_started: 'on', in_progress: 'on', completed: 'on'};
if (localStorage.getItem('progress')) {
  progressFilterOnOff = JSON.parse(localStorage.getItem('progress'))
}
localStorageSetItem('progress', progressFilterOnOff);

//--------------------------------------create---------------------------------
function createEl(tagName, className) {
  let el = document.createElement(tagName);
  let classList = [...arguments].slice(1);
  if (classList.length) {
    for (let i of classList) {
      el.classList.add(`${i}`);
    }
  }
  return el;
}

function createListEl(data) {
  // create all tags
  const li = document.createElement('li');
  li.id = data.id;
  
  const progressBtnContainer = createEl('div', 'progressBtn_container')

  const progressBtn = createEl('button', 'progress_button', `${data.progress}`)
  progressBtn.addEventListener('click', changeProgressStatus); 
  progressBtnContainer.append(progressBtn);

  const contentContainer = createEl('div', 'content_container')

  const todoContent = createEl('div', 'todos')
  todoContent.textContent = data.todo;

  const hr = document.createElement('hr');

  const createdDate = createEl('div', 'createdDate')
  createdDate.textContent = data.createdAt;

  const editContaitner = createEl('div', 'edit_container')

  const editBtn = createEl('button', 'listBtn', 'editBtn')
  editBtn.addEventListener('click', editTodoList);

  const deleteBtn = createEl('button', 'listBtn', 'deleteBtn')
  deleteBtn.addEventListener('click', deleteTodoList); 

  // append
  contentContainer.append(todoContent, hr, createdDate);
  editContaitner.append(editBtn, deleteBtn);
  li.append(progressBtnContainer, contentContainer, editContaitner);

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
      localStorageSetItem('todo', todoData);
  
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
    let targetList = todoData.filter(list => list.id === Number(target.parentElement.id))
    targetList[0].progress = `${progressType[targetProgressIdx + 1]}`;
    localStorageSetItem('todo', todoData);
  }
}

function editTodoList(event) {
  event.preventDefault();
  // opacityUp(event.target);
  // event.target.removeEventListener(editTodoList);
  // event.target.addEventListener('click', completeEditTodoList);

  let target = event.target.parentElement.parentElement.children[1].children[0];
  target.style.display = 'none';

  const editInput = document.createElement('input');
  editInput.setAttribute('type', 'text');
  editInput.classList.add('edit_input')
  target.after(editInput);
  editInput.value = target.textContent;
  editInput.addEventListener('keydown', isEnterKey);
}

function isEnterKey(event) {
  if (event.keyCode === 13) {
    completeEditTodoList(event);
  }
}

function completeEditTodoList(event) {
  event.preventDefault();
  event.target.style.display = 'none';
  let target = event.target.parentElement.parentElement.children[1].children[0];
  target.style.display = 'block';
  target.textContent = event.target.value;

  // [리팩토링]
  let editedList = todoData.filter(list => list.id === Number(event.target.parentElement.parentElement.id))[0]
  let editedListIdx = todoData.indexOf(editedList);
  editedList.todo = target.textContent;
  todoData.splice(editedListIdx, 1, editedList)
  localStorageSetItem('todo', todoData);
  
  // event.target.removeEventListener(completeEditTodoList);
  // event.target.addEventListener('click', editTodoList);
  // opacityDown(event.target);
} 
//-------------------------------------delete---------------------------------------
function deleteTodoList(event) {
  event.preventDefault();
  if (confirm('Are you sure?')) {
    let target = event.target; 
    // find li element
    let targetLiEl = target.parentElement.parentElement
    todoData.splice(findLi(target), 1);
    localStorageSetItem('todo', todoData)
    targetLiEl.remove();
  };
}

function removeAllAtScreen() {
  const allList = document.querySelectorAll('li');
  allList.forEach(el => el.remove());
}

const deleteAllBtn = document.querySelector('#deleteAll_img') 
deleteAllBtn.addEventListener('click', localStorageClear);

function localStorageClear(event) {
  event.preventDefault();
  if (confirm('All Lists will be deleted.')) {
    removeAllAtScreen() 
    todoData = [];
    localStorage.clear();
  }
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
// filter by progress
const filterRedBtn = document.querySelector('.not_started');
const filterYellowBtn = document.querySelector('.in_progress');
const filterGreenBtn = document.querySelector('.completed');

const progressFilterButtons = [filterRedBtn, filterYellowBtn, filterGreenBtn];

filterRedBtn.addEventListener('click', filterByProgress);
filterYellowBtn.addEventListener('click', filterByProgress);
filterGreenBtn.addEventListener('click', filterByProgress);

function progressFilterDefault() {
  let allLists = document.querySelectorAll('li');
  let progressType = ['not_started', 'in_progress', 'completed'];

  progressType.forEach(function(type) {
    if (progressFilterOnOff[type] === 'on') {
      displayFlex(allLists, type)
    } 
    else {
      displayNone(allLists, type)
      let offBtn = progressFilterButtons.filter(function(el) {
        let type = [...el.classList].filter(className => progressType.includes(className));
        return progressFilterOnOff[type] === 'off';
      })
      offBtn.forEach(el => changeClassName(el, 'on', 'off'))
    }
  })
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
    changeClassName(target, 'on', 'off')
    localStorageSetItem('progress', progressFilterOnOff);
    displayNone(allLists, targetProgressType);
  } 
  else {
    progressFilterOnOff[targetProgressType] = 'on';
    changeClassName(target, 'off', 'on')
    localStorageSetItem('progress', progressFilterOnOff)
    displayFlex(allLists, targetProgressType);
  }
}
//-----------------------------------------------css----------------------------------------------------
function opacityDown(target) {
  target.style.opacity = 0.5;
}

function opacityUp(target) {
  target.style.opacity = 1;
}

function displayNone(lists, targetProgressType) {
  let filtered = [...lists].filter(list => list.children[0].children[0].classList.contains(`${targetProgressType}`));
  filtered.forEach(list => list.style.display = 'none');
}

function displayFlex(lists, targetProgressType) {
  let filtered = [...lists].filter(list => list.children[0].children[0].classList.contains(`${targetProgressType}`));
  filtered.forEach(list => list.style.display = 'flex');
}

deleteAllBtn.addEventListener('mouseover', function(event) {
  event.preventDefault;
  deleteAllBtn.setAttribute('src', "image/trashopened.png")
})
deleteAllBtn.addEventListener('mouseout', function(event) {
  event.preventDefault;
  deleteAllBtn.setAttribute('src', "image/trashclosed.png")
})
//------------------------------------local storage-------------------------------------------------
function localStorageSetItem(key, item) {
  localStorage.setItem(key, JSON.stringify(item));
}

//-----------------------------------------------else-------------------------------------------------------
function findLi(target) {
  let allLists = [...document.querySelectorAll('li')];
  if (target.parentElement === ul) {
    return undefined;
  }
  if (allLists.includes(target.parentElement)) {
    return target.parentElement.id;
  } else {
    findLi(target.parentElement);
  }
}

function changeClassName(element, before, after) {
  element.classList.remove(before);
  element.classList.add(after);
}

/* [paul] find the li el
 removeFromList(text) {
    let list = document.querySelector(‘ul’);
    let childs = Array.from(list.childNodes);
    let removable = child.find((i) => i.innerText === text);
    return item;
  }
*/