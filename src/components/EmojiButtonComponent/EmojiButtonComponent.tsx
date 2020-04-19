import React from "react";
import { AbstractComponent } from "../../util/AbstractComponent";
import './EmojiButtonComponent.scss';

export interface EmojiButtonComponentProps {
    emoji: string;
    clickFun: () => Promise<void>;
    ariaLabel?: string;
}

export class EmojiButtonComponent extends AbstractComponent<EmojiButtonComponentProps>{
    name = 'EmojiButtonComponent';
    loadData = undefined;

    renderComponent() {
        return (
            <span
                role="img"
                aria-label={this.props.ariaLabel ?? 'Button'}
                onMouseUp={() => {
                    this.props.clickFun();
                }}
            >{this.props.emoji}</span>
        );
    }
}
