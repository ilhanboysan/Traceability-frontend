import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';

export default function BasicTable() {
  const [data, setData] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [machineId, setMachineId] = useState('');
  const [operationNo, setOperationNo] = useState('');
  const [isUnrelateDialogOpen, setUnrelateDialogOpen] = useState(false);
  const [unrelateMachineId, setUnrelateMachineId] = useState('');
  const [unrelateOperationNo, setUnrelateOperationNo] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:7035/api/MultipleTable');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Veri getirme hatası:', error);
      }
    };
    fetchData();
  }, []);

  const handleDataUpdate = async () => {
    try {
      const response = await fetch('https://localhost:7035/api/MultipleTable');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleEkleButtonClick = () => {
    setDialogOpen(true);
  };

  const handleUnrelateButtonClick = () => {
    setUnrelateDialogOpen(true);
  };

  const handleUnrelateConfirm = async () => {
    try {
      if (isNaN(unrelateMachineId) || isNaN(unrelateOperationNo)) {
        throw new Error('Machine Id ve Operation No sadece sayısal değerler içermelidir.');
      }

      const response = await fetch(`https://localhost:7035/api/cfgMachineOpeartion/${unrelateMachineId}/${unrelateOperationNo}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('API ile iletişim hatası');
      }

      const updatedData = data.filter((item) => item.machineID !== parseInt(unrelateMachineId));
      setData(updatedData);
      setUnrelateDialogOpen(false);
    } catch (error) {
      console.error('Kaldırma hatası:', error);
    }
  };

  const handleUnrelateCancel = () => {
    setUnrelateDialogOpen(false);
    setUnrelateMachineId('');
    setUnrelateOperationNo('');
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setMachineId(0);
    setOperationNo('');
  };

  const handleSaveButtonClick = async () => {
    try {
      if (isNaN(machineId) || isNaN(operationNo)) {
        throw new Error('Machine Id ve Operation No sadece sayısal değerler içermelidir.');
      }

      const response = await fetch('https://localhost:7035/api/cfgMachineOpeartion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ machineID: parseInt(machineId), operationNo: parseInt(operationNo) }),
      });

      if (response.ok) {
        handleDataUpdate();
      }

      setDialogOpen(false);
    } catch (error) {
      console.error('Kaydetme hatası:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = data.filter((row) =>
    Object.values(row).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <TextField
        label="Search"
        type="search"
        value={searchTerm}
        onChange={handleSearchChange}
        variant="outlined"
        size="small"
      />
      <div>
        <Button
          variant="contained"
          color="success"
          sx={{ marginLeft: 0.5, color: '#ffffff' }}
          onClick={handleEkleButtonClick}
        >
          RELATE
        </Button>
        <Button variant="contained" color="error" sx={{ marginLeft: 2 }} onClick={handleUnrelateButtonClick}>
          UNRELATE
        </Button>
      </div>
    </Box>
      <Box mt={2} />
      {/* Tablo */}
      <TableContainer sx={{background:'#9FADD3'}} component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="basit tablo">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h4" fontWeight="bold" color='#0046FF'>
                  Machine ID
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h4" fontWeight="bold" color='#0046FF'>
                  Machine Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h4" fontWeight="bold" color='#0046FF'>
                  Operation No
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h4" fontWeight="bold" color='#0046FF'> 
                  Operation Description
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h4" fontWeight="bold" color='#0046FF'>
                  Operation Notes
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h4" fontWeight="bold" color='#0046FF'>
                  Assembly Operation
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {filteredData.length === 0 ? (
    <TableRow>
      <TableCell colSpan={6}>Not Found...</TableCell>
    </TableRow>
  ) : (
    filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
      <TableRow
        key={row.ID}
        sx={{ background: index % 2 === 0 ? '#E1E1E1' : '#EEEEEE' }}
      >
        <TableCell component="th" scope="row">
          <Typography variant="body1" fontWeight="bold" style={{ color: '#C70039' }}>
            {row.machineID}
          </Typography>
        </TableCell>
        <TableCell>{row.machineName}</TableCell>
        <TableCell>
          <Typography variant="body1" fontWeight="bold" style={{ color: '#C70039' }}>
            {row.operationNo}
          </Typography>
        </TableCell>
        <TableCell>{row.operationDescription}</TableCell>
        <TableCell>
          <Typography variant="body1" fontWeight="bold" style={{ color: '#C70039' }}>
            {row.operationNotes}
          </Typography>
        </TableCell>
        <TableCell>{row.assemblyOperation.toString()}</TableCell>
        <TableCell></TableCell>
      </TableRow>
    ))
  )}
</TableBody>

        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          
        />
      </TableContainer>

      {/* Dialog penceresi */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#1239f2' }}>Relate Machine/Operation</DialogTitle>
        <DialogContent>
          <TextField
            label="Machine Id"
            type="number"
            value={machineId}
            onChange={(e) => setMachineId(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Operation No"
            type="number"
            value={operationNo}
            onChange={(e) => setOperationNo(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button sx={{ fontWeight: 'bold', color: '#000000' }} onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button sx={{ color: '#16C400' }} onClick={handleSaveButtonClick}>
            Relate
          </Button>
        </DialogActions>
      </Dialog>

      {/* Unrelate Dialog */}
      <Dialog open={isUnrelateDialogOpen} onClose={handleUnrelateCancel}>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#1239f2' }}>Unrelate Machine/Operation</DialogTitle>
        <DialogContent>
          <TextField
            label="Machine Id"
            type="number"
            value={unrelateMachineId}
            onChange={(e) => setUnrelateMachineId(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Operation No"
            type="number"
            value={unrelateOperationNo}
            onChange={(e) => setUnrelateOperationNo(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button sx={{ fontWeight: 'bold', color: '#000000' }} onClick={handleUnrelateCancel}>
            Cancel
          </Button>
          <Button sx={{ color: '#C70039' }} onClick={handleUnrelateConfirm}>
            Unrelate
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
