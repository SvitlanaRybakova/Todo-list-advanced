const initDataTodo = key => localStorage.getItem(key) ?
JSON.parse(localStorage.getItem(key)) : [];

const updateDataTodo = (key, todoData) => localStorage.setItem(key, JSON.stringify(todoData));


const createToDo = (title, form, list) => {
  const todoContainer = document.createElement('div');
  const todoRow = document.createElement('div');
  const todoHeader = document.createElement('h1');
  const wrapperForm = document.createElement('div');
  const wrapperList = document.createElement('div');


  todoContainer.classList.add('container');
  todoRow.classList.add('row');
  todoHeader.classList.add('text-center', 'mb-5');
  wrapperForm.classList.add('col-6');
  wrapperList.classList.add('col-6');

  todoHeader.textContent = title;

  wrapperForm.append(form);
  wrapperList.append(list);
  todoRow.append(wrapperForm, wrapperList);
  todoContainer.append(todoHeader, todoRow);

  return todoContainer;
};

const createListTodo = () => {
  const listTodo = document.createElement('ul');
  listTodo.classList.add('list-group');
  return listTodo;
};

const createItemTodo = (item, listTodo) => {
  const itemTodo = document.createElement('li');
  const btnItem = document.createElement('button');

  itemTodo.classList.add('list-group-item', 'p-0', 'mb-3', 'border-0');
  btnItem.classList.add('list-item','btn', 'btn-block', 'border-primary', 
  item.success ? 'btn-success' : 'btn-light');
  btnItem.textContent = item.nameTodo;
  btnItem.id = item.id;
  
  itemTodo.append(btnItem);
  listTodo.append(itemTodo);
  // return itemTodo;
}

const createFormToDo =  () => {
  const form = document.createElement('form');
  const input = document.createElement('input');
  const textArea = document.createElement('textarea');
  const btnSubmit = document.createElement('button');

  // input.setAttribute('placeholder', '121');
  input.placeholder = 'title';
  textArea.placeholder = 'decsription';

  btnSubmit.textContent = 'add';
  btnSubmit.type = 'submit';

  form.classList.add('form-group');
  input.classList.add('form-control', 'mb-3');
  textArea.classList.add('form-control', 'mb-3');
  btnSubmit.classList.add('btn', 'btn-primary', 'btn-lg', 'btn-block');

  form.append(input, textArea, btnSubmit);

  return { input, textArea, btnSubmit, form };
}

const addTodoItem = (todoData, listTodo, nameTodo, descriptionTodo, key) => {
  const id = `id${(+new Date()).toString(16)}`;
  todoData.push({ id, nameTodo, descriptionTodo, success: false });
  updateTodo(listTodo, todoData, key);
  console.log(todoData);
}

const createModal = () => {
  const modalElem = document.createElement('div');
  const modalDialog = document.createElement('div');
  const modalContent = document.createElement('div');
  const modalHeader = document.createElement('div');
  const modalBody = document.createElement('div');
  const modalFooter = document.createElement('div');
  const itemTitle = document.createElement('h2');
  const itemDescription = document.createElement('p');
  const btnClose = document.createElement('button');
  const btnReady = document.createElement('button');
  const btnDelete = document.createElement('button');

  modalElem.classList.add('modal');
  modalDialog.classList.add('modal-dialog');
  modalContent.classList.add('modal-content');
  modalHeader.classList.add('modal-header');
  modalBody.classList.add('modal-body');
  modalFooter.classList.add('modal-footer');
  itemTitle.classList.add('modal-title');
  btnClose.classList.add('close', 'btn-modal');
  btnReady.classList.add('btn', 'btn-success', 'btn-modal');
  btnDelete.classList.add('btn', 'btn-danger', 'btn-delete', 'btn-modal');

  btnClose.innerHTML = '&times;';
  btnReady.textContent = 'Comlete';
  btnDelete.textContent = 'Delete';


  modalDialog.append(modalContent);
  modalContent.append(modalHeader, modalBody, modalFooter);
  modalHeader.append(itemTitle, btnClose);
  modalBody.append(itemDescription);
  modalFooter.append(btnReady, btnDelete);

  modalElem.append(modalDialog);

  // закрывать модалку
  const closeModal = (event) => {
    const target = event.target;
    if (target.classList.contains('btn-modal') || target === modalElem) {
      modalElem.classList.remove('d-block');
    }
  };


  // отображать модалку
  const showModal = (titleTodo, descritionTodo, id) => {
    modalElem.dataset.idItem = id;
    modalElem.classList.add('d-block');
    itemTitle.textContent = titleTodo;
    itemDescription.textContent = descritionTodo;
  }

  modalElem.addEventListener('click', closeModal);
  return { modalElem, btnReady, btnDelete, showModal }
}

const updateTodo = (listTodo, todoData, key) => {
  listTodo.textContent = '';
  todoData.forEach(item => createItemTodo(item, listTodo));
  updateDataTodo(key, todoData);
}

const initTodo = (selector) => {

  const key = prompt('Enter your password');
  const todoData = initDataTodo(key);

  const wrapper = document.querySelector(selector);
  const formTodo = createFormToDo();
  const listTodo = createListTodo();
  const todoApp = createToDo(key, formTodo.form, listTodo);
  const renderModal = createModal();

  document.body.append(renderModal.modalElem);

  wrapper.append(todoApp);
  formTodo.form.addEventListener('submit', event => {
    event.preventDefault();

    formTodo.input.classList.remove('is-invalid');
    formTodo.textArea.classList.remove('is-invalid');

    if (formTodo.input.value.trim() && formTodo.textArea.value.trim()) {

      addTodoItem(todoData, listTodo, formTodo.input.value, formTodo.textArea.value, key);
      formTodo.form.reset();
    } else {
      if (!formTodo.input.value) {
        formTodo.input.classList.add('is-invalid');
      }
      if (!formTodo.textArea.value) {
        formTodo.textArea.classList.add('is-invalid');
      }
    }

  });
  listTodo.addEventListener('click', event => {
    const target = event.target;

    if (target.classList.contains('list-item')){
      const item = todoData.find(elem => elem.id == target.id);
      renderModal.showModal(item.nameTodo, item.descriptionTodo, item.id);
    }
  });

  renderModal.btnReady.addEventListener('click', () => {
    const itemTodo =  todoData.find(elem => elem.id == renderModal.modalElem.dataset.idItem);
    itemTodo.success = !itemTodo.success;
    updateTodo(listTodo, todoData, key);
  });

  renderModal.btnDelete.addEventListener('click', () => {
  
    const index =  todoData.findIndex(elem => elem.id == renderModal.modalElem.dataset.idItem);
    todoData.splice(index, 1);
    updateTodo(listTodo, todoData, key);
    
  });
  document.title = key;
  updateTodo(listTodo, todoData, key);
}

initTodo('.app', 'ToDo list )))')

