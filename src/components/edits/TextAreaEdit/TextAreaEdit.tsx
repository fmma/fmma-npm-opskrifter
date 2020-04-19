import React from "react";
import { AbstractEdit } from "../AbstractEdit/AbstractEdit";

export class TextAreaEdit<Tkey extends string> extends AbstractEdit<Tkey, string> {
    name = 'TextAreaEdit';

    renderPuretext() {
        return (
            <p>{this.props.entity[this.props.field] ?? ''}</p>
        );
    }

    renderEdit() {
        return (
            <textarea
                placeholder={this.props.placeholder}
                value={this.props.entity[this.props.field] ?? ''}
                onChange={this.handleChange.bind(this)} />
        );
    }

    handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.props.entity[this.props.field] = event.target.value;
        this.forceUpdate();
    }
}
