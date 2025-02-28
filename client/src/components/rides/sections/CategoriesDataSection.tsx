import { Box, Typography } from "@mui/material";
import { Grid2 } from "@mui/material";
import { RidesChartGridItem } from "../charts-grid-item/RidesChartGridItem";
import { SensorDistributionChart } from "../charts/SensorDistributionChart";
import { useGetInventoryQuery } from "../../../features/apiSlice";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export const CategoriesDataSection = () => {
	const { data } = useGetInventoryQuery();

	console.log(data.everything);
	if (!data || !Array.isArray(data.everything) || data.everything.length < 2) {
		return null; // Palautetaan null, jos data on tyhjä tai väärässä muodossa
	}

	const [headers, ...rows] = data.everything; // Ensimmäinen rivi on otsikot, loput dataa

	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						{headers.map((header: string, index: number) => (
							<TableCell key={index} align="left">
								<strong>{header}</strong>
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row: string[], rowIndex: number) => (
						<TableRow key={rowIndex}>
							{row.map((cell: string, cellIndex: number) => (
								<TableCell key={cellIndex} align="left">
									{cell}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};
