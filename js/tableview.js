let selectState = true;
let checkedCount = 0;
let displayObj = [];
let filteredObj = [];
let showAll = false;
let currentList, taskobj, taskid, basedon;
let flexitem = document.getElementById("flexitem");
let detailitem = document.getElementById("detailitem");
let toDoObj = [];
window.onload = contentList();
function addNewList() {
  var addNewList = document.getElementById("myForm");
  var newListBtn = document.getElementById("newlist");
  document.getElementById("listname").focus();
  var newListBtnPos = newListBtn.getBoundingClientRect();
  document.getElementById("crtlist").disabled = true;
  addNewList.style.display = "block";
  addNewList.style.top = newListBtnPos.bottom + newListBtnPos.height / 2 + "px";
  addNewList.style.left = newListBtnPos.left + "px";
}

function enableCrt() {
  var listName = document.getElementById("listname");
  var crtListBtn = document.getElementById("crtlist");
  crtListBtn.disabled = listName.value == "" ? true : false;
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
  var listName = document.getElementById("listname");
  listName.value = "";
}

function createList() {
  var listName = document.getElementById("listname");
  var objToPush = {
    id: toDoObj.length ? toDoObj[toDoObj.length - 1].id + 1 : 0,
    listname: listName.value,
    taskobjs: []
  };
  displayObj.push(objToPush);
  toDoObj.push(objToPush);
  listName.value = "";
  closeForm();
  contentList();
  event.preventDefault();
  window.scrollTo(0, window.innerHeight);
}

function contentList(obj = toDoObj) {
  if (displayObj.length == 0) displayObj = JSON.parse(JSON.stringify(toDoObj));
  let contentList = document.getElementById("contentList");
  contentList.style.display = "flex";
  contentList.innerHTML = "";
  for (let list of obj) {
    let item = flexitem.cloneNode(true);
    item.childNodes[5].innerText = list["listname"];
    item.childNodes[1].innerHTML = list["taskobjs"].length
      ? getValue(list["taskobjs"], "taskname").join("<br>")
      : "no tasks";
    item.setAttribute("id", list["id"]);
    // document.querySelector('#flexitem .overflow').setAttribute("id",list['id'])
    contentList.appendChild(item);
  }
}

function getValue(fromList, getKey) {
  return fromList.map(item => item[getKey]);
}

function filterObj(myArray, myFilter, key) {
  var filtered = [];
  for (var arr in myArray) {
    for (var filter in myFilter) {
      if (myArray[arr][key] !== myFilter[filter][key]) {
        filtered.push(myArray[arr]);
      }
    }
  }
  return filtered;
}

function selectList() {
  checkedCount = 0;
  document.getElementById("bottombar").style.display = selectState
    ? "flex"
    : "none";
  var checkboxes = document.querySelectorAll(
    "#contentList input[type=checkbox]"
  );
  for (let element of checkboxes) {
    element.style.display = selectState ? "inline-block" : "none";
  }
  selectState = selectState ? false : true;
}

function deleteSelected() {
  var checkboxes = document.querySelectorAll(
    "#contentList input[type=checkbox]"
  );
  let toDelete = [];
  for (let check in checkboxes) {
    if (checkboxes[check].checked) toDelete.push(displayObj[check]);
  }
  toDoObj = filterObj(toDoObj, toDelete, "id");
  displayObj = filterObj(toDoObj, toDelete, "id");
  selectList();
  document.getElementById("srchBar").focus();
  contentList(toDoObj);
}

function countCheck(event) {
  if (event.target.checked) checkedCount += 1;
  if (!event.target.checked) checkedCount -= 1;
  if (checkedCount == 1) document.getElementById("rename").disabled = false;
  if (checkedCount != 1) document.getElementById("rename").disabled = true;
  if (checkedCount == 0) document.getElementById("delete").disabled = true;
  if (checkedCount > 0) document.getElementById("delete").disabled = false;
  event.stopPropagation();
}

function renameSelected() {
  var renameForm = document.getElementById("renameForm");
  var checkboxes = document.querySelectorAll(
    "#contentList input[type=checkbox]"
  );
  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) break;
  }
  var elemToBeRenamed = checkboxes[i].parentNode.childNodes[5];
  var renamePopupPos = elemToBeRenamed.getBoundingClientRect();
  renameForm.style.display = "block";
  renameForm.style.top = renamePopupPos.bottom + renamePopupPos.height + "px";
  renameForm.style.left = renamePopupPos.left + renamePopupPos.width / 5 + "px";
  var newName = document.getElementById("newName");
  newName.value = elemToBeRenamed.innerText;
  newName.focus();
}

function rename(event) {
  var checkList = document.querySelectorAll(
    "#contentList input[type=checkbox]"
  );
  for (var i = 0; i < checkList.length; i++) {
    if (checkList[i].checked) break;
  }
  var newName = document.getElementById("newName").value;
  var listid = displayObj[i]["id"];
  displayObj[i]["listname"] = newName;
  for (let index in toDoObj) {
    if (toDoObj[index].id == listid) {
      toDoObj[index]["listname"] = newName;
      break;
    }
  }
  document.getElementById("renameForm").style.display = "none";
  selectList();
  document.getElementById("srchBar").focus();
  contentList();
  event.preventDefault();
}

function closeRename(event) {
  document.getElementById("renameForm").style.display = "none";
  event.preventDefault();
}

function attachSearch() {
  let searchBar = document.getElementById("searchBar");
  searchBar.style.display = searchBar.style.display == "flex" ? "none" : "flex";
  if (searchBar.style.display == "none") contentList();
  if (searchBar.style.display == "flex") {
    var srchBar = document.getElementById("srchBar");
    srchBar.value = "";
    srchBar.focus();
  }
}

function searchList(event) {
  var srchValue = document.getElementById("srchBar").value;
  displayObj = toDoObj.filter(value =>
    value["listname"].toLowerCase().includes(srchValue.toLowerCase())
  );
  contentList(displayObj);
}

function highlight(event) {
  currentList = null;
  taskobj = null;
  basedon = event.target.innerText;
  if (basedon == "Lists") goHome();
  if (basedon != "Lists") filter();
}

function hideList() {
  if (basedon == "Today") {
    document
      .querySelector(".btn-group #todaytab")
      .setAttribute("class", "active");
    document.querySelector(".btn-group #scheduledtab").removeAttribute("class");
  }
  if (basedon == "Scheduled") {
    document.querySelector(".btn-group #todaytab").removeAttribute("class");
    document
      .querySelector(".btn-group #scheduledtab")
      .setAttribute("class", "active");
  }
  document.getElementById("contentList").style.display = "none";
  document.getElementById("bottombar").style.display = "none";
  document.getElementById("navbar").style.display = "none";
  document.getElementById("searchBar").style.display = "none";
  document.getElementById("tasknavbar").style.display = "flex";
}

function goHome() {
  document
    .querySelector(".btn-group #liststab")
    .setAttribute("class", "active");
  document.getElementById("contentList").style.display = "flex";
  document.getElementById("navbar").style.display = "flex";
  document.getElementById("tasknavbar").style.display = "none";
  document.getElementById("taskcontainer").style.display = "none";
  document.getElementById("donetaskbar").style.display = "none";
  contentList();
}

function openListParent(event) {
  currentList = event.target.parentNode.id;
  openList();
  event.stopPropagation();
}

function openList(event) {
  if (event) currentList = event.target.id;
  hideList();
  taskObj = toDoObj[currentList]["taskobjs"];
  let taskcontainer = document.getElementById("taskcontainer");
  taskcontainer.innerHTML = "";
  detailitem.style.display = "none";
  taskcontainer.appendChild(detailitem);
  taskcontainer.style.display = "flex";
  let showDone = false;
  let countDone = 0;
  taskObj.forEach(task => {
    let item = document.createElement("div");
    item.setAttribute("class", "taskflex-item taskitem");
    let check = document.createElement("input");
    check.setAttribute("type", "checkbox");
    check.checked = task["completed"];
    check.setAttribute("onclick", "makeDone(event)");
    check.setAttribute("id", "chk" + task["id"]);
    item.setAttribute("id", "tsk" + task["id"]);
    item.setAttribute("onclick", "expand(event)");
    item.appendChild(check);
    item.appendChild(document.createTextNode(task["taskname"]));
    taskcontainer.appendChild(item);
    if (check.checked) {
      showDone = true;
      countDone++;
    }
    item.style.display = check.checked ? "none" : "flex";
    if (showAll) item.style.display = "flex";
  });
  document.getElementById("donetaskbar").style.display = showDone
    ? "flex"
    : "none";
  document.getElementById("showDone").innerHTML = "Done (" + countDone + ")";
  let item = document.createElement("div");
  item.setAttribute("class", "taskflex-item taskitem");
  let btn = document.createElement("button");
  btn.setAttribute("onclick", "addTask(event)");
  btn.innerHTML = "Add";
  item.appendChild(btn);
  item.appendChild(document.createTextNode("New task"));
  taskcontainer.appendChild(item);
}

function makeDone(event) {
  if (!currentList) return makeFilterDone(event);
  taskid = event.target.parentNode.id.slice(3);
  taskobj = toDoObj[currentList]["taskobjs"];
  let index = getValue(taskobj, "id").indexOf(parseInt(taskid));
  taskobj[index]["completed"] = event.target.checked;
  openList();
  event.stopPropagation();
}

function showDoneTask() {
  showAll = showAll ? false : true;
  currentList ? openList() : filter();
}

function expand(event) {
  if (detailitem.style.display == "flex") return;
  if (!currentList) return filterExpand(event);
  let currentTask = event.target.textContent;
  let addnew = event.target;
  addnew.removeChild(addnew.lastChild);
  let text = document.createElement("input");
  text.setAttribute("type", "text");
  addnew.appendChild(text);
  text.value = currentTask;
  text.focus();
  detailitem.style.display = "flex";
  event.target.insertAdjacentElement("afterend", detailitem);
  taskid = event.target.id.slice(3);
  taskobj = toDoObj[currentList]["taskobjs"];
  let index = getValue(taskobj, "id").indexOf(parseInt(taskid));
  document.querySelector("#detailitem textarea").value =
    taskobj[index]["notes"];
  document.querySelector("#detailitem select").value =
    taskobj[index]["priority"];
  document.querySelector('#detailitem input[type="date"]').value =
    taskobj[index]["date"];
}

function savedetails(event) {
  if (!currentList) return saveFilterDetails(event);
  taskid = event.target.parentNode.parentNode.parentNode.previousSibling.id.slice(
    3
  );
  taskobj = toDoObj[currentList]["taskobjs"];
  let index = getValue(taskobj, "id").indexOf(parseInt(taskid));
  taskobj[index]["notes"] = document.querySelector(
    "#detailitem textarea"
  ).value;
  taskobj[index]["priority"] = document.querySelector(
    "#detailitem select"
  ).value;
  taskobj[index]["date"] = document.querySelector(
    '#detailitem input[type="date"]'
  ).value;
  taskobj[index]["taskname"] = document.querySelector(
    ".taskitem input[type=text]"
  ).value;
  let details = document.getElementById("detailitem");
  details.style.display = "none";
  openList();
}

function deleteTask() {
  if (!currentList) return deleteFilterTask(event);
  taskid = event.target.parentNode.parentNode.parentNode.previousSibling.id.slice(
    3
  );
  taskobj = toDoObj[currentList]["taskobjs"];
  let index = getValue(taskobj, "id").indexOf(parseInt(taskid));
  taskobj.splice(index, 1);
  openList();
}

function addTask(event) {
  let addnew = event.target.parentNode;
  addnew.removeChild(addnew.lastChild);
  let text = document.createElement("input");
  text.setAttribute("type", "text");
  text.setAttribute("onkeyup", "appendTask(event)");
  addnew.appendChild(text);
  text.focus();
}

function appendTask(event) {
  if (event.keyCode !== 13) return;
  let newTask = event.target.value;
  if (newTask == "") return;
  taskobj = toDoObj[currentList]["taskobjs"];
  taskobj.push({
    taskname: newTask,
    completed: false,
    notes: "",
    priority: 0,
    date: "",
    id: taskobj.length ? taskobj[taskobj.length - 1].id + 1 : 0
  });
  openList();
}

function clearCompleted() {
  if (!currentList) return clearFilterCompleted();
  taskobj = toDoObj[currentList]["taskobjs"];
  toDoObj[currentList]["taskobjs"] = taskobj.filter(task => {
    return task["completed"] == false;
  });
  openList();
}

function filter() {
  filteredObj = [];
  let todayDate = new Date().toJSON().slice(0, 10);
  for (let list of toDoObj) {
    for (let task of list["taskobjs"]) {
      if (basedon == "Today" && task["date"] == todayDate)
        filteredObj.push([task, list]);
      if (basedon == "Scheduled" && task["date"] != "")
        filteredObj.push([task, list]);
    }
  }
  hideList();
  let taskcontainer = document.getElementById("taskcontainer");
  taskcontainer.innerHTML = "";
  detailitem.style.display = "none";
  taskcontainer.appendChild(detailitem);
  taskcontainer.style.display = "flex";
  let showDone = false;
  let countDone = 0;
  filteredObj.forEach(([task, list]) => {
    let item = document.createElement("div");
    item.setAttribute("class", "taskflex-item taskitem");
    let check = document.createElement("input");
    check.setAttribute("type", "checkbox");
    check.checked = task["completed"];
    check.setAttribute("onclick", "makeDone(event)");
    check.setAttribute("id", list["id"] + "|" + task["id"]);
    item.setAttribute("id", list["id"] + "|" + task["id"]);
    item.setAttribute("onclick", "expand(event)");
    item.appendChild(check);
    let duedate = document.createElement("p");
    duedate.innerText = task["date"];
    let displayName = document.createElement("p");
    displayName.innerText = list["listname"];
    item.appendChild(document.createTextNode(task["taskname"]));
    item.appendChild(duedate);
    item.appendChild(displayName);
    taskcontainer.appendChild(item);
    if (check.checked) {
      showDone = true;
      countDone++;
    }
    item.style.display = check.checked ? "none" : "flex";
    if (showAll) item.style.display = "flex";
  });
  document.getElementById("donetaskbar").style.display = showDone
    ? "flex"
    : "none";
  document.getElementById("showDone").innerHTML = "Done (" + countDone + ")";
}

function makeFilterDone(event) {
  [listid, taskid] = event.target.id.split("|");
  taskobj = toDoObj[listid]["taskobjs"];
  let index = getValue(taskobj, "id").indexOf(parseInt(taskid));
  taskobj[index]["completed"] = event.target.checked;
  filter();
  event.stopPropagation();
}

function filterExpand(event) {
  let item = event.target;
  if (event.target.tagName == "P") item = event.target.parentNode;
  let [listid, taskid] = item.id.split("|");
  let currentTask = item.childNodes[1].textContent;
  let temp = item.firstChild;
  item.innerHTML = "";
  item.append(temp);
  let text = document.createElement("input");
  text.setAttribute("type", "text");
  item.appendChild(text);
  text.value = currentTask;
  text.focus();
  detailitem.style.display = "flex";
  item.insertAdjacentElement("afterend", detailitem);
  taskobj = toDoObj[listid]["taskobjs"];
  let index = getValue(taskobj, "id").indexOf(parseInt(taskid));
  document.querySelector("#detailitem textarea").value =
    taskobj[index]["notes"];
  document.querySelector("#detailitem select").value =
    taskobj[index]["priority"];
  document.querySelector('#detailitem input[type="date"]').value =
    taskobj[index]["date"];
}

function deleteFilterTask(event) {
  [
    listid,
    taskid
  ] = event.target.parentNode.parentNode.parentNode.previousSibling.id.split(
    "|"
  );
  taskobj = toDoObj[listid]["taskobjs"];
  let index = getValue(taskobj, "id").indexOf(parseInt(taskid));
  taskobj.splice(index, 1);
  filter();
}

function saveFilterDetails(event) {
  [
    listid,
    taskid
  ] = event.target.parentNode.parentNode.parentNode.previousSibling.id.split(
    "|"
  );
  taskobj = toDoObj[listid]["taskobjs"];
  let index = getValue(taskobj, "id").indexOf(parseInt(taskid));
  taskobj[index]["notes"] = document.querySelector(
    "#detailitem textarea"
  ).value;
  taskobj[index]["priority"] = document.querySelector(
    "#detailitem select"
  ).value;
  taskobj[index]["date"] = document.querySelector(
    '#detailitem input[type="date"]'
  ).value;
  taskobj[index]["taskname"] = document.querySelector(
    ".taskitem input[type=text]"
  ).value;
  let details = document.getElementById("detailitem");
  details.style.display = "none";
  filter();
}

function clearFilterCompleted() {
  let todayDate = new Date().toJSON().slice(0, 10);
  for (let listIdx in toDoObj) {
    taskobj = toDoObj[listIdx]["taskobjs"];
    toDoObj[listIdx]["taskobjs"] = taskobj.filter(task => {
      if (basedon == "Today" && task["date"] == todayDate)
        return task["completed"] == false;
      if (basedon == "Scheduled" && task["date"] != "")
        return task["completed"] == false;
      return true;
    });
  }
  filter();
}
