import { useState } from 'react'
import './App.css'
import Form from './components/form/Form'

function App() {
	const [names, setNames] = useState<{ email: string; number: string }[]>([])

	const renderList = () => {
		return names.map((item, index) => {
			return <li key={index}>{`${item.email} ${item.number}`}</li>
		})
	}
	return (
		<>
			<Form setNames={setNames} />
			{renderList()}
		</>
	)
}

export default App
