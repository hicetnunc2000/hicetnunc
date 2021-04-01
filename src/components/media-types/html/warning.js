import styles from './index.module.scss'

const coverMeta = '<meta property="og:image" content="path/to/image.jpg">'

export function HTMLWarning () {
  return (
    <div className={styles.warning}>
      IMPORTANT:
      <br />
      <br />
      <ul>
        <li>Your zip file must contain an index.html file.</li>
        <li>
          You must also include a cover image and reference it in a meta
          tag like this:
          <br />
          {coverMeta}
        </li>
        <li>
          Access to external resources is high restricted at the moment.
          Please include everything in your zip file (libraries, assets,
          etc).
        </li>
      </ul>
      <br />
      HTML support is experimental – please report bugs on{' '}
      <a
        href="https://github.com/hicetnunc2000/hicetnunc/issues"
        target="_blank"
        rel="noopener noreferrer"
      >
        Github
      </a>
      .
    </div>
  )
}