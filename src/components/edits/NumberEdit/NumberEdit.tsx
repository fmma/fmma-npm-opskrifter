import React from "react";
import { AbstractEdit } from "../AbstractEdit/AbstractEdit";
import './NumberEdit.scss';

export interface NumberEditProps {
    unit?: string
}

export class NumberEdit<Tkey extends string> extends AbstractEdit<Tkey, number, NumberEditProps> {
    name = 'NumberEdit';

    renderPuretext() {
        return (
            <p>{this.value}</p>
        );
    }

    renderEdit() {
        return this.props.unit
            ? (<div className='unitContainer'>
                <input
                    type="number"
                    placeholder={this.props.placeholder}
                    value={this.value ?? 0}
                    onChange={this.handleChange.bind(this)} />
                <p className='unit'>{this.props.unit}</p>
            </div>
            )
            : (
                <input
                    type="number"
                    placeholder={this.props.placeholder}
                    value={this.value}
                    onChange={this.handleChange.bind(this)} />
            );
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setValue(+event.target.value ?? 0);
        this.forceUpdate();
    }
}
