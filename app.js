let add = document.querySelector("form button");
let toDoBox = document.querySelector("section");

add.addEventListener("click", (e) => {
  //Prevent form submit
  e.preventDefault();

  //Get input value
  let form = e.target.parentElement;
  let toDoText = form.children[0].value;
  let toDoMonth = form.children[1].value;
  let toDoDate = form.children[2].value;

  //Create Element
  let toDoItem = document.createElement("div");
  let text = document.createElement("p");
  let time = document.createElement("p");
  let completeBtn = document.createElement("button");
  let deleteBtn = document.createElement("button");
  //Check To Do
  if (toDoText == "") {
    alert("請輸入代辦事項");
    return;
  }
  if (toDoMonth > 12 || toDoMonth < 1) {
    alert("請輸入正確月份");
    return;
  }
  if (toDoDate > 31 || toDoDate < 1) {
    alert("請輸入正確日期");
    return;
  }
  //Put Value
  text.innerText = toDoText;
  time.innerText = toDoMonth + "/" + toDoDate;
  completeBtn.innerHTML = `<i class="far fa-check-square"></i>`;
  deleteBtn.innerHTML = `<i class="fas fa-trash"></i>`;

  //Add ClassName
  toDoItem.classList.add("todo");
  text.classList.add("to-do-text");
  time.classList.add("to-do-time");
  completeBtn.classList.add("complete");
  deleteBtn.classList.add("delete");

  //Animation
  toDoItem.style.animation = "scaleUp 0.3s forwards";

  //Create ToDo Item
  toDoItem.appendChild(text);
  toDoItem.appendChild(time);
  toDoItem.appendChild(completeBtn);
  toDoItem.appendChild(deleteBtn);
  toDoBox.appendChild(toDoItem);

  //Complete & Delete
  completeBtn.addEventListener("click", (e) => {
    let toDoItem = e.target.parentElement;
    console.log(e.target.parentElement);
    toDoItem.classList.toggle("done");
  });
  deleteBtn.addEventListener("click", (e) => {
    let deleteItem = e.target.parentElement;
    deleteItem.style.animation = "scaleDown 0.3s forwards";
    deleteItem.addEventListener("animationend", () => {
      let text = toDoItem.children[0].innerText;
      let myListArray = JSON.parse(localStorage.getItem("list"));
      myListArray.forEach((item, index) => {
        if (item.toDoText == text) {
          //Delete Object From Array Index , 1 Element
          myListArray.splice(index, 1);
          console.log(index);
          localStorage.setItem("list", JSON.stringify(myListArray));
        }
      });
      deleteItem.remove();
    });
  });

  //Clear To Do Input
  form.children[0].value = "";

  //Create Object
  let myToDo = {
    toDoText: toDoText,
    toDoMonth: toDoMonth,
    toDoDate: toDoDate,
  };

  //Store Data
  let myList = localStorage.getItem("list");
  if (myList == null) {
    localStorage.setItem("list", JSON.stringify([myToDo]));
  } else {
    let myListArray = JSON.parse(myList);
    myListArray.push(myToDo);
    localStorage.setItem("list", JSON.stringify(myListArray));
  }
  localStorage.clear;
  console.log(JSON.parse(localStorage.getItem("list")));
});

loadData();

//Load LocalStorage
function loadData() {
  let myList = localStorage.getItem("list");

  if (myList !== null) {
    let myListArray = JSON.parse(myList);

    myListArray.forEach((item) => {
      //Create Element
      let toDoItem = document.createElement("div");
      toDoItem.classList.add("todo");
      let text = document.createElement("p");
      text.classList.add("to-do-text");
      text.innerText = item.toDoText;
      let time = document.createElement("p");
      time.classList.add("to-do-time");
      time.innerText = item.toDoMonth + "/" + item.toDoDate;
      toDoItem.appendChild(text);
      toDoItem.appendChild(time);

      //Create Btn
      let completeBtn = document.createElement("button");
      let deleteBtn = document.createElement("button");
      completeBtn.classList.add("complete");
      deleteBtn.classList.add("delete");
      completeBtn.innerHTML = `<i class="far fa-check-square"></i>`;
      deleteBtn.innerHTML = `<i class="fas fa-trash"></i>`;

      //Btn feature
      completeBtn.addEventListener("click", (e) => {
        let toDoItem = e.target.parentElement;
        console.log(e.target.parentElement);
        toDoItem.classList.toggle("done");
      });
      deleteBtn.addEventListener("click", (e) => {
        let deleteItem = e.target.parentElement;
        deleteItem.style.animation = "scaleDown 0.3s forwards";
        deleteItem.addEventListener("animationend", () => {
          let text = toDoItem.children[0].innerText;
          let myListArray = JSON.parse(localStorage.getItem("list"));
          myListArray.forEach((item, index) => {
            console.log(item);
            if (item.toDoText == text) {
              myListArray.splice(index, 1);
              localStorage.setItem("list", JSON.stringify(myListArray));
            }
          });
          deleteItem.remove();
        });
      });

      //Create Element
      toDoItem.appendChild(completeBtn);
      toDoItem.appendChild(deleteBtn);
      toDoBox.appendChild(toDoItem);
    });
  }
}

//Sort
function mergeTime(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].toDoMonth) > Number(arr2[j].toDoMonth)) {
      result.push(arr2[j]);
      j++;
    } else if (Number(arr1[i].toDoMonth) < Number(arr2[j].toDoMonth)) {
      result.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].toDoMonth) == Number(arr2[j].toDoMonth)) {
      if (Number(arr1[i].toDoDate) > Number(arr2[j].toDoDate)) {
        result.push(arr2[j]);
        j++;
      } else {
        result.push(arr1[i]);
        i++;
      }
    }
  }

  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }
  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }

  return result;
}

function mergeSort(arr) {
  if (arr.length === 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let right = arr.slice(0, middle);
    let left = arr.slice(middle, arr.length);
    return mergeTime(mergeSort(right), mergeSort(left));
  }
}

let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
  // sort data
  let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
  localStorage.setItem("list", JSON.stringify(sortedArray));

  // remove data
  let len = toDoBox.children.length;
  for (let i = 0; i < len; i++) {
    toDoBox.children[0].remove();
  }

  // load data
  loadData();
});
