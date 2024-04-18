import { useState } from 'react';
import './App.css'
import { Box, Button, Center, Container, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';

function App() {

  const [invoices, setInvoices] = useState([
    {
      id: '#RT3080',
      dueDate: 'Due 19 Aug 2021',
      clientName: 'Jensen Huang',
      dueAmount: '$1800.90',
      status: 'Paid'
    },
    {
      id: '#XM9141',
      dueDate: 'Due 20 Sep 2021',
      clientName: 'Alex Grim',
      dueAmount: '$556.00',
      status: 'Pending'
    },
    {
      id: '#FV2353',
      dueDate: 'Due 12 Nov 2021',
      clientName: 'Anita Wainwright',
      dueAmount: '$3,102.04',
      status: 'Draft'
    }
  ]);
  

  return (
    <>
      <Box backgroundColor='gray.100' h='100%'>
        <Center display='flex' flexDir='column'>
          <Box mt='12' w='100%' display='flex' justifyContent='space-between'>
            <Text fontSize='2xl' fontWeight='semibold'>Invoices</Text>
            <Button colorScheme='purple'>+ Create Invoice</Button>
          </Box>
          <Box>
            {invoices.length > 0
              ? <TableContainer>
                  <Table variant='simple'>
                    <Thead>
                      <Tr>
                        <Th>ID</Th>
                        <Th>Due Date</Th>
                        <Th>Client Name</Th>
                        <Th>Due Amount</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {invoices.map(invoice => {
                        return (
                          <Tr key={invoice.id}>
                            <Td>{invoice.id}</Td>
                            <Td>{invoice.dueDate}</Td>
                            <Td>{invoice.clientName}</Td>
                            <Td>{invoice.dueAmount}</Td>
                            <Td>{invoice.status}</Td>
                            <Td>
                              <Button colorScheme='purple'>View</Button>
                              <Button colorScheme='yellow'>Edit</Button>
                              <Button colorScheme='red'>Delete</Button>
                            </Td>
                          </Tr>
                        )
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
              : <p>No invoices.</p>
            }
          </Box>
        </Center>
      </Box>
    </>
  )
}

export default App
