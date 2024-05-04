import { Button, Grid, GridItem, Input, Text } from "@chakra-ui/react";
import { useState } from "react";


function ItemRow({field, itemKey, removeItemRow}){
    const [item, setItem] = useState({
      name: '',
      qty: '',
      price: '',
      total: ''
    })
    
    // updates name property
    function updateName(e){
      setItem({...item, name: e.target.value})
    }
    
    // updates qty property and total, if price isn't empty
    function updateQty(e){
      if(e.target.value === ''){
        setItem({...item, qty: '', total: ''})
      } else{
        if(item.price !== ''){
          setItem({...item, qty: e.target.value, total: parseInt(e.target.value)* parseFloat(item.price)})
        } else{
          setItem({...item, qty: e.target.value})
        }
      }
    }
    
    // updates price property and total, if qty isn't empty
    function updatePrice(e){
      if(e.target.value === ''){
        setItem({...item, price: '', total: ''})
      } else{
        if(item.qty !== ''){
          setItem({...item, price: e.target.value, total: parseInt(item.qty)* parseFloat(e.target.value)})
        } else{
          setItem({...item, qty: e.target.value})
        }
      }
    }
  
    return(
      <Grid templateColumns='repeat(6, 1fr)' gap={4} my='4'>
        <GridItem colSpan={2}>
            <Input {...field} id='name' type='text' value={item.name} onChange={(e) => updateName(e)}/>
        </GridItem>
        <GridItem>
            <Input {...field} id='price' type='number' value={item.qty} onChange={(e) => updateQty(e)}/>
        </GridItem>
        <GridItem>
            <Input {...field} id='quantity' type='number' value={item.price} onChange={(e) => updatePrice(e)}/>
        </GridItem>
        <GridItem>
            <Text {...field} id="total" my={2}>{item.total}</Text>
        </GridItem>
        <GridItem>
            <Button onClick={() => removeItemRow(itemKey)} variant='ghost'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{width: '20px', height: '20px'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            </Button>
        </GridItem>
      </Grid>
    )
}

export default ItemRow;
