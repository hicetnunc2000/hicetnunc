import React from "react"

export const ButtonLayout = () => {
  let clickedClass = "clicked"
  const body = document.body
  const defaultLayout = "default-layout"
  const gridLayout = "grid-layout"
  let layout

  if (localStorage) {
    layout = localStorage.getItem("layout")
  }
  if (layout === defaultLayout || layout === gridLayout) {
    body.classList.add(layout)
  } else {
    body.classList.add(defaultLayout)
  }

  const switchlayout = e => {
    if (layout === gridLayout) {
      body.classList.replace(gridLayout, defaultLayout)
      e.target.classList.remove(clickedClass)
      localStorage.setItem("layout", "default-layout")
      layout = defaultLayout
    }  else {
      body.classList.replace(defaultLayout, gridLayout)
      e.target.classList.add(clickedClass)
      localStorage.setItem("layout", "grid-layout")
      layout = gridLayout
    }
  }

  return (
    <button
      className={layout === "grid-layout" ? clickedClass : ""}
      id="setLayout"
      onClick={e => switchlayout(e)}
    >
      <span class="material-icons is-default">calendar_view_day</span>
      <span class="material-icons is-grid">apps</span>
    </button>
  )
}
