import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { useContext } from "react";
import { InvoiceContext } from "../context/InvoiceContext";

function DeleteModal({invoice, onClick}){
  
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedInvoice, deleteInvoice } = useContext(InvoiceContext);

  function handleClick(){
    onClick(invoice);
    onOpen();
  }

  async function handleDeleteButton(invoice){
    const response = await deleteInvoice(invoice);
    
    if(response.error){
      toast({title: 'Error', description: response.error, status: 'error', position: 'bottom', isClosable: true })
    } else{
      onClose();
      toast({title: 'Success', description: response.success, status: 'success', position: 'bottom', isClosable: true })
    }
  }

  return(
    <>
      <Button onClick={handleClick} colorScheme='red' mr={{base: '1', md: '3'}} size='sm'>Delete</Button>
      { selectedInvoice && (<Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Invoice {selectedInvoice.id}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete {selectedInvoice.id}?</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='gray' outline='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='red' onClick={() => handleDeleteButton(invoice)}>Delete Invoice</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>)}
    </>
  )
}

export default DeleteModal;