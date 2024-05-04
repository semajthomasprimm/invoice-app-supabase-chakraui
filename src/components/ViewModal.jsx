import { Box, Button, Grid, GridItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tr, useDisclosure } from "@chakra-ui/react";
import { useContext } from "react";
import { InvoiceContext } from "../context/InvoiceContext";

function ViewModal({ invoice, onClick }){
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { selectedInvoice } = useContext(InvoiceContext);

    function handleClick(){
      onClick(invoice);
      onOpen();
    }
  
    return(
      <>
        <Button onClick={handleClick} colorScheme='messenger' mr={{base: '1', md: '3'}} size={{base: 'sm'}}>View</Button>
        <Modal isOpen={isOpen} onClose={onClose} size='3xl'>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>View Invoice Details</ModalHeader>
            <ModalCloseButton />
            {selectedInvoice && (
            <ModalBody>
                <Box display='flex' justifyContent='space-between' mb='4'>
                  <Box>
                    <Text as='b'>{selectedInvoice.id}</Text>
                    <Text>{selectedInvoice.project_description}</Text>
                  </Box>
                  <Box>
                    <Text>{selectedInvoice.billFrom[0].street_address}</Text>
                    <Text>{selectedInvoice.billFrom[0].city}</Text>
                    <Text>{selectedInvoice.billFrom[0].postCode}</Text>
                    <Text>{selectedInvoice.billFrom[0].country}</Text>
                  </Box>
                </Box>
                <Grid templateColumns='repeat(3, 1fr)' gap={6} mb='4'>
                  <GridItem>
                    <Box mb='6'>
                      <Text mb='1'>Invoice Date</Text>
                      <Text as='b'>{selectedInvoice.created_at}</Text>
                    </Box>
                    <Box>
                      <Text mb='1'>Payment Due</Text>
                      <Text as='b'>{selectedInvoice.payment_due}</Text>
                    </Box>
                  </GridItem>
                  <GridItem>
                    <Text>Bill To</Text>
                    <Text as='b'>{selectedInvoice.billTo[0].client_name}</Text>
                    <Text>{selectedInvoice.billTo[0].street_address}</Text>
                    <Text>{selectedInvoice.billTo[0].city}</Text>
                    <Text>{selectedInvoice.billTo[0].postCode}</Text>
                    <Text>{selectedInvoice.billTo[0].country}</Text>
                  </GridItem>
                  <GridItem>
                    <Text>Sent to</Text>
                    <Text as='b'>{selectedInvoice.billTo[0].client_email}</Text>
                  </GridItem>
                </Grid>
                <TableContainer>
                  <Table variant='simple'>
                    <Thead>
                      <Tr>
                        <Th>Item Name</Th>
                        <Th>Qty.</Th>
                        <Th>Price</Th>
                        <Th>Total</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {selectedInvoice.listItem.map((item, i) => (
                        <Tr key={i}>
                          <Td><Text as='b'>{item.name}</Text></Td>
                          <Td>{item.quantity}</Td>
                          <Td>${item.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Td>
                          <Td><Text as='b'>${item.total.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Text></Td>
                        </Tr>
                      ))}
                    </Tbody>
                    <Tfoot>
                        <Tr>
                          <Th>Amount Due</Th>
                          <Td></Td>
                          <Td></Td>
                          <Td>${selectedInvoice.total.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Td>
                        </Tr>
                    </Tfoot>
                  </Table>
                </TableContainer>
            </ModalBody>
            )}
  
            <ModalFooter>
              <Button colorScheme='gray' variant='outline' mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}

export default ViewModal;
