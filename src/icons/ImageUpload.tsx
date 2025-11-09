/* eslint-disable react/no-unknown-property */
/* eslint-disable react/react-in-jsx-scope */

interface Props {
	classes: string
}

export const ImageUpload = ({ classes }: Props) => {
	return (
		<svg
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			stroke-width='2'
			stroke-linecap='round'
			stroke-linejoin='round'
			class={classes}
		>
			<path stroke='none' d='M0 0h24v24H0z' fill='none' />
			<path d='M15 8h.01' />
			<path d='M12 20H7a3 3 0 0 1 -3 -3V7a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v5' />
			<path d='M4 15l4 -4c.928 -.893 2.072 -.893 3 0l3 3' />
			<path d='M14 14l1 -1c.928 -.893 2.072 -.893 3 0' />
			<path d='M19 22v-6' />
			<path d='M22 19l-3 -3l-3 3' />
		</svg>
	)
}

