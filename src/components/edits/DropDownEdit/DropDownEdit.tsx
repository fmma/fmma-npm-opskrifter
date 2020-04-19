import React from "react";
import { AbstractEdit } from "../AbstractEdit/AbstractEdit";

export interface DropDownEditProps<TId> {
    options: Map<TId, string>,
    fromString: (value: string) => TId
}

export class DropDownEdit<Tkey extends string, TId extends string | number | undefined> extends AbstractEdit<Tkey, TId, DropDownEditProps<TId>> {
    name = 'DropDownEdit';

    renderPuretext() {
        return (<div className={'DropDownEdit'}>
            <p>{this.props.options.get(this.value) ?? ''}</p>
        </div>)
    }

    renderEdit() {
        return (
            <select
                placeholder={this.props.placeholder}
                onChange={this.handleChange.bind(this)}
                value={this.value}
            >
                {Array.from(this.props.options).map(([id, text]: [TId, string]) => {
                    return (<option key={id} value={id}>{text}</option>)
                })}
            </select>
        );
    }

    handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setValue(this.props.fromString(event.target.value));
        this.forceUpdate();
    }
}
