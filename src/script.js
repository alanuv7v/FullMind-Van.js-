import van from "vanjs-core"
import { createEvent, createStore } from "effector" 

import * as yaml from 'yaml'
import { MultilineTextarea, resizeTextarea } from "./comps/MultilineTextarea"


//util
const log = (text) => console.log(text)

const t = van.tags
const {div, span, button, textarea} = t
/* destructuring 만세!! */
const d = div

//global variables
const global = {}

let head = (async function () {return await import('./data/heads/head_1.yaml')})()


let testObj = {
  fruits: {
    apple: {
      color: 'red',
      taste: ['sweet', 'sour']
    }
  }
}

//App

const App = (head) => {

  global.ContextMenu = ContextMenu()

  console.log("!!!!!", head)

  return div({id: 'App'},
    div({innerText: "Diver", class:"main"}
    ),
    div({id: "container"}),
    div({id: "view", class:"main"},
    
      InOutInterface({key: 'testObj', values: head}, 10)
    ),
    global.ContextMenu
  )
}



let initTargets = {
  'MultilineTextarea' : []
}

const InOutInterface = (data, iteration) => {
  if (iteration < 1) {
    return
  }
  if (!data) {
    return
  }

  let key_ = MultilineTextarea(
    textarea({style: "color: #8adfd8"}, data.key),
    textarea({style: "color: #8adfd8"}, data.key)
  )
  initTargets['MultilineTextarea'].push(key_)

  let values_ = []
  
  if (typeof data.values != 'object' || data.values == null) {
    values_ = MultilineTextarea(
      textarea({oninput: (event) => {
        data.values = event.target.value
        console.log(data, head)
      }}, data.values),
      textarea(data.values)
    )
    initTargets['MultilineTextarea'].push(values_)
  } else {
    let children = []
    
    for (let e of Object.entries(data.values)) {
      children.push({key: e[0], values: e[1]})
    }
    
    for (let child of children) {
      values_.push(IOI(child, iteration))
    }
  }
  iteration--

  let valueWrapper = d({style: "padding-left: 1em; padding-bottom: 1em; padding-right: 1em;"},
        values_
    )

  let foldArrow = d({style: "margin-left: auto"}, "\u25BD")

  function onIOIwheel(event) {
    event.preventDefault()
    event.stopPropagation()
    if (event.deltaY < 0) {//up, fold
        valueWrapper.style.display = "none";
        foldArrow.innerText = "\u25C1"
    }
    else { //open
        valueWrapper.style.display = "block";
        foldArrow.innerText = "\u25BD"
    }
  }



  return div({class: "main IOI", onwheel: () => onIOIwheel(event)}, 
    d({style: "display:flex; flex-direction: row"},
        key_,
        foldArrow
    ),
    valueWrapper
  )
}

const IOI = InOutInterface



const MenuItem = (menuIndex, name, action, children) => {
  console.log('At MenuItem init, menus.getState() = ', JSON.stringify(menus.getState(), null, 2) + '. Index is ' + menuIndex)  
  return button({onclick: (event) => {
    action();
    updateContextMenu({fromIndex: menuIndex, toAdd: children});
  }}, name
  )
}

const Menu = (menuItems) => {
  let index = menus.getState().length
  let MenuItems = []
  for (let m of menuItems) {
    MenuItems.push(MenuItem(index, m.name, m.action, m.children))
  }
  return div({style: "display: flex; flex-direction: row"}, MenuItems)
}
global.menus = createStore([])
let menus = global.menus

menus.watch(ms => {
  if (global.ContextMenu) {
    while (global.ContextMenu.hasChildNodes()) {
      global.ContextMenu.firstChild.remove() 
    }
    for (let menuItems of ms) {
      menuItems = Array.isArray(menuItems) ? menuItems : [menuItems]
      global.ContextMenu.append(Menu(menuItems))
    }
  }
})

let updateContextMenu = createEvent()

menus
  .on(updateContextMenu, function(prev, props) {
        let {fromIndex, toAdd} = props
        console.log('update ContextMenu: ' + JSON.stringify([...prev.slice(0, fromIndex), toAdd], null, 2))
        return [...prev.slice(0, fromIndex), toAdd]
      })

  /* 
function updateMenus(fromIndex, childrenMenus) {
  menus.val = [...menus.val.slice(0, fromIndex), childrenMenus]
  return menus.val
} */


const ContextMenu = () => {

  return d({style: "bottom: 0px; display: flex; flex-direction: column-reverse; z-index: 2; border: 1px solid white; width: 100%; padding: 0.5em;"})
}


function init() {

  let defaultMenu = [
    {name: 'Item', action: function() {alert('!')}, 
      children: [
        {name: 'child 1'}, 
        {name: 'child 2', action: function() {alert('child 2')}, 
          children: [{name: 'childrennnn'}]
        }
      ]
    }
  ]

  for (let mt of initTargets['MultilineTextarea']) {
    resizeTextarea(mt.children[0], mt.children[1])
  }

  updateContextMenu({fromIndex: 0, toAdd: defaultMenu})

  var sample = {
    name: "Alice",
    age: 25,
    address: {
      city: "Seoul",
      country: "South Korea"
    }
  };
  
  var container = document.getElementById ("container");
  
// A function that creates an input element for each property of a nested object
// obj: the nested object
// parent: the parent element to append the input elements
// path: an array of keys that represents the path of the property
function createInputs (obj, parent, path) {
  // Loop through each property of the object
  for (var key in obj) {
    // If the property is an object, call the function recursively with the new path
    if (typeof obj[key] === "object") {
      createInputs (obj[key], parent, path.concat (key));
    } else {
      // Otherwise, create an input element and set its value and name attributes
      var input = document.createElement ("input");
      input.type = "text";
      input.value = obj[key];
      input.name = path.concat (key).join ("."); // The name attribute is the dot-separated path of the property
      // Add an event listener that updates the object when the input value changes
      input.addEventListener ("keydown", function (e) {
        console.log(JSON.stringify(sample, null, 2));
        // Split the name attribute by dots to get the path of the property
        var keys = e.target.name.split (".");
        // Use reduce to access the nested property and assign the new value
        keys.reduce (function (accumulated, current, i) {
          // If it is the last key, assign the new value
          if (i === keys.length - 1) {
            accumulated[current] = e.target.value;
          } else {
            // Otherwise, return the next object
            return accumulated[current];
          }
        }, obj);
      });
      // Append the input element to the parent element
      parent.appendChild (input);
    }
  }
}
createInputs (sample, container, []);

}



head.then((h) => {
    
  van.add(document.body, App(head = h.default))
  init()

})



