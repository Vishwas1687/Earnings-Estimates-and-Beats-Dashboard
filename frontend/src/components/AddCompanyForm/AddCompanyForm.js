// components/AddCompanyForm/AddCompanyForm.js
import { useState } from 'react';
import { TextInput, Button, Group, Alert, Paper } from '@mantine/core';
import { IconAlertCircle, IconPlus } from '@tabler/icons-react';

const AddCompanyForm = ({ onAddCompany, loading, error }) => {
  const [ticker, setTicker] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ticker.trim() && name.trim()) {
      onAddCompany(ticker.trim().toUpperCase(), name.trim());
      setTicker('');
      setName('');
    }
  };

  return (
    <Paper shadow="xs" p="md" mb="md">
      <form onSubmit={handleSubmit}>
        <Group align="flex-end">
          <TextInput
            label="Company Ticker"
            placeholder="e.g., AAPL"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            required
            style={{ flex: 1 }}
            disabled={loading}
          />
          <TextInput
            label="Company Name"
            placeholder="e.g., Apple Inc."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ flex: 2 }}
            disabled={loading}
          />
          <Button 
            type="submit" 
            loading={loading}
            leftSection={<IconPlus size={16} />}
          >
            Add Company
          </Button>
        </Group>
      </form>
      
      {error && (
        <Alert 
          icon={<IconAlertCircle size="1rem" />} 
          title="Error" 
          color="red"
          mt="md"
        >
          {error}
        </Alert>
      )}
    </Paper>
  );
};

export default AddCompanyForm;