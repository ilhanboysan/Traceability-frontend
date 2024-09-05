import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Checkbox,
} from '@mui/material';
import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';

const pageSize = 8;

const BasicTable = () => {
  const [rows, setRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Yeni state'leri ekledik
  const [updatedOperationDescription, setUpdatedOperationDescription] = useState('');
  const [updatedOperationNotes, setUpdatedOperationNotes] = useState('');
  const [updatedAssemblyOperation, setUpdatedAssemblyOperation] = useState(false);

  // Yeni state'leri ekledik
  const [newOperationNo, setNewOperationNo] = useState('');
  const [newOperationDescription, setNewOperationDescription] = useState('');
  const [newOperationNotes, setNewOperationNotes] = useState('');
  const [newAssemblyOperation, setNewAssemblyOperation] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('https://localhost:7035/api/cfgOperations')
      .then((response) => response.json())
      .then((data) => {
        const rowsWithId = data.map((row, index) => ({ id: index + 1, ...row }));
        setRows(rowsWithId);
      })
      .catch((error) => console.error('Veri getirme hatası:', error));
  }, []);

  const handleDeleteClick = (row) => {
    setDeleteDialogOpen(true);
    setSelectedRow(row);
  };

  const handleDeleteOperation = async () => {
    try {
      const response = await fetch(`https://localhost:7035/api/cfgOperations/${selectedRow.operationNo}`, {
        method: 'DELETE',
        headers: {
          'accept': '*/*',
        },
      });

      if (response.ok) {
       handleDataUpdate();
      } else {
        handleDataUpdate();
      }
    } catch (error) {
      handleDataUpdate();
    }

    // Dialog penceresi kapatıldı
    setDeleteDialogOpen(false);
  };

  const handleUpdateClick = (row) => {
    // Güncelleme için dialogu aç, seçili satırı ayarla
    setUpdateDialogOpen(true);
    setSelectedRow(row);

    // Seçili satırın verilerini state'lere yerleştir
    setUpdatedOperationDescription(row.operationDescription);
    setUpdatedOperationNotes(row.operationNotes);
    setUpdatedAssemblyOperation(row.assemblyOperation);
  };

  const handleDataUpdate = async () => {
    try {
      const response = await fetch('https://localhost:7035/api/cfgOperations');
      const result = await response.json();
      setRows(result);
    } catch (error) {
      const response = await fetch('https://localhost:7035/api/cfgOperations');
      const result = await response.json();
      setRows(result);
    }
  };

  const handleUpdateOperation = async () => {
    try {
      const response = await fetch(`https://localhost:7035/api/cfgOperations/${selectedRow.operationNo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
        },
        body: JSON.stringify({
          operationDescription: updatedOperationDescription,
          operationNotes: updatedOperationNotes,
          assemblyOperation: updatedAssemblyOperation,
        }),
      });

      if (response.ok) {
        handleDataUpdate();
      } else {
        handleDataUpdate();
      }
    } catch (error) {
      handleDataUpdate();
    }

    // Dialog penceresi kapatıldı
    setUpdateDialogOpen(false);
  };

  const handleAddOperation = async () => {
    try {
      const response = await fetch('https://localhost:7035/api/cfgOperations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
        },
        body: JSON.stringify({
          operationNo:newOperationNo,
          operationDescription: newOperationDescription,
          operationNotes: newOperationNotes,
          assemblyOperation: newAssemblyOperation,
        }),
      });

      if (response.ok) {
        handleDataUpdate();
      } else {
        handleDataUpdate();
      }
    } catch (error) {
      handleDataUpdate();
    }

    // Dialog penceresi kapatıldı
    setAddDialogOpen(false);
  };

  const totalPages = Math.ceil(rows.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedRows = rows
  .filter(row => {
    const operationNo = row.operationNo ? row.operationNo.toString() : '';
    const operationDescription = row.operationDescription && typeof row.operationDescription === 'string' ? row.operationDescription.toLowerCase() : '';
    const operationNotes = row.operationNotes && typeof row.operationNotes === 'string' ? row.operationNotes.toLowerCase() : '';

    return (
      operationNo.includes(searchTerm.toLowerCase()) ||
      operationDescription.includes(searchTerm.toLowerCase()) ||
      operationNotes.includes(searchTerm.toLowerCase())
    );
  })
  .slice(startIndex, endIndex);

  return (
    <div>
       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <Button
          variant="contained"
          size="medium"
          sx={{
            backgroundColor: '#000000',
            border: '1px solid #000000',
            borderRadius: '12px',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#000000',
              boxShadow: '0px 0px 10px 5px rgba(255, 255, 255, 0.8)',
            },
          }}
          onClick={() => setAddDialogOpen(true)}
        >
          + Add Operation
        </Button>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <TableContainer  sx={{ backgroundColor:'#DAE1F7'}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography color='#0046FF' variant="h5" fontWeight="bold">Operation No</Typography>
              </TableCell>
              <TableCell><Typography color='#0046FF'variant="h5" fontWeight="bold">Operation Description</Typography></TableCell>
              <TableCell><Typography color='#0046FF' variant="h5" fontWeight="bold">Operation Notes</Typography></TableCell>
              <TableCell><Typography color='#0046FF' variant="h5" fontWeight="bold">Assembly Operation</Typography></TableCell>
              <TableCell><Typography color='#0046FF' variant="h5" fontWeight="bold">Actions</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedRows.map((row, index) => (
              <TableRow
                key={row.id}
                style={{ backgroundColor: index % 2 === 0 ? '#E0E0E0' : '#FFFFFF' }}
              >
                <TableCell>
                  <Typography variant="body1" fontWeight="bold" style={{ color: '#C70039' }}>{row.operationNo}</Typography>
                </TableCell>
                <TableCell>{row.operationDescription}</TableCell>
                <TableCell>
                  <Typography variant="body1" fontWeight="bold" style={{ color: '#C70039' }}>{row.operationNotes}</Typography>
                </TableCell>
                <TableCell>{row.assemblyOperation ? 'True' : 'False'}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleUpdateClick(row)}>
                    <UpdateIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteClick(row)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div>
        <Button
          onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        
        <span><em>{`Page ${currentPage} / ${totalPages}`}</em></span>
        <Button
          onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
      <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)}>
        <DialogTitle>Change Operation</DialogTitle>
        <DialogContent>
          {/* Güncelleme için alanları ekleyin */}
          <TextField
            label="Operation Description"
            variant="outlined"
            fullWidth
            margin="normal"
            value={updatedOperationDescription}
            onChange={(e) => setUpdatedOperationDescription(e.target.value)}
          />
          <TextField
            label="Operation Notes"
            variant="outlined"
            fullWidth
            margin="normal"
            value={updatedOperationNotes}
            onChange={(e) => setUpdatedOperationNotes(e.target.value)}
          />
          <label htmlFor="assemblyOperationCheckbox" style={{ fontWeight: 'bold' }}>
            <Checkbox
              id="assemblyOperationCheckbox"
              checked={updatedAssemblyOperation}
              onChange={() => setUpdatedAssemblyOperation(!updatedAssemblyOperation)}
            />
            Assembly Operation
          </label>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialogOpen(false)} sx={{ color: 'black' }}>
            Cancel
          </Button>
          <Button onClick={handleUpdateOperation} color="primary">
            Change
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add Operation</DialogTitle>
        <DialogContent>
          {/* Ekleme için alanları ekleyin */}
          <TextField
            label="Operation No"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newOperationNo}
            onChange={(e) => setNewOperationNo(e.target.value)}
          />
          <TextField
            label="Operation Description"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newOperationDescription}
            onChange={(e) => setNewOperationDescription(e.target.value)}
          />
          <TextField
            label="Operation Notes"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newOperationNotes}
            onChange={(e) => setNewOperationNotes(e.target.value)}
          />
          <label htmlFor="newAssemblyOperationCheckbox" style={{ fontWeight: 'bold' }}>
            <Checkbox
              id="newAssemblyOperationCheckbox"
              checked={newAssemblyOperation}
              onChange={() => setNewAssemblyOperation(!newAssemblyOperation)}
            />
            Assembly Operation
          </label>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)} sx={{ color: 'black' }}>
            Cancel
          </Button>
          <Button onClick={handleAddOperation} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Remove Operation</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this operation?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: 'black' }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteOperation} color="error">
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BasicTable;
