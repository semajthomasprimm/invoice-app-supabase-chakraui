import { useContext } from "react";
import { InvoiceContext } from "../context/InvoiceContext";
import {
  Badge,
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import ViewModal from "./ViewModal";
import CreateModal from "./CreateModal";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";

function InvoiceList() {
  const { invoices, setSelectedInvoice } = useContext(InvoiceContext);

  function handleInvoiceClick(invoice){
    setSelectedInvoice(invoice);
  }

  return (
    <>
      <Box
          my="12"
          display="flex"
          justifyContent="space-between"
          width='100%'
        >
          <Text fontSize="2xl" fontWeight="semibold">Invoices</Text>
          <CreateModal />
        </Box>
        <Box>
          {invoices.length > 0 ? (
            <TableContainer>
              <Table
                variant="simple"
                backgroundColor="white"
                boxShadow="lg"
                rounded="md"
                size={{base: 'sm', lg: 'md'}}
              >
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
                  {invoices.map((invoice) => {
                    return (
                      <Tr key={invoice.id}>
                        <Td>
                          <Text as="b">{invoice.id}</Text>
                        </Td>
                        <Td>{invoice.payment_due}</Td>
                        <Td>{invoice.billTo[0].client_name}</Td>
                        <Td>
                          <Text as="b">
                            ${invoice.total.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </Text>
                        </Td>
                        <Td>{invoice.status === true ? <Badge colorScheme="green">paid</Badge> : <Badge colorScheme="orange">pending</Badge>}</Td>
                        <Td>
                            <ViewModal invoice={invoice} onClick={handleInvoiceClick} />
                            <EditModal invoice={invoice} onClick={handleInvoiceClick}  />
                            <DeleteModal invoice={invoice} onClick={handleInvoiceClick}/>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <p>No invoices.</p>
          )}

        </Box>
    </>
  );
}

export default InvoiceList;
