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

const ITEMS_PER_PAGE = 25; 
const MAX_TEXT_LENGTH = 100; 

const SamplePage = () => {
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
    <MainCard title="Errors">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2"></Typography>
        <Button
          disableElevation
          size="small"
          type="button"
          variant="contained"
          color="success"
          onClick={handleCreate}
          sx={{
            color: 'black',
            fontSize: '18px',
            width: '120px',
            height: '40px',
            marginRight: '1200px',
            borderRadius: '20px',
          }}
        >
          Create
        </Button>
        <TextField id="search" label="Ara" variant="outlined" size="small" value={searchTerm} onChange={handleSearch} />
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'gray', fontWeight: 'italic', width: '100px' }}>ERROR NO</TableCell>
              <TableCell sx={{ color: 'gray', fontWeight: 'italic', width: '200px' }}>ERROR TEXT</TableCell>
              <TableCell sx={{ color: 'gray', fontWeight: 'italic', width: '150px', paddingLeft: '100px' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.errorNo}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  {row.errorText.length > MAX_TEXT_LENGTH
                    ? `${row.errorText.substring(0, MAX_TEXT_LENGTH)}...`
                    : row.errorText}

                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, paddingRight: '000px' }}>
                    <Button
                      disableElevation
                      fullWidth
                      size="small"
                      type="button"
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdate(row)}
                      sx={{ minWidth: '100px', width: '100px', borderRadius: '20px' }}
                    >
                      Update
                    </Button>
                    <Button
                      disableElevation
                      fullWidth
                      size="small"
                      type="button"
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(row)}
                      sx={{ minWidth: '100px', width: '100px', borderRadius: '20px' }}
                      
                    >
                      Delete
                    </Button>
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
  <DialogTitle>Delete Error</DialogTitle>
  <DialogContent>
    <Typography>Are you sure you want to delete this error?</Typography>
    <Typography>Error No: {selectedError?.errorNo}</Typography>
    <Typography>Error Text: {selectedError?.errorText}</Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: 'black' }}>
      Cancel
    </Button>
    <Button onClick={handleConfirmDelete} color="error">
      Delete
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
  <DialogTitle>Update Error</DialogTitle>
  <DialogContent>
    {/* Update için gerekli inputları buraya ekleyebilirsiniz */}
    <TextField
      label="Update Error No"
      variant="outlined"
      fullWidth
      margin="normal"
      value={updateErrorNo}
      onChange={(e) => setUpdateErrorNo(e.target.value)}
    />
    <TextField
      label="Update Error Text"
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
      Update
    </Button>
  </DialogActions>
</Dialog>

      
    </MainCard>
  );
};

export default SamplePage;
