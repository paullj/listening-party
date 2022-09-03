export default (imgSrc: string) => {
	return (
		<div className="bg-gray-500 rounded overflow-hidden">
			<img src={imgSrc} alt="" className="min-w-full h-full aspect-square"/>
		</div>
	)
}