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
				const offset = struct('I').unpack_from(buf, tableHeaderOffset + 0x0C + 0x08 + j * 0x10)[0]
				const length = struct('I').unpack_from(buf, tableHeaderOffset + 0x0C + 0x0C + j * 0x10)[0]
				struct('I').pack_into(newBuf, 0x0C + 0x08 + j * 0x10, currentOffset)

                if (offset < length) {
                    // Todo: this will be checked...
                    // console.log('tableCount: ' + j + ' ' + offset + ' ' + length)
                    continue
                }

                const currentTable = struct(length + 'b').unpack_from(buf, offset)
				struct(length + 'b').pack_into_with_array(newBuf, currentOffset, currentTable)
				currentOffset += ceil4(length)
			}
			
			console.log(ttfPath + ' is extracted')
			fs.writeFileSync(ttfPath, Buffer.from(newBuf))  
		})
	} else {
		console.log(ttcPath + 'has not format of ttc...')
	}
}


