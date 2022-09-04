import type { DetailedHTMLProps, FC, InputHTMLAttributes, PropsWithChildren } from 'react';

const Input: FC<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>> = (props: PropsWithChildren) => (
	<input className='px-2 py-1 my-1 rounded-lg bg-gray-100 border-4 border-gray-300' {...props}>
		{props.children}
	</input>
)

export default Input;