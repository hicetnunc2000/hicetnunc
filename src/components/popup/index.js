import React, { useState } from 'react'
import styles from './styles.module.scss'

export const Popup = ({
    sad,
    happy,
    exclamation,
    title,
    show,
    handleClose,
    
    children,
}) => {
    let icon;
    if (happy) {
        icon = <svg className={styles.popup__icons} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 434 636"><rect width="145" height="362"/><rect x="289" width="145" height="362"/><polygon points="434 636 434 419 295 419 295 497 139 497 139 419 0 419 0 636 434 636"/></svg>
    } else if (sad) {
        icon = <svg className={styles.popup__icons} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 434 636"><rect width="145" height="362"/><rect x="289" width="145" height="362"/><polygon points="0 419 0 636 139 636 139 558 295 558 295 636 434 636 434 419 0 419"/></svg>
    } else if (exclamation) {
        icon = <svg className={styles.popup__icons} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 145 550.16"><rect width="145" height="362"/><rect y="415.61" width="145" height="134.54"/></svg>
    } else {
        icon = <svg className={styles.popup__icons__hen}xmlns="http://www.w3.org/2000/svg" viewBox="0 0 185.57 688.89"><path d="M407.55,844.44V783.6a7.63,7.63,0,0,1,1.19-1.22,2.61,2.61,0,0,1,1.46-.56H530.66V719.68H408.21V657.3H593.12V844.44Z" transform="translate(-407.55 -155.56)"/><path d="M531.85,280.6h60.74v61.82H408V281.19h58.81a14.28,14.28,0,0,0,2-1.82,2.74,2.74,0,0,0,.6-1.47V218.53h-61v-63h184v62.2H531.85Z" transform="translate(-407.55 -155.56)"/><path d="M531.82,406.13h60.74V593.66c-19.67.31-39.92,0-60.74.17Z" transform="translate(-407.55 -155.56)"/><path d="M469.12,406.45V593.2H409.19l-1.08-186.75Z" transform="translate(-407.55 -155.56)"/></svg>
    }

    return (show) ? (
        <div className={styles.popup}>
            <div className={styles.popup__inner}>
                <div className={styles.popup__fixed}>
                    <div className={styles.display__icon}>
                        {icon}
                    </div>
                    <button
                        type="button"
                        className={styles.close__btn}
                        onClick={handleClose}
                        tabindex="1"
                    >
                        x
                    </button>
                </div>
                <div className={styles.popup__content}>
                    <strong className={styles.popup__title}>{title}</strong>
                    <hr />
                    <br />
                    {children}
                </div>

            </div>            
        </div>
    ) : null;
}
