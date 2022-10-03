import type { ButtonHTMLAttributes, DetailedHTMLProps, FC } from 'react';

interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	color?: string
}

const Button: FC<ButtonProps> = (props) => {
	const { color = "gray" } = props;
	const className = `bg-${color}-200 px-4 py-2 rounded hover:bg-${color}-400 active:bg-${color}-500 transition`;

	return (<button {...props} className={className} >
		{props.children}
	</button>)
}

export default Button;