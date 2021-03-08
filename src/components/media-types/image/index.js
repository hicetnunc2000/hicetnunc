import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'

export const Image = ({ src }) => {
  return (
    <div>
      <LazyLoadImage
        className="media"
        style={{ maxHeight: '50vh', height: 'auto', width: 'auto' }}
        src={src}
        alt="💥"
      />
    </div>
  )
}
