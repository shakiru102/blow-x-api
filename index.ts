import express, { Request, Response } from 'express'
import env from 'dotenv'
import cors, { CorsOptions } from 'cors'
import nodemalier from 'nodemailer'
import { MailOptions } from 'nodemailer/lib/sendmail-transport'
import fs from 'fs'
import path from 'path'

const html = fs.createReadStream('public/tbt-hussian.html')

env.config()
const corsOption: CorsOptions = {
    origin: "*",
    credentials: true
}
const app = express()
const PORT = process.env.PORT || 4000

app.use('/public', express.static('public'))



app.use(cors(corsOption))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api', (req: Request, res: Response) => {
    res.send('Server is running')
})

app.post('/api/send-mail', (req: Request, res: Response) => {
    const transporter = nodemalier.createTransport({
        // @ts-ignore
        host: process.env.MAIL_HOST,
        secure: true,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    })
   const mailOptions: MailOptions ={
    from: {
        name: 'Blow X',
        // @ts-ignore
        address: process.env.MAIL_FROM_ADDRESS
    },
    to: req.body.email,
    subject: "Waitlist Confirmation",
    html
   }
    transporter.sendMail(mailOptions, (err) => {
        if(err) {
            console.log(err);
            return res.status(400).send(err.message)
        }
        res.status(200).send({ message: "Email has been sent" })
    })

})

app.listen(PORT, () => console.log('listening on port: ' + PORT))
