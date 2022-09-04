import type { ButtonHTMLAttributes, DetailedHTMLProps, FC } from 'react';

const Button: FC<DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>> = (props) => (
	<button {...props} className="bg-gray-300 border-gray-400 border-4 min-w-32 px-2 py-1 rounded-lg" >
		{props.children}
	</button>
)

export default Button;