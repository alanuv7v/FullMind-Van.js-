import van from "vanjs-core"

const log = (text) => console.log(text)

const t = van.tags
const {div, span, button} = t
//destructuring 만세!!
const d = div

const App = () => {
  return div({id: 'App'},
    div({innerText: "Diver", class:"main"}
    ),
    div({id: "view", class:"main"},
      InOutInterface({key: 'testObj', values: testObj}, 10)
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
      console.log(e[0], e[1])
      children.push({key: e[0], values: e[1]})
      console.log(children)
    }
    
    
    for (let child of children) {
      values_.push(IOI(child, iteration))
    }
  }
  iteration--
  console.log(values_)

  return div({class: "main IOI"}, 
    d({style: "color: #8adfd8"}, data.key),
    d({style: "padding: 1em;"},
      values_,
    ),
  )
}

const IOI = InOutInterface


van.add(document.body, App())



import compCSS from "./libs/compCSS"

compCSS("MultilineTextarea", `
  * {
    box-sizing: border-box; /* 중요 */
  }
  main {
    position:relative; /* 중요 */
    width: 100%;
    height: fit-content;
    display: flex; /* 중요 */
    
  .visibleTextarea {
    background-color: transparent;
    font-size: inherit;
    width: 100%;
    padding: 1em;
    overflow-y: hidden;
    resize: none;

    color: white;
    background-color: transparent;
    border:none;
  }
  .inputTextarea {
    background-color: transparent;
    font-size: inherit;
    width: 100%;
    padding: 1em;
    overflow-y: hidden;
    resize: none;

    position: absolute;
    border: none;
    color: transparent;
    background-color: transparent;
    z-index: 1;
    /* transition: none !important; */ /* 진짜 중요 */
    caret-color: white;
  }
  .inputTextarea::selection {
    color: white;
    background: #be9eff;
  }
`)
