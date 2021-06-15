import React, { useState } from 'react'
import styles from './styles.module.scss'
import { Document, Page, pdfjs } from 'react-pdf'
import { Button, Primary } from '../../button'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

export const PdfComponent = ({ src, onDetailView }) => {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
  }

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset)
  }

  function previousPage() {
    changePage(-1)
  }

  function nextPage() {
    changePage(1)
  }

  function onItemClick(item) {
    setPageNumber(item.pageNumber)
  }

  return (
    <div className={styles.container}>
      <Document
        file={src}
        onLoadSuccess={onDocumentLoadSuccess}
        onItemClick={onItemClick}
      >
        <Page pageNumber={pageNumber} />
        {onDetailView && (
          <div className={styles.pdfNav}>
            <Button disabled={pageNumber <= 1} onClick={previousPage}>
              <Primary>Prev «</Primary>
            </Button>
            <p>
              Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
            </p>
            <Button disabled={pageNumber >= numPages} onClick={nextPage}>
              <Primary>» Next</Primary>
            </Button>
          </div>
        )}
      </Document>
    </div>
  )
}
