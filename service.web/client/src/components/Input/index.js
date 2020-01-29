import React from 'react'
import './input.scss'

export default function DefaultInput(props) {
  const { showLabel, placeholder, label, type = 'text', input, meta } = props
  const errored = (meta.touched && (meta.error || meta.submitError))
  return (
    <div className='default-input'>
      {showLabel && <label>{label}</label>}
      <input className={`default-input-field ${errored ? 'input-err' : ''}`} placeholder={placeholder} {...input} type={type} />
      {/* { errored && <span className='input-error'>{meta.error || meta.submitError}</span>} */}
    </div>
  )
}
