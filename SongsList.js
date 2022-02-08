import { useState, useEffect } from "react";
import './SongsList.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Link } from "react-router-dom";

const theme = createTheme({
    components: {
      // Name of the component
        TablePagination: {
            defaultProps: {
            // The props to change the default for.
                labelDisplayedRows: {from: 1, to: 10, count: -1, page: 0}, 
            },
        },
    },
});

const columns = [
    { id: 'title', label: 'Track', minWidth: 170 },
    { id: 'artist', label: 'Artist', minWidth: 100 },
    { id: 'year', label: 'Duration', minWidth: 170, align: 'right'},
];

// function titleValue(props) {
//     if(props.title === 'title') {
//         return <Link to={``}
//     }
// }

export default function SongsList() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [count, setCount] = useState(-1);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const getData = async() => {
        console.log("it ran")
        try {
            const response = await fetch(`https://api.discogs.com/artists/1/releases?page=${page+1}&per_page=${rowsPerPage}`);
            
            if(!response.ok) {
                if(response.status === 404) {
                    throw new Error ('404 not found')
                } else throw new Error (`This is an HTTP error: The status is ${response.status}`);
            }

            let actualData = await response.json();

            console.log(actualData);
            setCount(actualData["pagination"]["items"]);
            setData(actualData["releases"]);
            console.log("Length of data", actualData["releases"].length);
            setError(null);
            console.log("data", data)
        } catch(err) {
            /**
             * fetch() method only rejects on a network failure; 
             * it won’t reject if we hit a wrong or nonexisting endpoint
             * like …/postssss. In this case, .catch() will not catch that error, 
             * so we must manually handle that.
             */
            setError(err.message);
            setData(null);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        getData();
    }, [page, rowsPerPage]);
        
        
    const handleChangePage = (event, newPage) => {
        // console.log(event);
        console.log(newPage);
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        console.log(event.target.value)
        setRowsPerPage(event.target.value, 10);
        setPage(0);
    };




    return (
        <>
            <div className="ListContainer">
                <h1>Listed Songs</h1>
                {loading && <div>A moment please...</div>}
                {error && (
                    <div>{`There is a problem fetching the post - ${error}`} </div>
                )}

                {!error && !loading &&  (

                
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 445 }}>
                        <Table stickyHeader aria-label="sticky table">
                        <TableHead >
                            <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                                >
                                {column.label}
                                </TableCell>
                            ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data
                            .map((row) => {
                                return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                    {columns.map((column) => {
                                    const value = row[column.id];
                                        return (
                                        <TableCell key={column.id} align={column.align}>
                                            {/* {(if (column.id === 'title') return <h1>hi</h1>)} */}
                                            <Link to={`/releases/${row.id}`}>{value}</Link>

                                        </TableCell>
                                        )})}
                                </TableRow>
                                );
                            })}
                        </TableBody>
                        </Table>
                    </TableContainer>
                    <ThemeProvider theme={theme}>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={count}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                    </ThemeProvider>
                    </Paper>
                )}
            </div>
        </>

    );
}
