import React from "react";
import { AbstractComponent } from "../../util/AbstractComponent";

export interface ActionButtonComponentProps {
    clickFun: () => Promise<void>;
    text: string;
}

export class ActionButtonComponent extends AbstractComponent<ActionButtonComponentProps> {
    name = 'ActionButtonComponent';
    loadData = undefined;
    actionInProgress = false;

    renderComponent() {
        return (
            <button onMouseUp={
                async () => {
                    this.actionInProgress = true;
                    this.forceUpdate();
                    try {
                        await this.props.clickFun();
                    }
                    catch (err) {
                        this.actionInProgress = false;
                        this.throwError(err);
                        return;
                    }
                    this.actionInProgress = false;
                    this.forceUpdate();
                }
            }>{this.actionInProgress ? this.renderLoading() : this.renderNotLoading()}
            </button>
        )

    }

    renderLoading() {
        return (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        );
    }

    renderNotLoading() {
        return (
            <span>{this.props.text}</span>
        );
    }


}
