import { createHmac } from 'crypto'

export default function(data: string){
    if(!process.env.HMAC_SECRET) throw Error('env')
    const hmac = createHmac('sha256', process.env.HMAC_SECRET).update(data).digest('hex')

    return hmac
}