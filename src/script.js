import van from "vanjs-core"
import { createEvent, createStore } from "effector" 

import * as yaml from 'yaml'
import { MultilineTextarea, resizeTextarea } from "./comps/MultilineTextarea"


let head = (async function () {return await import('./data/heads/head_1.yaml')})()
console.log(head)

//util
const log = (text) => console.log(text)

const t = van.tags
const {div, span, button, textarea} = t
/* destructuring 만세!! */
const d = div

//global variables
const global = {}
/* let head = (async function () {return await import('./data/heads/head_1.yaml')})()

head.then( (h) => { 
  console.log("HEAD: "+ h)
  } 
)
 */

let testObj = {
  fruits: {
    apple: {
      color: 'red',
      taste: ['sweet', 'sour']
    }
  }
}

//App

const App = () => {

  global.ContextMenu = ContextMenu()

  return div({id: 'App'},
    div({innerText: "Diver", class:"main"}
    ),
    div({id: "view", class:"main"},
    
      InOutInterface({key: 'testObj', values: testObj}, 10)
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
      textarea(data.values),
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

  return div({class: "main IOI"}, 
    key_,
    d({style: "padding-left: 1em; padding-bottom: 1em; padding-right: 1em;"},
      values_
    )
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

}


van.add(document.body, App())
init()
