import cors from 'cors'
import express, { Request, Response } from 'express'
import data from './data.json'

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

let timeouts: Record<string, NodeJS.Timeout> = {}

app.post('/', (req: Request, res: Response) => {
	const userId = req.ip
	if (
		userId &&
		req.body.email !== undefined &&
		req.body.number !== undefined &&
		typeof req.body.email === 'string' &&
		typeof req.body.number === 'string'
	) {
		if (timeouts[userId]) {
			clearTimeout(timeouts[userId])
		}
		if (req.body.email) {
			timeouts[userId] = setTimeout(() => {
				const email: string = req.body.email
				const number: string = req.body.number
				const findResult = data.filter(el => {
					return (
						el.email.includes(email.toLowerCase()) && el.number.includes(number)
					)
				})
				res.send(findResult)
			}, 5000)
		}
	}
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
