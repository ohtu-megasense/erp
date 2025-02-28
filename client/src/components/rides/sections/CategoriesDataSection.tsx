import { useGetInventoryQuery } from "../../../features/apiSlice";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export const CategoriesDataSection = () => {
	const { data } = useGetInventoryQuery();

	if (!data) {
		return null; // Palautetaan null, jos data on tyhjä tai väärässä muodossa
	}

	const [...rows] = data.everything;
	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 250 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell align="left">ID</TableCell>
						<TableCell align="left">name</TableCell>
						<TableCell align="left">status</TableCell>
						<TableCell align="left">location</TableCell>
						<TableCell align="left">last updated</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row: data) => (
						<TableRow key={row.id}>
							<TableCell component="th" scope="row">
								{row.id}
							</TableCell>
							<TableCell align="left"> {row.name} </TableCell>
							<TableCell align="left"> {row.location} </TableCell>
							<TableCell align="left"> {row.status} </TableCell>
							<TableCell align="left"> {row.last_updated} </TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};
