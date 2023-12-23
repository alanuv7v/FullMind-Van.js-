import van from "vanjs-core"
import { createEvent, createStore } from "effector" 

import * as yaml from 'yaml'
import { MultilineTextarea, resizeTextarea } from "./comps/MultilineTextarea"


/* 
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
codeanywhere에서 변경사항 있을 시 커밋 뿐만 아니라 push도 꼭 해야한다. 하고나서 깃허브에서 잘됬는지 한번더 확인할것
*/

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




let initTargets = {
  'MultilineTextarea' : []
}

const InOutInterface = (key, data, iteration) => {
  //if ('name' in data) data.name = 'asdf'; console.log(data, head); return
  //proved that the data property is referencing prop in head. But still input elems cannot change head's prop.
  if (iteration < 1) {
    return
  }
  if (!data) {
    return
  }

  let key_ = MultilineTextarea(
    textarea({style: "color: #8adfd8"}, key),
    textarea({style: "color: #8adfd8"}, key)
  )
  initTargets['MultilineTextarea'].push(key_)

  //!!!!!!!! textarea에서 set할 때도 head에서부터 nestedObj 함수로 안에 있는 값을 바꿔야 한다. Path가 너무 길어지는 비효율의 발생은 Dictionary를 만들고, 사전에 고유명사가 등록되면 고유명사에 nested된 prop은 고유명사 obj 안에만 들어있게 하자. 아니면 진짜 head를 listify해버리자. 쉬운 레퍼런스, shallow copy 위해.
  //setting values_
  let values_ = []
  if (typeof data != 'object' || data == null) { // value is not Object, or it is null
    values_ = MultilineTextarea(
      textarea({oninput: (event) => {
        data = event.target.value
        console.log(data, head)
      }}, data),
      textarea(data)
    )
    initTargets['MultilineTextarea'].push(values_)

  } else { // value is Object
    for (let key in data) {
      values_.push(IOI(key, nestedObj(data, [key]), iteration))
    }
  }
  iteration--

  let valueWrapper = d({style: "padding-left: 1em; padding-bottom: 1em; padding-right: 1em;"},
        values_
    )

  let foldArrow = d({style: "margin-left: auto"}, "\u25BD")

  function onIOIwheel(event) {
    
    if (!event.shiftKey) {return}

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


function nestedObj(obj, props, value) {
    if (!props) return obj;
    let prop;
    for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
      prop = props[i];
      let candidate = obj[prop];
      if (candidate !== undefined) {
        obj = candidate;
      } else {
        break;
      }
    }
    if (value) {
        obj[props[i]] = value;
        return obj
    }
    return obj[props[i]]
}

//nestObj 사용 예시:
/* var obj = {
    foo: {
        bar: {
        baz: 'x'
        }
    }
};

nestedObj(obj, ["foo", "bar", "baz"], 'y'); */


//App

const App = (head) => {
    
    let seed = InOutInterface('testObj', head, 10)
  
    global.ContextMenu = ContextMenu()
  
    return div({id: 'App'},
      div({innerText: "Diver", class:"main"}),
      div({id: "container"}),
      div({id: "view", class:"main"},
          seed,
      ),
      global.ContextMenu
    )
}
  
head.then((h) => {
    
  van.add(document.body, App(head = h.default))
  init()

})

