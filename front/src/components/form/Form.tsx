import { InputMask } from '@react-input/mask'
import { useRef, useState } from 'react'
import styles from './Form.module.css'

function From({
	setNames,
}: {
	setNames: (names: { email: string; number: string }[]) => void
}) {
	const [email, setEmail] = useState<string>('')
	const [number, setNumber] = useState<string>('')
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [controller, setController] = useState<AbortController>()
	const emailRef = useRef<HTMLInputElement>(null)
	const numberRef = useRef<HTMLInputElement>(null)

	const emailHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value)
		if (emailRef.current) emailRef.current.setCustomValidity('')
	}
	const numberHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNumber(event.target.value.replace(/-/g, ''))
		if (numberRef.current) numberRef.current.setCustomValidity('')
	}

	const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (controller) controller.abort()
		setController(new AbortController())

		const regEmail = /\S+@\S+\.\S+/
		const regNumber = /^\d{0,6}$/

		if (emailRef.current) {
			if (!regEmail.test(email)) {
				console.log('invalid email')
				emailRef.current.setCustomValidity('invalid email')
				return
			} else {
				emailRef.current.setCustomValidity('')
			}
		}

		if (numberRef.current) {
			if (!regNumber.test(number)) {
				numberRef.current.setCustomValidity('invalid number')
				return
			} else {
				numberRef.current.setCustomValidity('')
			}
		}

		setIsLoading(true)
		try {
			const response = await fetch('http://localhost:3000/', {
				method: 'POST',
				body: JSON.stringify({ email, number }),
				headers: {
					'Content-Type': 'application/json',
				},
				signal: controller ? controller.signal : undefined,
			})
			const result = await response.json()
			setNames(result)
			setIsLoading(false)
			setController(undefined)
		} catch (error) {
			console.log('Предыдущий запрос отменен')
		}
	}

	return (
		<>
			<form className={styles.form} onSubmit={submitHandler}>
				<input
					ref={emailRef}
					type='text'
					name='email'
					placeholder='E-mail'
					required
					onChange={emailHandler}
				/>
				<InputMask
					mask='__-__-__'
					replacement={{ _: /\d/ }}
					ref={numberRef}
					type='text'
					name='number'
					placeholder='Number'
					onChange={numberHandler}
				/>
				<button type='submit'>{isLoading ? 'Loading...' : 'Submit'}</button>
			</form>
		</>
	)
}

export default From
