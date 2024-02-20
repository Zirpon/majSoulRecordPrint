
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
import TablePagination from '@mui/material/TablePagination';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

var openN = 0;
var initOpenN = 999999999999;

function Row(props) {
    const { row, ret } = props;
    const [open, setOpen] = React.useState(ret);
    //console.log(openN, props, open)
    //console.log(varEndtime); 
    var newDate = new Date();
    newDate.setTime(row.endtime * 1000);
    var varEndtime = newDate.toLocaleString()

    const headCells = [
        { id: 'name', numeric: false, disablePadding: false, label: 'ID' },
        { id: 'pos', numeric: true, disablePadding: false, label: '顺位' },
        { id: 'rankTitle', numeric: false, disablePadding: false, label: 'rankTitle' },
        { id: 'finalpoint', numeric: true, disablePadding: false, label: 'finalpoint' },
        { id: 'pt', numeric: true, disablePadding: false, label: 'pt' },
        { id: 'deltapt', numeric: true, disablePadding: false, label: 'deltapt' },
        { id: 'Curpt', numeric: true, disablePadding: false, label: 'Curpt' },
        //{ id: 'rank', numeric: true, disablePadding: false, label: 'rank' },
    ];

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
                <TableCell align="right">{varEndtime}</TableCell>
            </TableRow>
            <TableRow sx={{ color: 'blue', backgroundColor: '#eceff1', }}>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1, }}>
                            <Typography variant="h6" gutterBottom component="div" sx={{ color: 'blue' }}>
                                <i style={{ color: "#0d47a1" }} >{row.roomdata.round}</i> <i style={{ color: "#004d40" }}>{row.roomdata.room}</i>
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    {/*
                                    <TableRow sx={{ color: 'blue', backgroundColor: '#00e676', }}>
                                        <TableCell>{JSON.stringify(row.roomdata)}</TableCell>
                                    </TableRow>
                                    */}
                                    <TableRow>
                                        {headCells.map((headCell) => (
                                            <TableCell
                                                key={headCell.id}
                                                align={headCell.numeric ? 'right' : "center"}
                                                padding={headCell.disablePadding ? 'none' : 'normal'}
                                                //sortDirection={orderBy === headCell.id ? order : false}
                                                sx={{ backgroundColor: '#1b5e20', }}
                                            >
                                                {headCell.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.playerdata.map((player) => (
                                        <TableRow key={player.id} sx={{ color: 'blue', backgroundColor: '#00bcd4', }}>
                                            <TableCell align="center" sx={{ color: 'blue', backgroundColor: '#2196f3', }} >{player.name}</TableCell>
                                            <TableCell align="right" sx={{ color: 'blue', backgroundColor: '#ff9800', }} >{player.pos}</TableCell>
                                            <TableCell align="center">{player.rankTitle}</TableCell>
                                            <TableCell align="right" sx={{ color: 'blue', backgroundColor: '#18ffff', }}>{player.finalpoint}</TableCell>
                                            <TableCell align="right" sx={{ color: 'blue', backgroundColor: '#ffff00', }}>{player.pt}</TableCell>
                                            <TableCell align="right" sx={{ color: 'blue', backgroundColor: '#1de9b6', }}>{player.deltapt}</TableCell>
                                            <TableCell align="right" sx={{ color: 'blue', backgroundColor: '#2196f3', }}>{player.pt + player.deltapt}</TableCell>
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
    ret: PropTypes.bool.isRequired,
};

export default function CollapsibleTable(props) {
    const { rows } = props;
    const [includeFriends, setIncludeFriends] = React.useState(true);
    function handleIncludeFriends(e) {
        /*console.log({ includeFriends })*/
        setIncludeFriends(e.target.checked);
    }

    /*
    rows.map((row) => {
        console.log(row);
        console.log(row.uuid);
        console.log(row.endtime);
        console.log(row.playerdata);
        console.log(row.roomdata);
    })
    */

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
          return -1;
        }
        if (b[orderBy] > a[orderBy]) {
          return 1;
        }
        return 0;
      }
      
      function getComparator(order, orderBy) {
        return order === 'desc'
          ? (a, b) => descendingComparator(a, b, orderBy)
          : (a, b) => -descendingComparator(a, b, orderBy);
      }
      
      // Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
      // stableSort() brings sort stability to non-modern browsers (notably IE11). If you
      // only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
      // with exampleArray.slice().sort(exampleComparator)
      function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
          const order = comparator(a[0], b[0]);
          if (order !== 0) {
            return order;
          }
          return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
      }
      

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.uuid);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            stableSort(rows, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, rowsPerPage],
    );

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <Typography variant="h6" component="div" sx={{ backgroundColor: '#2196f3', color: 'blue', }}>
                    <input type="checkbox" checked={includeFriends} onChange={handleIncludeFriends} />
                    <i style={{ color: "#0d47a1" }} >加载友人场数据</i>
                </Typography>
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow sx={{ color: 'blue', backgroundColor: '#7e57c2', }}>
                                <TableCell />
                                <TableCell >牌谱ID</TableCell>
                                <TableCell align="right">endtime</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleRows.map((row) => {
                                openN++;
                                if (!includeFriends) {
                                    if (row.roomdata.room === '友人场') return;
                                }
                                var ret = (openN < initOpenN) ? true : false;
                                //console.log(ret, openN);
                                return <Row key={row.uuid} row={row} ret={ret} />
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100, 200]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            />
        </Box>
    );
}