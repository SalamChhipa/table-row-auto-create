const header = [
  ["first name", "text"],
  ["last name", "text"],
  ["age", "number"],
  ["salary", "number"],
];

let tableData = [];

let table = document.createElement("div");

table.setAttribute("class", "container");

let headerRow = document.createElement("div");

headerRow.setAttribute("class", "headerRow");

const createTable = () => {
  header.forEach((heading,index) => {
    let th = document.createElement("div");
    th.setAttribute("class", "cell");
    th.innerText = heading[0];
    const button = document.createElement("button");
    button.innerText = "sort";
    button.style.float = "right";
    button.setAttribute("onclick", "sortTableData(" + index +")");
    th.append(button);
    headerRow.append(th);
  });
  table.append(headerRow);
  document.body.append(table);
};

const createRow = () => {
  let newRow = document.createElement("div");
  newRow.setAttribute("class", "row");
  newRow.setAttribute("draggable", "true");
  header.forEach((heading) => {
    let td = document.createElement("div");
    td.setAttribute("class", "cell");
    let input = document.createElement("input");
    input.setAttribute("type", heading[1]);
    input.setAttribute("value", "");
    input.setAttribute("oninput", "isRowFull(event)");
    td.append(input);
    newRow.append(td);
  });
  table.appendChild(newRow);

  newRow.addEventListener("dragstart", handleDragStart);
  newRow.addEventListener("dragover", handleDragOver);
  newRow.addEventListener("drop", handleDrop);
};

// Drag start event handler
let dragdata = []
let dragRow;
const handleDragStart = (event) => {
  dragRow = event.target;
  for(let i = 0 ; i < header.length; i++){
    dragdata.push(dragRow.children[i].children[0].value)
  }
};

// Drag over event handler
const handleDragOver = (event) => {
  event.preventDefault();
};

// Drop event handler
let dropdata = []
const handleDrop = (event) => {
  let dropRow = event.target.closest(".row")
  event.preventDefault();
  for(let i = 0 ; i < header.length; i++){
    dropdata.push(dropRow.children[i].children[0].value)
  }
  for(let i = 0; i < header.length; i++){
    dragRow.children[i].children[0].value = dropdata[i]
    dropRow.children[i].children[0].value = dragdata[i]
  }
  dropdata = []
  dragdata = []
  dragRow= "" 
};

const isRowFull = (event) => {
  let allFilled = true;
  const parentChild = event.target.parentElement.parentElement.children;
  for (const child of parentChild) {
    if (child.children[0].value === "") allFilled = false;
  }
  if (allFilled) {
    for (const child of parentChild) {
      child.children[0].removeAttribute("oninput");
      child.children[0].setAttribute("oninput", "checkLastRow(event)");
    }
    createRow();
  }
};

const allEmpty = () => {
  for (let i = 0; i < header.length; i++)
    if (table.lastElementChild.children[i].children[0].value !== "")
      return false;
  return true;
};

const anyEmpty = (event) => {
  const parentChild = event.target.parentElement.parentElement.children;
  for (const child of parentChild)
    if (child.children[0].value === "") return true;
  return false;
};

const checkLastRow = (event) => {
  const parentChild = event.target.parentElement.parentElement.children;
  if (allEmpty() && anyEmpty(event)) {
    table.removeChild(table.lastElementChild);
    for (const child of parentChild) {
      child.children[0].removeAttribute("oninput");
      child.children[0].setAttribute("oninput", "isRowFull(event)");
    }
  }
};
const allRow = document.getElementsByClassName("row");

const sortTableData = (index) => {
  tableData = [];
  //get data and push
  
  for(const row of allRow){
    const  temp= [];
    for(let i=0;i<row.childElementCount;i++)
      temp.push(row.children[i].children[0].value)
    tableData.push(temp)
  }
  
  allEmpty()? tableData.pop() : null;
  // //sort

  tableData.sort((a, b) => {
    const first = a[index];
    const second = b[index];
    if (isNaN(parseFloat(first)) && isNaN(parseFloat(second))) {
      return first.toUpperCase() < second.toUpperCase()
        ? -1
        : first.toUpperCase() > second.toUpperCase()
        ? 1
        : 0;
    } else {
      return parseFloat(first) - parseFloat(second);
    }
  });
  //update
  tableData.forEach((rowData, index) => {
    rowData.forEach((heading, columnIndex) => {
      let input = table.children[index+1].children[columnIndex].children[0]
      input.value = heading;
    });
  });
  tableData = [];
};

createTable();
createRow();
