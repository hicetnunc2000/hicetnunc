import React, { useState } from 'react'
import { Button, Primary } from '../../../components/button'
import { disableAllTags, enableAllTags, setTagParam, unsetTagParam, existsTagsParam } from './functions'
import styles from '../styles.module.scss'

export const TagBar = ({tags, onUpdate}) => {
  // by default the bar is closed
  // but is open when tags params exists
  const [show, setShow] = useState(existsTagsParam())

  return (<>
    {/* show/hide tags */}
    <Button onClick={() => setShow(!show)}>
      <Primary selected={show}>
        {show ? 'hide' : 'show'} tags
                </Primary>
    </Button>

    {/* tags utilities */}
    {show &&
      <div className={styles.menu}>

        {/* enable all tags button */}
        <Button onClick={() => {
          onUpdate(enableAllTags(tags))
        }}>
          <Primary>enable all</Primary>
        </Button>

        {/* disable all tags button */}
        <Button onClick={() => {
          onUpdate(disableAllTags(tags))
        }}>
          <Primary>disable all</Primary>
        </Button>
      </div>
    }

    {/* tags list */}
    {show &&
      <div className={styles.tagList}>
        {(() => {
          const tagButtons = []
          for (const tagName in tags) {
            const tag = tags[tagName]

            // update state and url params on click
            const onClick = () => {
              const tagsCreations = { ...tags }

              // if URL does not contains tags then create them
              if (!existsTagsParam()) {
                for (const tag in tagsCreations) {
                  if (tagsCreations[tag].active) {
                    setTagParam(tag)
                  }
                }
              }

              // change the tag state
              tagsCreations[tagName].active = !tagsCreations[tagName].active

              // update URL tags
              if (tagsCreations[tagName].active) {
                setTagParam(tagName)
              } else {
                unsetTagParam(tagName)
              }

              onUpdate(tagsCreations)
            }

            // add tag button to returned array
            tagButtons.push(
              <div
                key={tag.name}
                className={`${styles.tag} ${tag.active && styles.tagActive}`}
                onClick={onClick}
              >
                {/* an objkt with no tags contains a single tag with an empty string as name, display NO TAGS button */}
                {tag.name.length > 0 ? tag.name : "NO TAGS"} ({tag.count})
                        </div>
            )
          }

          // return tag buttons array
          return tagButtons
        })()}
      </div>
    }
  </>)
}
