import van from "vanjs-core"
import compCSS from "../libs/compCSS"


const t = van.tags
const {div, span, button, textarea} = t
const d = div


export function resizeTextarea(inputTextarea, visibleTextarea, height) {
  console.log("resizing...", inputTextarea, visibleTextarea)
  inputTextarea.style.height = "0px" //리셋해서 scrollHeight 다시 계산
  inputTextarea.style.height = (inputTextarea.scrollHeight) + "px"
  visibleTextarea.style.height = inputTextarea.style.height
  visibleTextarea.value = inputTextarea.value //높이 먼저 변한 후 value 변경됨
}


export const MultilineTextarea = (inputTextarea, visibleTextarea) => {
    inputTextarea.classList.add('inputTextarea')
    visibleTextarea.classList.add('visibleTextarea')

    inputTextarea.spellcheck = false
    visibleTextarea.spellcheck = false

    resizeTextarea(inputTextarea, visibleTextarea)

    inputTextarea.addEventListener('input', () => {resizeTextarea(inputTextarea, visibleTextarea)})

    let main = d({class: "MultilineTextarea", style: `
    position:relative; /* 중요 */
    width: 100%;
    height: fit-content;
    display: flex; /* 중요 */
    `},
        inputTextarea,
        visibleTextarea
    )

    compCSS("MultilineTextarea", `
    * {
        box-sizing: border-box; /* 중요 */
    }
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

  return main
}