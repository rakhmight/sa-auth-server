export default function(len:number):string {
    const characters:string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890&$#@?*-+/!~%'
    let str: string = ''
    for (let i = 0; i < len; i++) {
        let pos = Math.floor(Math.random() * characters.length)
        str += characters.substring(pos,pos+1)
    }
    
    return str
}