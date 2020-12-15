import fs from 'fs'
import path from 'path'
import struct from './struct'

if (process.argv[2] != null) {
	const fontPath = process.argv[2]
	const distPath = (process.argv[3] != null) ? process.argv[3] : './'
	ttc2ttf(fontPath, distPath)
} else {
	const help = "Command:\n" +
	" ttc2ttf <ttc path> [dist path]\n"
	console.log(help)
}

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


function ttc2ttf(ttcPath:string, distPath:string) {
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
	
			const header = struct(headerLength + 's').unpack_from(buf, tableHeaderOffset)
			let currentOffset = headerLength

			const ttfName = `${fileHeadName}_${i}.ttf`
			const ttfPath = path.join(distPath, ttfName)

			if (fs.existsSync(ttfPath)) return

			for (let j = 0; j < tableCount; j++) {
				const offset = struct('I').unpack_from(buf, tableHeaderOffset + 0x0C + 0x08 + j * 0x10)[0]
				const length = struct('I').unpack_from(buf, tableHeaderOffset + 0x0C + 0x0C + j * 0x10)[0]
				struct('I').pack_into(newBuf, 0x0C + 0x08 + j * 0x10, currentOffset)
				const currentTable = struct(length + 'c').unpack_from(buf, offset)
				struct(length + 'c').pack_into_with_array(newBuf, currentOffset, currentTable)
				currentOffset += ceil4(length)
			}
			
			console.log(ttfPath + ' is extracted\n')

			fs.writeFileSync(ttfPath, Buffer.from(newBuf))  
		})
		console.log('done')
	} else {
		console.log(ttcPath + 'has not format of ttc...')
	}
}


