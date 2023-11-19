import van from "vanjs-core"

const t = van.tags


const Hello = () => {
  const dom = t.div()
  return t.div(
    dom,
    t.button("Hello 🐌")
  )
}

van.add(document.body, Hello())