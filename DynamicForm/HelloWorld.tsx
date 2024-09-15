import * as React from "react";
import { Label } from "@fluentui/react";
import DynamicForm from "./DynamicForm";
import "./App.css";
export interface IHelloWorldProps {
  name?: any;
  onFormSubmit: (formValues: any) => void;
}
const jsonData = {
  title: "Transaction Form",
  fields: [
    { type: "text", label: "Transaction ID", name: "transactionId", value: "TX12345" ,required:true },
    { type: "text", label: "Customer Ref NO", name: "customerRefNo", value: "REF56789" ,required:true },
    { type: "number", label: "Amount", name: "amount", value: 100 },
    { type: "date", label: "Transaction Date", name: "transactionDate", value: "2024-09-05",required:true  },
    { type: "time", label: "Transaction Time", name: "timeDate", value: "10:30",required:true  },
    {
      type: "checkbox-group",
      label: "Transaction Type",
      name: "transactionType",
      options: ["Credit", "Debit"],
      value: ["Credit"],
      required:true 
    },
    {
      type: "dropdown",
      label: "Shop Location",
      name: "shopLocation",
      options: ["Location 1", "Location 2", "Location 3"],
      value: "Location 2", 
      required:true,
      apiUrl:"https://testapi.io/api/aabuabdo/testApiPcf"
    },
    {
      type: "radio-group",
      label: "Payment Method",
      name: "paymentMethod",
      options: ["Credit Card", "Cash", "Bank Transfer"],
      value: "Credit Card",
      required:true 
    },
    {
      type: "instruction",
      data: ["transactionDate", "Credit Card"],
    },
    {
      type: "table",
      label: "Transaction Details",
      name: "transactionDetails",
      columns: ["Date", "Amount", "Type"],
      data: [
        { Date: "2024-09-01", Amount: 100, Type: "Credit" },
        { Date: "2024-09-02", Amount: 50, Type: "Debit" },
        { Date: "2024-09-03", Amount: 200, Type: "Credit" },
      ],
    },
  ],
};
export class HelloWorld extends React.Component<IHelloWorldProps> {
  private safeParseJSON(jsonString: string): any {
      try {
          return JSON.parse(jsonString);
      } catch (e) {
          console.log("Invalid JSON:", e);
          return {};
      }
  }

  public handleFormSubmit = (formValues: any) => {
      this.props.onFormSubmit(formValues);
  };

  public render(): React.ReactNode {
      const data = this.safeParseJSON(this.props.name);

      return (
          <div className="container">
              <DynamicForm data={data} onFormSubmit={this.handleFormSubmit} />
          </div>
      );
  }
}


// {
//   "title": "Transaction Form",
//   "fields": [
//     {
//       "type": "text",
//       "label": "Transaction ID",
//       "name": "transactionId",
//       "value": "TX12345",
//       "required": true
//     },
//     {
//       "type": "text",
//       "label": "Customer Ref NO",
//       "name": "customerRefNo",
//       "value": "REF56789",
//       "required": true
//     },
//     {
//       "type": "number",
//       "label": "Amount",
//       "name": "amount",
//       "value": 100
//     },
//     {
//       "type": "date",
//       "label": "Transaction Date",
//       "name": "transactionDate",
//       "value": "2024-09-05",
//       "required": true
//     },
//     {
//       "type": "time",
//       "label": "Transaction Time",
//       "name": "timeDate",
//       "value": "10:30",
//       "required": true
//     },
//     {
//       "type": "checkbox-group",
//       "label": "Transaction Type",
//       "name": "transactionType",
//       "options": ["Credit", "Debit"],
//       "value": ["Credit"],
//       "required": true
//     },
//     {
//       "type": "dropdown",
//       "label": "Shop Location",
//       "name": "shopLocation",
//       "options": ["Location 1", "Location 2", "Location 3"],
//       "value": "",
//       "required": true,
//       "apiUrl": "https://testapi.io/api/aabuabdo/testApiPcf"
//     },
//     {
//       "type": "radio-group",
//       "label": "Payment Method",
//       "name": "paymentMethod",
//       "options": ["Credit Card", "Cash", "Bank Transfer"],
//       "value": "Credit Card",
//       "required": false
//     },
//     {
//       "type": "instruction",
//       "data": ["transactionDate", "Credit Card"]
//     },
//     {
//       "type": "table",
//       "label": "Transaction Details",
//       "name": "transactionDetails",
//       "columns": ["Date", "Amount", "Type"],
//       "data": [
//         {
//           "Date": "2024-09-01",
//           "Amount": 100,
//           "Type": "Credit"
//         },
//         {
//           "Date": "2024-09-02",
//           "Amount": 50,
//           "Type": "Debit"
//         },
//         {
//           "Date": "2024-09-03",
//           "Amount": 200,
//           "Type": "Credit"
//         }
//       ]
//     }
//   ]
// }
