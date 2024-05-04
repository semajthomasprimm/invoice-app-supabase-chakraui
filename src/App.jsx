import './App.css'
import { InvoiceProvider } from './context/InvoiceContext';
import InvoiceList from './components/InvoiceList';
import { Flex } from '@chakra-ui/react';
function App() {

  return (
    <InvoiceProvider>
      <Flex height="100vh" width='100vw' backgroundColor="gray.100" flexDirection='column' paddingX={{ base: '10px', md: '50px', lg: '100px'}}>
        <InvoiceList />
      </Flex>
    </InvoiceProvider>
  )
}

export default App
