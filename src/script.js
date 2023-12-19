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

  return div({id: 'App'},
    div({innerText: "Diver", class:"main"}
    ),
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



let menus = createStore(["sdf"])
menus.watch(m => console.log(m))

let update = createEvent()

menus
  .on(update, function(prev, added) {return [...prev, added]})

console.log(menus.getState())

const MenuItem = (name, action, children) => {
  let index = menus.length
  return button({onclick: (event) => {
    action();
    updateMenus(index, children);
  }}, name
  )
}

function updateMenus(fromIndex, childrenMenus) {
  menus.val = [...menus.val.slice(0, fromIndex), childrenMenus]
  return menus.val
}

const ContextMenu = () => {
  let defaultMenu = [
    button({onclick: (event) => {alert('clicked')}}, 'asdf'),
    MenuItem('Item', function() {alert('!')}, [MenuItem('child 1',
    MenuItem('child 2'))])
  ]
  console.log(menus)
  menus.val = [defaultMenu]
  console.log(menus)

  let derivedMenus = van.derive(() => menus.val)
  
  
  return d({style: "display: flex; flex-direction: row"},
  derivedMenus.val
  )
}


van.add(document.body, App())

