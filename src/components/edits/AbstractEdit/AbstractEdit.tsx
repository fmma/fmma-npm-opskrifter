import React from 'react';
import { AbstractComponent } from "../../../util/AbstractComponent";
import './AbstractEdit.scss';

export interface AbstractEditProps<Tkey extends string, Tval> {
    field: Tkey;
    entity: Record<Tkey, Tval>;
    editable: boolean;
    label: string;
    getFocus?: boolean;
    placeholder?: string;
    valueChanged?: () => void;
}

export abstract class AbstractEdit<Tkey extends string, Tval, Tprops = {}> extends AbstractComponent<Tprops & AbstractEditProps<Tkey, Tval>> {

    loadData = undefined;

    componentDidMount() {
        if (this.props.getFocus)
            this.div.current?.querySelector("input")?.focus();
    }

    div = React.createRef<HTMLDivElement>();

    get value(): Tval {
        return this.props.entity[this.props.field];
    }

    setValue(val: Tval) {
        (this.props.entity as any)[this.props.field] = val;

        if (this.props.valueChanged)
            this.props.valueChanged();
    }

    abstract renderPuretext(): any;
    abstract renderEdit(): any;

    renderComponent() {
        if (this.props.label === '') {
            return (
                <div ref={this.div} className="AbstractEditComponent-label">
                    {this.autoKeys(this.props.editable ? this.renderEdit() : this.renderPuretext())}
                </div>
            );
        }
        return (
            <label className="AbstractEditComponent-label">
                {this.props.label}
                {this.autoKeys(this.props.editable ? this.renderEdit() : this.renderPuretext())}
            </label>
        );
    }
}
