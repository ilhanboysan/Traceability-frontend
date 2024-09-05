import React, { useState, useEffect } from 'react';
import {
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import IconButton from '@mui/material/IconButton';
import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';
const ITEMS_PER_PAGE = 8;
const MAX_TEXT_LENGTH = 100;

const BasicTable = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedError, setSelectedError] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newErrorNo, setNewErrorNo] = useState('');
  const [newErrorText, setNewErrorText] = useState('');
  const [updateErrorNo, setUpdateErrorNo] = useState('');
  const [updateErrorText, setUpdateErrorText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:7035/api/cfgErrors');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleConfirmCreate = () => {
    const newError = {
      errorNo: newErrorNo,
      errorText: newErrorText,
    };

    fetch('https://localhost:7035/api/cfgErrors', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newError),
    })
      .then(response => response.json())
      .then(result => {
        console.log('Create response:', result);

        if (result.status === 201) {
          setData([...data, newError]);

          setNewErrorNo('');
          setNewErrorText('');
        } else {
          console.error('Error creating data:', result);
          updatetable();
        }
      })
      .catch(error => {
        console.error('Fetch error:', error);
        updatetable();
      });

    setCreateDialogOpen(false);
  };

  const handleCreate = () => {
    console.log('Update button clicked');
    setCreateDialogOpen(true);
  };
  const handleUpdate = (error) => {
    setSelectedError(error);
    setUpdateErrorNo(error.errorNo);
    setUpdateErrorText(error.errorText);
    setUpdateDialogOpen(true);
  };

  const updatetable = async () => {
    try {
      const response = await fetch('https://localhost:7035/api/cfgErrors');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error updating table:', error);
    }
  };

  const handleConfirmUpdate = () => {
    if (selectedError && selectedError.errorNo && selectedError.errorText) {
      const updatedError = {
        errorNo: updateErrorNo,
        errorText: updateErrorText,
      };

      fetch(`https://localhost:7035/api/cfgErrors/${selectedError.errorNo}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedError),
      })
        .then(response => response.json())
        .then(result => {
          console.log('Update response:', result);
        })
        .catch(error => {
          console.error('Fetch error:', error);
          updatetable();
        });
    } else {
      console.log('Update için geçerli bir hata seçilmedi');
    }

    setUpdateDialogOpen(false);
    setSelectedError(null);
  };

  const handleDelete = (error) => {
    setSelectedError(error);
    setDeleteDialogOpen(true);
  };
  const handleConfirmDelete = () => {
    if (selectedError && selectedError.errorNo && selectedError.errorText) {
      fetch(`https://localhost:7035/api/cfgErrors/${selectedError.errorNo}/${selectedError.errorText}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP hatası! Durum: ${response.status}`);
          }
          return response.json();
        })
        .then(result => {
          console.log('Silme yanıtı:', result);

          if (result.status === 200) {
            const updatedData = data.filter(item => !(item.errorNo === selectedError.errorNo && item.errorText === selectedError.errorText));
            setData(updatedData);
          } else {
            console.error('Veri silme hatası:', result);
          }
        })
        .catch(error => {
          console.error('Fetch hatası:', error);
          updatetable();
        });
    } else {
      console.log('Silme için geçerli bir hata seçilmedi');
    }

    setDeleteDialogOpen(false);
    setSelectedError(null);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  const handleCloseUpdateDialog = () => {
    setUpdateDialogOpen(false);
  };

  const filteredData = data.filter(
    (row) =>
      row.errorNo.toString().includes(searchTerm) ||
      row.errorText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  return (
    <MainCard size='large' title="Errors">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          disableElevation
          size="medium"
          type="button"
          variant="contained"
          color="success"
          onClick={handleCreate}
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
        >
          + Add Error
        </Button>
        <Typography variant="body2"></Typography>

        <TextField id="search" label="Search Error" variant="outlined" size="small" value={searchTerm} onChange={handleSearch} />
      </Box>
      <TableContainer sx={{ backgroundColor:'#DAE1F7'}}>
        <Table sx={{ minWidth: 650 }} aria-label="basit tablo">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#0046FF', fontWeight: 'bold', width: '100px' }}>ERROR NO</TableCell>
              <TableCell sx={{ color: '#0046FF', fontWeight: 'bold', width: '200px' }}>ERROR TEXT</TableCell>
              <TableCell sx={{ color: '#0046FF', fontWeight: 'bold', width: '150px', paddingLeft: '50px' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={row.id} sx={{ backgroundColor: index % 2 === 0 ? '#E1E1E1' : '#EEEEEE' }}>
                <TableCell sx={{fontWeight:'bold',fontSize:'14px'}}>{row.errorNo}</TableCell>
                <TableCell sx={{ color:'#C70039', fontWeight: 'bold',fontSize:'14px' }}>
                  {row.errorText.length > MAX_TEXT_LENGTH
                    ? `${row.errorText.substring(0, MAX_TEXT_LENGTH)}...`
                    : row.errorText}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, paddingRight: '000px' }}>
                    <IconButton
                      color="primary"
                      onClick={() => handleUpdate(row)}
                    >
                      <UpdateIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(row)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Sayfalama Kontrolleri */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
        <Button
          variant="outlined"
          color="primary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </Button>
        <Typography sx={{ marginX: '16px' }}>
          Page {currentPage} of {totalPages}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Remove Error</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to remove this error?</Typography>
          <Typography>Error No: {selectedError?.errorNo}</Typography>
          <Typography>Error Text: {selectedError?.errorText}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: 'black' }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onClose={handleCloseCreateDialog}>
        <DialogTitle>Create Error</DialogTitle>
        <DialogContent>
          <TextField
            label="Error No"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newErrorNo}
            onChange={(e) => setNewErrorNo(e.target.value)}
          />
          <TextField
            label="Error Text"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newErrorText}
            onChange={(e) => setNewErrorText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog} sx={{ color: 'black' }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmCreate} color="success">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onClose={handleCloseUpdateDialog}>
        <DialogTitle>Change Error</DialogTitle>
        <DialogContent>
          {/* Update için gerekli inputları buraya ekleyebilirsiniz */}
          <TextField
            label="Error No"
            variant="outlined"
            fullWidth
            margin="normal"
            value={updateErrorNo}
            onChange={(e) => setUpdateErrorNo(e.target.value)}
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Error Text"
            variant="outlined"
            fullWidth
            margin="normal"
            value={updateErrorText}
            onChange={(e) => setUpdateErrorText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog} sx={{ color: 'black' }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmUpdate} color="primary">
            Change
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default BasicTable;
