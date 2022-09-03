import { ChangeEventHandler, FormEventHandler, useState } from "react"
import useSWR from 'swr';

import { useQueue } from "../_stores/queue";
import useDebounce from "../utils/debounce";

const requestURL = '';

export default () => {
	const [searchTerm, setSearchTerm] = useState("");
	const { data } = useSWR(() => useDebounce(searchTerm, 250) ? requestURL : null);
	const [addNext, addToQueue] = useQueue(({addNext, addToQueue}) => [addNext, addToQueue])

	const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault();

		addNext({
			title: searchTerm,
			artist: new Date().getMilliseconds().toString(),
			albumCover: "test.jpg"
		})
		setSearchTerm("")
	}

	const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		setSearchTerm(event.currentTarget.value)
		console.log(data)
	}

	return (
		<form onSubmit={handleSubmit}>
			<input type="text" value={searchTerm} onChange={handleChange}/>
			<button>Search</button>
		</form>
	)
}