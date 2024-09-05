import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';


export default function CustomCard() {
  const [data, setData] = useState([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newMachineId, setNewMachineId] = useState('');
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [newMachineName, setNewMachineName] = useState('');
  const [selectedMachineId, setSelectedMachineId] = useState('');
  const [selectedMachine, setSelectedMachine] = useState({ machineID: '', machineName: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:7035/api/cfgMachines');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteClick = (machineId) => {
    setSelectedMachineId(machineId);
    setDeleteDialogOpen(true);
    handleDataUpdate();
  };

  const handleDataUpdate = async () => {
    try {
      const response = await fetch('https://localhost:7035/api/cfgMachines');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`https://localhost:7035/api/cfgMachines/${selectedMachineId}`, {
        method: 'DELETE',
        headers: {
          'accept': '*/*',
        },
      });

      if (response.ok) {
        // Silme işlemi başarıyla gerçekleşti, veriyi güncelle
        handleDataUpdate();
        fetchData();
      } else {
        console.error('Failed to delete machine. HTTP Status:', response.status);
      }
    } catch (error) {
      console.error('Error deleting machine:', error);
    }

    // Dialog penceresini kapat
    setAddDialogOpen(false);
  };

  const handleAddMachine = async () => {
    try {
      const response = await fetch('https://localhost:7035/api/cfgMachines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
        },
        body: JSON.stringify({
          machineID: newMachineId,
          machineName: newMachineName,
        }),
      });

      if (response.ok) {
        // Yeni makine başarıyla eklendi, veriyi güncelle
        handleDataUpdate();
        fetchData();
      } else {
        console.error('Failed to add machine. HTTP Status:', response.status);
      }
    } catch (error) {
      console.error('Error adding machine:', error);
    }

    // Dialog penceresini kapat
    handleDataUpdate();
    setAddDialogOpen(false);
  };

  const handleUpdateClick = (machineId) => {
    const selectedMachine = data.find((machine) => machine.machineID === machineId);
    setSelectedMachine(selectedMachine);
    setNewMachineName(selectedMachine.machineName); // Yeni makine adını set et
    setUpdateDialogOpen(true);
    handleDataUpdate();
  };

  const handleConfirmUpdate = async () => {
    try {
      const response = await fetch(`https://localhost:7035/api/cfgMachines/${selectedMachine.machineID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
        },
        body: JSON.stringify({
          machineID: selectedMachine.machineID,
          machineName: newMachineName,
        }),
      });

      if (response.ok) {
        // Güncelleme işlemi başarıyla gerçekleşti, veriyi güncelle
        handleDataUpdate();
        fetchData();
      } else {
        console.error('Failed to update machine. HTTP Status:', response.status);
      }
    } catch (error) {
      console.error('Error updating machine:', error);
    }

    // Dialog penceresini kapat
    setUpdateDialogOpen(false);
  };
  return (
    <>
      <Typography variant="h1" sx={{ marginLeft: '100px', color: '#000', fontWeight: 'bold', fontSize: '2rem', marginTop: '100px' }}>
        Machines
      </Typography>
      <Button
        variant="contained"
        size="large"
        sx={{
          backgroundColor: '#000000',
          marginLeft: '1300px',
          marginBottom: '100px',
          border: '1px solid #000000',
          borderRadius: '12px',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#000000',
            boxShadow: '0px 0px 10px 5px rgba(255, 255, 255, 0.8)',
          },
        }}
        onClick={() => setAddDialogOpen(true)} // Dialog penceresini aç
      >
        + Add Machine
      </Button>

      <Grid container spacing={2}>
        {data.map((machine, index) => (
          <Grid
            item
            key={index}
            xs={12}
            sm={6}
            md={4}
            lg={4}
            sx={{
              marginBottom: '20px', // İstenilen alt mesafe
              marginRight: '-133px', // İstenilen sağ mesafe
            }}
          >

            <Card
              sx={{
                width: '380px',
                height: '300px',
                flexShrink: 0,
                borderRadius: '40px',
                background: '#CCD2E5',
                boxShadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.25) inset',
                border: '3px solid #900C3F',
                marginLeft: '200px',
                marginRight: '200px',
              }}
            >
              <PrecisionManufacturingIcon
                style={{ marginLeft: '160px', marginTop: '25px', width: '75px', height: '75px' }}
              />
              <Typography sx={{ color: '#000000', marginLeft: '170px', fontSize: '24px', marginTop: '00px' }} variant="h2">
                {machine.machineID}
              </Typography>
              <div style={{ marginLeft: '15px', textAlign: 'center' }}>
                <Typography sx={{ marginTop: '20px', color: '#857F81', fontWeight: 'bold', fontSize: '16px' }} variant="body1">
                  {machine.machineName}
                </Typography>
              </div>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button variant="contained" size="medium" startIcon={<UpgradeIcon />} color="primary" sx={{ marginTop: '20px' }} onClick={() => handleUpdateClick(machine.machineID)}>
                  Change
                </Button>
                <Button
                  variant="contained"
                  size="medium"
                  color="error"
                  startIcon={<DeleteIcon />}
                  sx={{ marginTop: '20px' }}
                  onClick={() => handleDeleteClick(machine.machineID)}
                >
                  Remove
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

     {/* Delete Confirmation Dialog */}
     <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Are you sure you want to delete this machine?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}sx={{ color: 'black' }}>Cancel</Button>
          <Button onClick={() => { handleConfirmDelete(); setDeleteDialogOpen(false)}} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
        {/* Update Dialog */}
        <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)}>
        <DialogTitle>Update Machine</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Machine ID: {selectedMachine.machineID}</Typography>
          <TextField
            label="New Machine Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newMachineName}
            onChange={(e) => setNewMachineName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialogOpen(false)}sx={{ color: 'black' }}>Cancel</Button>
          <Button onClick={() => { handleConfirmUpdate(); setUpdateDialogOpen(false); }} color="primary">Update</Button>
        </DialogActions>
      </Dialog>

      

      {/* Add Machine Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add Machine</DialogTitle>
        <DialogContent>
          <TextField
            label="Machine ID"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newMachineId}
            onChange={(e) => setNewMachineId(e.target.value)}
          />
          <TextField
            label="Machine Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newMachineName}
            onChange={(e) => setNewMachineName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}sx={{ color: 'black' }}>Cancel</Button>
          <Button onClick={handleAddMachine} color="success">Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
