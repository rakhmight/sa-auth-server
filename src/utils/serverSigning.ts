import { createSign, createVerify } from 'crypto'

export function signData(data: string){
    if(!process.env.SERVER_SIGNING_PRIVATE) throw Error('env')

    const signer = createSign('rsa-sha256')
    signer.update(data)
    const signature = signer.sign(process.env.SERVER_SIGNING_PRIVATE, 'hex')
    return signature
}

export function verifySignedData(data:string, signature: string){
    if(!process.env.SERVER_SIGNING_PUBLIC) throw Error('env')

    const verifier = createVerify('rsa-sha256')
    verifier.update(data)

    const isVerified = verifier.verify(process.env.SERVER_SIGNING_PUBLIC, signature, 'hex')
    return isVerified
}