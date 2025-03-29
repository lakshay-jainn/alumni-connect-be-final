import Queue from "bull"

import { sendEmail } from "../services/email.js"

const emailQueue = new Queue("email", {
    redis: {
        host: "127.0.0.1",
        port: 6379
    }
})

//Worker
emailQueue.process(async (job) => {
    await sendEmail(job.data)
})

export const deQueue = (options) => {
    emailQueue.add(options)
}