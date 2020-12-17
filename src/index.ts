import fs from 'fs'
import path from 'path'
import struct from './struct'

function toArrayBuffer(buf:Buffer) { 
	const ab = new ArrayBuffer(buf.length)
	const view = new Uint8Array(ab)
	for (var i = 0; i < buf.length; ++i) {
			view[i] = buf[i]
	}
	return view.buffer
}

function byteArray(length:number) {
	const ab = new ArrayBuffer(length)
	const view = new Uint8Array(ab)
	return view.buffer 
}

function ceil4(n:number) {
	return (n + 3) & ~3
}

export default function ttc2ttf(ttcPath:string, distPath:string) {
	return new Promise(resolve => {
		const buf = toArrayBuffer(fs.readFileSync(ttcPath))
		const type = struct('4c').unpack_from(buf, 0).join('')
		const fileHeadName = path.basename(ttcPath, path.extname(ttcPath))
	
		if (type == 'ttcf') {
			const ttfCount = struct('I').unpack_from(buf, 0x08)[0]
		
			Array.from(new Array(ttfCount)).forEach((_, i) => {
	
				const tableHeaderOffset = struct('I').unpack_from(buf, 0x0C + 0x04 * i)[0]
				const tableCount = struct('H').unpack_from(buf, tableHeaderOffset + 0x04)[0]
				const headerLength = 0x0C + tableCount * 0x10
		
				let tableLength = 0
				for (let j = 0; j < tableCount; j++) {
					const length = struct('I').unpack_from(buf, tableHeaderOffset + +0x0C + 0x0C + j * 0x10)[0]
					tableLength += ceil4(length)
				}
		
				const totalLength = headerLength + tableLength
				const newBuf = byteArray(totalLength)
		
				const header = struct(headerLength + 'b').unpack_from(buf, tableHeaderOffset)
				struct(headerLength + "b").pack_into(newBuf, 0, ...header)
				let currentOffset = headerLength
	
				const ttfName = `${fileHeadName}_${i}.ttf`
				const ttfPath = path.join(distPath, ttfName)
	
				if (fs.existsSync(ttfPath)) return
	
				for (let j = 0; j < tableCount; j++) {
					const offset:number = struct('I').unpack_from(buf, tableHeaderOffset + 0x0C + 0x08 + j * 0x10)[0]
					const length:number = struct('I').unpack_from(buf, tableHeaderOffset + 0x0C + 0x0C + j * 0x10)[0]
					struct('I').pack_into(newBuf, 0x0C + 0x08 + j * 0x10, currentOffset)
	
					const CHUCK_LENGTH:number = 1024 * 1024
					const lastLength = length % CHUCK_LENGTH
					
					let steps = parseInt((length / CHUCK_LENGTH).toString())
	
					if (lastLength > 0) steps++
					
					Array.from(Array(steps)).forEach((_, i:number) => {
						const chuckOffset = offset + i * CHUCK_LENGTH
						const chunckLength = (steps != i + 1) ? CHUCK_LENGTH : lastLength
						
						const currentTable = struct(chunckLength + 'b').unpack_from(buf, chuckOffset)
						struct(chunckLength + 'b').pack_into_with_array(newBuf, currentOffset, currentTable)
						currentOffset += ceil4(chunckLength)
					})
				}
				
				console.log(ttfPath + ' is extracted')
				fs.writeFileSync(ttfPath, Buffer.from(newBuf))
			})
			resolve(true)
		} else {
			resolve(false)
			console.log(ttcPath + 'has not format of ttc...')
		}
	})
}


