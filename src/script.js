import van from "vanjs-core"
import { createEvent, createStore } from "effector" 

import { MultilineTextarea } from "./comps/MultilineTextarea"

//util
const log = (text) => console.log(text)

const t = van.tags
const {div, span, button, textarea} = t
/* destructuring 만세!! */
const d = div

//global variables
const global = {}

const App = () => {

  global.ContextMenu = ContextMenu()

  init()

  return div({id: 'App'},
    div({innerText: "Diver", class:"main"}
    ),
    button({value: "global", onclick: () => {console.log(global)}
    }),
    div({id: "view", class:"main"},
    
      InOutInterface({key: 'testObj', values: testObj}, 10),
      global.ContextMenu
    )
  )
}

let testObj = {
  fruits: {
    apple: {
      color: 'red',
      taste: ['sweet', 'sour']
    }
  }
}

const InOutInterface = (data, iteration) => {
  if (iteration < 1) {
    return
  }
  if (!data) {
    return
  }

  let values_ = []
  
  if (typeof data.values != 'object' || data.values == null) {
    values_ = d({style: "color: #fab189;"}, data.values)
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
    d({style: "color: #8adfd8"}, data.key),
    d({style: "padding: 1em;"},
      values_,
    ),
    MultilineTextarea(
      textarea('safd'),
      textarea('safd')
    )
  )
}

const IOI = InOutInterface



const MenuItem = (menuIndex, name, action, children) => {
  console.log('At MenuItem init, menus.getState() = ', JSON.stringify(menus.getState(), null, 2) + '. Index is ' + menuIndex)  
  return button({onclick: (event) => {
    action();
    update({fromIndex: menuIndex, toAdd: children});
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

let update = createEvent()

menus
  .on(update, function(prev, props) {
        let {fromIndex, toAdd} = props
        console.log('update: ' + JSON.stringify([...prev.slice(0, fromIndex), toAdd], null, 2))
        return [...prev.slice(0, fromIndex), toAdd]
      })

  /* 
function updateMenus(fromIndex, childrenMenus) {
  menus.val = [...menus.val.slice(0, fromIndex), childrenMenus]
  return menus.val
} */


const ContextMenu = () => {

  return d({style: "position: sticky; bottom: 0px; display: flex; flex-direction: column-reverse; z-index: 2; border: 1px solid white; width: 100%; padding: 0.5em;"})
}


van.add(document.body, App())

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

  update({fromIndex: 0, toAdd: defaultMenu})

}