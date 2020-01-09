import React from 'react'
import { Form, Field } from 'react-final-form'

export default function LoginForm (props) {
    return (
        <Form render={() => {
            return(
                <form>
                    <div>
                        Hey Form
                    </div>
                </form>
            )
        }} />
    )
}