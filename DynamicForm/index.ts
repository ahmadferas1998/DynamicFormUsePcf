import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { HelloWorld, IHelloWorldProps } from "./HelloWorld";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './App.css'
import * as React from "react";

export class DynamicForm implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;
    private _name: any;
    private formValues: any;

    constructor() { }

    public handleFormSubmit = (formValues: any) => {
        console.log('Form values from index:', formValues);
        this.formValues = formValues;
        this.notifyOutputChanged(); 
    };
    

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this._name = context.parameters.sampleProperty.raw || {};
    }

 
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const props: IHelloWorldProps = { 
            name: context.parameters.sampleProperty.raw, 
            onFormSubmit: this.handleFormSubmit 
        };
        this._name = context.parameters.sampleProperty.raw;
        return React.createElement(
            HelloWorld, 
            props
        );
    }
    

    public getOutputs(): IOutputs {
        return {
            output:  JSON.stringify(this.formValues)
        };
    }
    

    public destroy(): void {

    }
}
