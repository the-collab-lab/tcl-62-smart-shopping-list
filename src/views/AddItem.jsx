export function AddItem() {
	return (
		<form>
			<label>
				Item name:
				<input type="text" />
			</label>
			<br />
			<label>
				How soon will you buy this again?
				<select>
					<option value="1">Soon</option>
					<option value="2">Kind of Soon</option>
					<option value="3">Not Soon</option>
				</select>
			</label>
			<br />

			<button>Submit</button>
		</form>
	);
}
