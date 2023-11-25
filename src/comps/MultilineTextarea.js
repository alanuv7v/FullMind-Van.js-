import van from "vanjs-core"

const log = (text) => console.log(text)

const t = van.tags
const {div, span, button, textarea} = t
const d = div

const MultilineTextarea = (inputTextarea, visibleTextarea) => {
    inputTextarea.className = 'inputTextarea'
    visibleTextarea.className = 'visibleTextarea'

    function resizeTextarea() {
        inputTextarea.style.height = "0px" //리셋해서 scrollHeight 다시 계산
        inputTextarea.style.height = (inputTextarea.scrollHeight) + "px"
        visibleTextarea.style.height = inputTextarea.style.height
        visibleTextarea.value = inputTextarea.value //높이 먼저 변한 후 value 변경됨
    }
    
    inputTextarea.addEventListener('input', () => {resizeTextarea()})

    resizeTextarea();

    let main = d()
    
  return 
}
/* 
<svelte:options accessors />

<script>
  import {createEventDispatcher, onMount} from 'svelte'
  
  export let main
  let inputTextarea
  let visibleTextarea

  onMount(
    ()=>{
      inputTextarea = main.children[0]
      inputTextarea.className = 'inputTextarea'
      visibleTextarea = main.children[1]
      visibleTextarea.className = 'visibleTextarea'
      console.log(inputTextarea, visibleTextarea)

      inputTextarea.addEventListener('input', () => {resizeTextarea()})

      resizeTextarea();
    }
  )

  function resizeTextarea() {
    inputTextarea.style.height = "0px" //리셋해서 scrollHeight 다시 계산
    inputTextarea.style.height = (inputTextarea.scrollHeight) + "px"
    visibleTextarea.style.height = inputTextarea.style.height
    visibleTextarea.value = inputTextarea.value //높이 먼저 변한 후 value 변경됨
  }

</script>

<main bind:this={main}>
  <slot>
    
  </slot>
</main>

<style>
  /* @import "../themes/Space/MultilineTextarea"; */
  
  * {
    box-sizing: border-box; /* 중요 */
  }
  main {
    position:relative; /* 중요 */
    width: 100%;
    height: fit-content;
    display: flex; /* 중요 */
  }
  :global(.visibleTextarea) {
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
  :global(.inputTextarea) {
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
  :global(.inputTextarea::selection) {
    color: white;
    background: #be9eff;
  }
</style> */