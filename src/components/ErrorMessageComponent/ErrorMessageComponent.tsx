import React from "react";
import { AbstractComponent } from "../../util/AbstractComponent";
import './ErrorMessageComponent.scss';
import { singleOrEmpty, isNullOrEmpty } from "../../util/Util";

export class ErrorMessageComponent extends AbstractComponent<{ message?: string }> {
    name = 'ErrorMessageComponent';

    loadData = undefined;

    renderComponent() {
        return [
            <p>Hovsa. Der er sket en fejl.</p>,
            ...singleOrEmpty(isNullOrEmpty(this.props.message), () => (<p>{this.props.message}</p>))
        ]
    }
}
