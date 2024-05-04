import { Box, Button, ButtonGroup, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { useContext } from "react";
import { Field, FieldArray, Form, Formik } from "formik";
import * as Yup from "yup";
import { InvoiceContext } from "../context/InvoiceContext";

function CreateModal(){

    const { createInvoice } = useContext(InvoiceContext);

    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure();

    function handleClick(){
        onOpen();
    }

    const initialValues = {
        billFrom: [{
            street_address: '',
            city: '',
            post_code: '',
            country: ''
        }],
        billTo: [{
            client_name: '',
            client_email: '',
            street_address: '',
            city: '',
            post_code: '',
            country: ''
        }],
        status: false,
        project_description: '',
        created_at: '',
        payment_terms: '',
        listItem: [{}]
    }

    const testValues = {
        billFrom: [{
            street_address: '334 Joker Lane',
            city: 'Gotham',
            post_code: '23456',
            country: 'United States'
        }],
        billTo: [{
            client_name: 'Clark Kent',
            client_email: 'example@domain.com',
            street_address: '44 Wayne Tower',
            city: 'Gotham',
            post_code: '12345',
            country: 'United States'
        }],
        status: false,
        project_description: 'Character Design',
        created_at: '2024-05-02',
        payment_terms: '30',
        listItem: [{name: 'Sketches & Final Design', quantity: 2, price: 100, total: 200}]
    }

    const validateSchema = Yup.object().shape({
        billFrom: Yup.array(
          Yup.object({
            city: Yup.string().required("This field is required"),
            country: Yup.string().required("This field is required"),
            post_code: Yup.string().required("This field is required"),
            street_address: Yup.string().required("This field is required"),
          })
        ),
        billTo: Yup.array(
          Yup.object({
            city: Yup.string().required("This field is required"),
            client_email: Yup.string().email("Enter a valid email").required("This field is required"),
            client_name: Yup.string().required("This field is required"),
            country: Yup.string().required("This field is required"),
            post_code: Yup.string().required("This field is required"),
            street_address: Yup.string().required("This field is required"),
          })
        ),
        created_at: Yup.date().required("This field is required"),
        listItem: Yup.array(
          Yup.object({
              name: Yup.string().required("Name is required"),
              quantity: Yup.number().required("Quantity is required"),
              price: Yup.number().required("Price is required"),
          })
        ).min(1, 'At least one item is required'),
        payment_terms: Yup.number().required("This field is required"),
        project_description: Yup.string().required("This field is required"),
    });

    function calculateTotal(items){
        var result = items.reduce((accumulator, currentItem) => {
            return accumulator + (currentItem.quantity * currentItem.price);
          }, 0)
        return result;
    }

    function calculateDueDate(n, created_at){
        var currentDate = new Date(created_at)
        var dueDate = new Date();
        dueDate.setDate(currentDate.getDate() + n);
        var result = dueDate.toISOString().slice(0, 10);
        return result;
    }
  
    return(
      <>
        <Button onClick={handleClick} colorScheme='purple'>+ New Invoice</Button>
        <Modal isOpen={isOpen} onClose={onClose} size='3xl'>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>New Invoice</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validateSchema}
                    onSubmit={async(values, actions) => {
                        
                        values.total = calculateTotal(values.listItem)
                        values.payment_due = calculateDueDate(parseInt(values.payment_terms), values.created_at)
                        
                        // set total of each list item
                        values.listItem.map((item) => {
                            item.total = parseFloat(item.price) * parseInt(item.quantity);
                        })

                        const response = await createInvoice(values);
                        if(response.error){
                            toast({title: 'Error', description: response.error, status: 'error', position: 'bottom', isClosable: true})
                        } else{
                            onClose();
                            toast({title: 'Success', description: response.success, status: 'success', position: 'bottom', isClosable: true})
                        }
                        
                        actions.setSubmitting(false)
                    }}
                >
                    {(props) => (
                        <Form>
                            <Text color='purple.400' as='b'>Bill From</Text>
                            <Field name="billFrom[0].street_address">
                                {({ field, form }) => (
                                    <FormControl 
                                        my='4' 
                                        isInvalid={form.errors.billFrom && form.errors.billFrom[0].street_address && form.touched.billFrom && form.touched.billFrom[0].street_address}
                                    >
                                        <FormLabel>Street Address</FormLabel>
                                        <Input {...field} id='street' type='text' />
                                        <FormErrorMessage>{form.errors.billFrom && form.errors.billFrom[0].street_address}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>

                            <Grid templateColumns='repeat(3, 1fr)' gap={6} mb='6'>
                                <GridItem>
                                    <Field name="billFrom[0].city">
                                        {({ field, form }) => (
                                            <FormControl 
                                                isInvalid={form.errors.billFrom && form.errors.billFrom[0].city && form.touched.billFrom && form.touched.billFrom[0].city}>
                                                <FormLabel>City</FormLabel>
                                                <Input {...field} id='city' type='text' />
                                                <FormErrorMessage>{form.errors.billFrom && form.errors.billFrom[0].city}</FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                </GridItem>
                                <GridItem>
                                    <Field name="billFrom[0].post_code">
                                    {({ field, form }) => (
                                        <FormControl 
                                            isInvalid={form.errors.billFrom && form.errors.billFrom[0].post_code && form.touched.billFrom && form.touched.billFrom[0].post_code}>
                                            <FormLabel>Post Code</FormLabel>
                                            <Input {...field} id='post_code' type='text' />
                                            <FormErrorMessage>{form.errors.billFrom && form.errors.billFrom[0].post_code}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                    </Field>
                                </GridItem>
                                <GridItem>
                                    <Field name="billFrom[0].country">
                                    {({ field, form }) => (
                                        <FormControl 
                                            isInvalid={form.errors.billFrom && form.errors.billFrom[0].country && form.touched.billFrom && form.touched.billFrom[0].country}>
                                            <FormLabel>Country</FormLabel>
                                            <Input {...field} id='country' type='text' />
                                            <FormErrorMessage>{form.errors.billFrom && form.errors.billFrom[0].country}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                    </Field>
                                </GridItem>
                            </Grid>
                
                           <Text color='purple.400' as='b'>Bill To</Text>
                            <Field name='billTo[0].client_name'>
                                {({field, form}) => (
                                    <FormControl my='4' isInvalid={form.errors.billTo && form.errors.billTo[0].client_name && form.touched.billTo && form.touched.billTo[0].client_name}>
                                        <FormLabel>Client&apos;s Name</FormLabel>
                                        <Input {...field} type='text' />
                                        <FormErrorMessage>{form.errors.billTo && form.errors.billTo[0].client_name}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                
                            <Field name='billTo[0].client_email'>
                                {({field, form}) => (
                                    <FormControl my='4' isInvalid={form.errors.billTo && form.errors.billTo[0].client_email && form.touched.billTo && form.touched.billTo[0].client_email}>
                                        <FormLabel>Client&apos;s Email</FormLabel>
                                        <Input {...field} type='email' />
                                        <FormErrorMessage>{form.errors.billTo && form.errors.billTo[0].client_email}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                
                            <Field name='billTo[0].street_address'>
                                {({ field, form }) => (
                                    <FormControl 
                                        my='4'
                                        isInvalid={form.errors.billTo && form.errors.billTo[0].street_address && form.touched.billTo && form.touched.billTo[0].street_address}
                                    >
                                        <FormLabel>Street Address</FormLabel>
                                        <Input {...field} id='clientStreet' type='text' />
                                        <FormErrorMessage>{form.errors.billTo && form.errors.billTo[0].street_address}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>

                            <Grid templateColumns='repeat(3, 1fr)' gap={6} mb='6'>
                                <GridItem>
                                    <Field name="billTo[0].city">
                                        {({ field, form }) => (
                                            <FormControl 
                                                isInvalid={form.errors.billTo && form.errors.billTo[0].city && form.touched.billTo && form.touched.billTo[0].city}>
                                                <FormLabel>City</FormLabel>
                                                <Input {...field} id='clientCity' type='text' />
                                                <FormErrorMessage>{form.errors.billTo && form.errors.billTo[0].city}</FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                </GridItem>
                                <GridItem>
                                    <Field name="billTo[0].post_code">
                                    {({ field, form }) => (
                                        <FormControl 
                                            isInvalid={form.errors.billTo && form.errors.billTo[0].post_code && form.touched.billTo && form.touched.billTo[0].post_code}>
                                            <FormLabel>Post Code</FormLabel>
                                            <Input {...field} id='clientPostCode' type='text' />
                                            <FormErrorMessage>{form.errors.billTo && form.errors.billTo[0].post_code}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                    </Field>
                                </GridItem>
                                <GridItem>
                                    <Field name="billTo[0].country">
                                    {({ field, form }) => (
                                        <FormControl 
                                            isInvalid={form.errors.billTo && form.errors.billTo[0].country && form.touched.billTo && form.touched.billTo[0].country}
                                        >
                                            <FormLabel>Country</FormLabel>
                                            <Input {...field} id='clientCountry' type='text' />
                                            <FormErrorMessage>{form.errors.billTo && form.errors.billTo[0].country}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                    </Field>
                                </GridItem>
                            </Grid>
                
                             <Grid templateColumns='repeat(2, 1fr)' gap={6} mb='4'>
                                <GridItem>
                                    <Field name='created_at'>
                                        {({ field, form }) => (
                                            <FormControl
                                                isInvalid={form.errors.created_at && form.touched.created_at}
                                            >
                                                <FormLabel>Invoice Date</FormLabel>
                                                <Input {...field} id='created_at' type='date' />
                                                <FormErrorMessage>{form.errors.created_at}</FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                </GridItem>
                                <GridItem>
                                    <Field name='payment_terms'>
                                        {({ field, form }) => (
                                            <FormControl isInvalid={form.errors.payment_terms && form.touched.payment_terms}>
                                                <FormLabel>Payment Terms</FormLabel>
                                                <Select {...field} id='payment_terms' placeholder='Select option'>
                                                    <option value='1'>Net 1 Day</option>
                                                    <option value='7'>Net 7 Days</option>
                                                    <option value='14'>Net 14 Days</option>
                                                    <option value='30'>Net 30 Days</option>
                                                </Select>
                                                <FormErrorMessage>{form.errors.payment_terms}</FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                </GridItem>
                            </Grid>
                
                            <Field name='project_description'>
                                {({ field, form }) => (
                                    <FormControl my='6'
                                        isInvalid={form.errors.project_description && form.touched.project_description}
                                    >
                                        <FormLabel>Project Description</FormLabel>
                                        <Input {...field} id='project_description' type='text' />
                                        <FormErrorMessage>{form.errors.project_description}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                
                            <Text color='gray.400' as='b' fontSize='md'>Item List</Text>
                
                            <Grid templateColumns='repeat(6, 1fr)' gap={2} my='4'>
                                <GridItem colSpan={2}><Text fontSize='sm'>Item Name</Text></GridItem>
                                <GridItem><Text fontSize='sm'>Qty.</Text></GridItem>
                                <GridItem><Text fontSize='sm'>Price</Text></GridItem>
                                <GridItem><Text fontSize='sm'>Total</Text></GridItem>
                            </Grid>

                            <FieldArray name='listItem'>
                                {({ insert, remove, push}) => (
                                    <div>
                                        {props.values.listItem.map((item, i) => (
                                            <Grid templateColumns='repeat(6, 1fr)' gap={4} my='4' key={i}>
                                                <GridItem colSpan={2}>
                                                    <FormControl isInvalid={props.errors.listItem && props.errors.listItem[i]?.name}>
                                                        <Field name={`listItem.${i}.name`} placeholder="Name" as={Input} />
                                                        <FormErrorMessage>{props.errors.listItem && props.errors.listItem[i]?.name}</FormErrorMessage>
                                                    </FormControl>
                                                </GridItem>
                                                <GridItem>
                                                    <FormControl isInvalid={props.errors.listItem && props.errors.listItem[i]?.quantity}>
                                                        <Field name={`listItem.${i}.quantity`} placeholder="Quantity" as={Input} />
                                                        <FormErrorMessage>{props.errors.listItem && props.errors.listItem[i]?.quantity}</FormErrorMessage>
                                                    </FormControl>
                                                </GridItem>
                                                <GridItem>
                                                    <FormControl isInvalid={props.errors.listItem && props.errors.listItem[i]?.price}>
                                                        <Field name={`listItem.${i}.price`} placeholder="Price" as={Input} />
                                                        <FormErrorMessage>{props.errors.listItem && props.errors.listItem[i]?.price}</FormErrorMessage>
                                                    </FormControl>
                                                </GridItem>
                                                <GridItem>
                                                    <Text name={`listItem.${i}.total`} my={2}>{item.quantity && item.price && (parseInt(item.quantity)*parseFloat(item.price)).toFixed(2)}</Text>
                                                </GridItem>
                                                {props.values.listItem.length > 1 ?
                                                <GridItem>
                                                    <Button type="button" variant='ghost' onClick={() => remove(i)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{width: '20px', height: '20px'}}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                        </svg>
                                                    </Button>
                                                </GridItem>
                                                : null}
                                            </Grid>
                                        ))}
                                        <Box mt={6}>
                                            <Button color='gray' width='100%' onClick={() => push({name: '', quantity: '', price: '', total: ''})}>+ Add New Item</Button>
                                        </Box>
                                    </div>
                                )}
                            </FieldArray>

                            <ButtonGroup mt='6' display='flex' justifyContent='end'>
                                <Button colorScheme='gray' variant='outline' mr={3} onClick={onClose}>
                                    Discard
                                </Button>
                                <Button colorScheme='green' type='submit'>Create</Button>
                            </ButtonGroup>
                        </Form>
                    )}
                </Formik>
            </ModalBody>
  
            <ModalFooter>
              
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }
  
  export default CreateModal;