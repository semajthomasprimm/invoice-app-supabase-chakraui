import { createContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export const InvoiceContext = createContext();

export const InvoiceProvider = ({ children }) => {
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState();

    const fetchInvoices = async() => {
        const { data, error } = await supabase.from("invoices").select(`
            id,
            created_at,
            payment_terms,
            project_description,
            status,
            payment_due,
            total,
            billTo ( * ),
            billFrom ( * ),
            listItem ( * )
        `).order('id', {ascending: true})

        if(data) setInvoices(data);

        if (error) {
          console.error(error);
          return {error: 'Failed to create invoice.'}
      }

    }

    const createInvoice = async(invoice) => {

        const billFrom = invoice.billFrom[0];
        const billTo = invoice.billTo[0];
        const listItem = invoice.listItem;
        const invoiceData = {
            created_at: invoice.created_at,
            payment_due: invoice.payment_due, 
            payment_terms: invoice.payment_terms, 
            project_description: invoice.project_description, 
            status: invoice.status, 
            total: invoice.total
        }


        let { data, error } = await supabase
        .rpc('create_new_invoice', {
            invoice_data: invoiceData, 
            billto_data: billTo, 
            billfrom_data: billFrom, 
            listitem_data: listItem
        })

        if (error) {
            console.error(error);
            return {error: 'Failed to create invoice.'}
        }
        else {
            fetchInvoices();
            return {success: 'Invoice successfully created.'}
        }

    }

    const updateInvoice = async(invoice) => {
      const billFrom = invoice.billFrom[0];
      const billTo = invoice.billTo[0];
      const listItem = invoice.listItem;
      const invoiceData = {
        created_at: invoice.created_at,
        payment_due: invoice.payment_due, 
        payment_terms: invoice.payment_terms, 
        project_description: invoice.project_description, 
        status: invoice.status, 
        total: invoice.total
      }
  
      let { data, error } = await supabase
        .rpc('update_invoice', {
          invoice_id_data: invoice.id,
          invoice_data: invoiceData, 
          billto_data: billTo, 
          billfrom_data: billFrom, 
          listitem_data: listItem
        })
  
      if (error) {
        console.error(error);
        return {error: 'Failed to update invoice.'};
      } else {
        fetchInvoices();
        return {success: 'Invoice updated.'};
      }
    }

    const deleteInvoice = async(invoice) => {
      let { data, error } = await supabase.rpc('delete_invoice', {invoice_id_data: invoice.id});

      if (error) {
        console.error(error);
        return {error: 'Failed to delete invoice.'};
      } else {
        fetchInvoices();
        return {success: 'Invoice deleted.'};
      }
    }

    useEffect(() => {
        fetchInvoices();
    }, []);

    return ( 
        <InvoiceContext.Provider 
            value={{
                invoices,
                setInvoices,
                selectedInvoice,
                setSelectedInvoice,
                createInvoice,
                updateInvoice,
                deleteInvoice
            }}
        >
            {children}
        </InvoiceContext.Provider>
    );
}
