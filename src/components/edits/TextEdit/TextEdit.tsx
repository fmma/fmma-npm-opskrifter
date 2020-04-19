import React from "react";
import { AbstractEdit } from "../AbstractEdit/AbstractEdit";

export class TextEdit<Tkey extends string> extends AbstractEdit<Tkey, string> {
    name = 'TextEdit';

    renderPuretext() {
        return (<div className={'TextInputComponent'}>
            <p>{this.props.entity[this.props.field] ?? ''}</p>
        </div>)
    }

    renderEdit() {
        return (<div className={'TextInputComponent'}>
            <input
                placeholder={this.props.placeholder}
                type="text"
                value={this.props.entity[this.props.field] ?? ''}
                onChange={this.handleChange.bind(this)} />
        </div>)
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setValue(event.target.value);
        this.forceUpdate();
    }
}
