import React from 'react'
import './input.scss'

export default function DefaultInput(props) {
  const { showLabel, placeholder, label, type = 'text', input, meta } = props
  return (
    <div className='default-input'>
      {showLabel && <label>{label}</label>}
      <input className='default-input-field' placeholder={placeholder} {...input} type={type} />
      {meta.touched && (meta.error || meta.submitError) && <span className='input-error'>{meta.error || meta.submitError}</span>}
    </div>
  )
}
