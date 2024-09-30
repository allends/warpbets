import { farcasterHubContext } from 'frames.js/middleware'
import { createFrames } from 'frames.js/next'
import { DEFAULT_DEBUGGER_HUB_URL } from '../debug'
import path from 'path'
import * as fs from 'node:fs/promises'

const loadFont = (fontPath: string) => {
	const fontAbsolutePath = path.join(path.resolve(process.cwd(), 'public'), fontPath)
	return fs.readFile(fontAbsolutePath)
}

export const frames = createFrames({
	basePath: '/frames',
	middleware: [
		farcasterHubContext({
			hubHttpUrl: DEFAULT_DEBUGGER_HUB_URL,
		}),
	],
	debug: process.env.NODE_ENV === 'development',
	imageRenderingOptions: async () => {

		const ankhSanctuaryFont = loadFont('AnkhSanctuary.ttf')

		const interFontRegular = loadFont('Inter-Regular.ttf')

		const interBoldFont = loadFont('Inter-Bold.ttf')

		const firaScriptFont = loadFont('FiraCodeiScript-Regular.ttf')

		const [interRegularData, interBoldFontData, firaScriptData, ankhSanctuaryFontData] = await Promise.all([
			interFontRegular,
			interBoldFont,
			firaScriptFont,
			ankhSanctuaryFont,
		])

		return {
			imageOptions: {
				fonts: [
					{
						name: 'Inter',
						data: interBoldFontData,
						weight: 700,
					},
					{
						name: 'Fira Code',
						data: firaScriptData,
						weight: 700,
					},
					{
						name: 'Ankh Sanctuary',
						data: ankhSanctuaryFontData,
						weight: 700,
					},
					{
						name: 'Inter',
						data: interRegularData,
						weight: 400,
					},
				],
			},
		}
	},
})
