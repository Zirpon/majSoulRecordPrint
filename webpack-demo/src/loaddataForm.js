
//import { DataGrid } from '@mui/x-data-grid';
import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    {/*console.log(props)*/ }

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' }, backgroundColor: '#fce4ec', }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.uuid}
                </TableCell>
                <TableCell align="right">{row.endtime}</TableCell>
            </TableRow>
            <TableRow sx={{color: 'blue',backgroundColor: '#eceff1',}}>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1, }}>
                            <Typography variant="h6" gutterBottom component="div">
                                牌局结果
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow sx={{color: 'blue',backgroundColor: '#00e676',}}>
                                        <TableCell>{JSON.stringify(row.roomdata)}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.playerdata.map((player) => (
                                        <TableRow key={player.id} sx={{color: 'blue',backgroundColor: '#00bcd4',}}>
                                            <TableCell>{JSON.stringify(player)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        endtime: PropTypes.number.isRequired,
        uuid: PropTypes.string.isRequired,
    }).isRequired,
};

export default function CollapsibleTable(props) {
    const { rows } = props;
    /*
    rows.map((row) => {
        console.log(row);
        console.log(row.uuid);
        console.log(row.endtime);
        console.log(row.playerdata);
        console.log(row.roomdata);
    })*/
    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow sx={{color: 'blue',backgroundColor: '#7e57c2',}}>
                        <TableCell />
                        <TableCell >牌谱ID</TableCell>
                        <TableCell align="right">endtime</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <Row key={row.uuid} row={row} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}