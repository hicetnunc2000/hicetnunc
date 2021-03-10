import React from 'react'

const Footer = () => {
  return (
    <footer
      style={{
        position: 'fixed',
        left: '0',
        bottom: '0',
        width: '100%',
        backgroundColor: 'black',
        textAlign: 'center',
        fontSize: '14px',
        color: 'white',
        zIndex: 2000,
      }}
    >
      sync -&gt; collect // sync -&gt; mint // sync -&gt; curate
    </footer>
  )
}

export default Footer
