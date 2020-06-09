import reduce from 'lodash/reduce'
import defaultsDeep from 'lodash/defaultsDeep'

import tinyColor from 'tinycolor2'

/**
 *  GENERIC COLOR HANDLER
 *  this accepts either an options object or string
 *  strings can be used to access presets - e.g., colors.primary('dark')
 * */

class SwfColor {
	constructor(colorName, config) {
		// console.log('Creating new swfColor with color: ', colorName)
		const { darkenAmount, lightenAmount, tintOpacity } = config.colorSettings
		this.name = colorName
		this.val = config.colors[colorName] ? config.colors[colorName] : colorName
		this.conf = {
			dark: colorName === 'grey' ? darkenAmount * 1.5 : darkenAmount,
			light: lightenAmount,
			tint: tintOpacity,
			black: config.colors.black,
			white: config.colors.white,
		}
	}

	dark = preset => {
		let amount = typeof preset === 'number' ? preset : this.conf.dark

		switch (preset) {
			case '0':
				amount = this.conf.dark * 0.4
				break
			case '1':
				amount = this.conf.dark * 0.6
				break
			case '2':
				amount = this.conf.dark * 0.8
				break
			case '3':
				amount = this.conf.dark
				break
			case '4':
				amount = this.conf.dark * 1.2
				break
			case '5':
				amount = this.conf.dark * 1.4
				break
			case '6':
				amount = this.conf.dark * 1.6
				break
			default:
			// we just use amount as is
		}

		const Color = tinyColor(this.val).darken(amount)
		Color.val = Color.toString()
		return Color
	}

	light = preset => {
		let amount = typeof preset === 'number' ? preset : this.conf.light
		switch (preset) {
			case '0':
				amount = this.conf.light * 0.4
				break
			case '1':
				amount = this.conf.light * 0.6
				break
			case '2':
				amount = this.conf.light * 0.8
				break
			case '3':
				amount = this.conf.light
				break
			case '4':
				amount = this.conf.light * 1.2
				break
			case '5':
				amount = this.conf.light * 1.4
				break
			case '6':
				amount = this.conf.light * 1.6
				break
			default:
			// we just use amount as is
		}
		const Color = tinyColor(this.val).lighten(amount)
		Color.val = Color.toString()
		return Color
	}

	tint = amount => {
		const tintAmount = typeof amount === 'number' ? amount * 0.01 : this.conf.tint
		const Color = tinyColor(this.val).setAlpha(tintAmount)
		Color.val = Color.toString()
		return Color
	}

	invert = () => {
		const Color = tinyColor(this.val)
		if (Color.isDark()) {
			this.val = this.conf.white
		} else if (Color.isLight()) {
			this.val = this.conf.black
		} else this.val = Color.spin(180).toString()
		return this
	}

	calc = () => tinyColor(this.val)
}

/**
 *  CREATES COLOR HANDLERS
 *  will return object with color handler methods for each color defined in the config
 *  e.g., colors.primary()
 * */
const generateColorHandlers = (colors, config) =>
	reduce(
		colors,
		(acc, _, key) => {
			const res = acc
			res[key] = new SwfColor(key, config)
			return res
		},
		{}
	)

export const generateColors = config => {
	// console.log('generating color handlers with config: ', config)
	const { colors, colorSettings, isDarkMode } = config

	const newColors = generateColorHandlers(colors, config)

	if (!colors.disabled) {
		newColors.disabled = new SwfColor('disabled', {
			colorSettings,
			colors: {
				...colors,
				disabled: isDarkMode ? newColors.grey.dark('5') : newColors.grey.light('5'),
			},
		})
	}

	return {
		colorSettings: defaultsDeep(colorSettings),
		...newColors,
	}
}
