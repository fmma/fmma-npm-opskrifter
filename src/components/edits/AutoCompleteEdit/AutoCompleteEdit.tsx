import React from "react";
import { AbstractEdit } from "../AbstractEdit/AbstractEdit";
import './AutoCompleteEdit.scss';
import { EmojiButtonComponent } from "../../EmojiButtonComponent/EmojiButtonComponent";

export interface AutoCompleteEditProps<TId> {
    options: Map<TId, string>,
    fromString: (value: string) => TId
    colors?: Map<TId, string>
    buttonStyle?: boolean;
}

export class AutoCompleteEdit<Tkey extends string, TId extends string | number> extends AbstractEdit<Tkey, TId, AutoCompleteEditProps<TId>> {
    name = 'AutoCompleteEdit';

    renderPuretext() {
        return (
            <div className={'AutoCompleteEdit'}>
                <p>{this.value}</p>
            </div>
        )
    }

    suggestions = this.props.options;
    show = false;
    inputElementValue = this.props.options.get(this.value) ?? '';

    renderButton() {
        return (
            <EmojiButtonComponent
                clickFun={
                    async () => {
                        this.show = true;
                        this.forceUpdate();
                    }
                }
                emoji='➕'
                ariaLabel='Add'
            ></EmojiButtonComponent>
        );
    }

    renderTextInput() {
        return (
            <input
                placeholder={this.props.placeholder}
                type="text"
                value={this.inputElementValue}
                onFocus={() => {
                    this.show = true;
                    this.forceUpdate();
                }}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const nameSearch = event.target.value;
                    this.inputElementValue = nameSearch;
                    this.suggestions = new Map(Array.from(this.props.options).filter(([k, v]) => v.toLowerCase().startsWith(nameSearch.toLowerCase())));
                    this.forceUpdate();
                }}
            ></input>
        );
    }

    renderEdit() {
        return (
            <div className={(this.show ? ' AutoCompleteFullScreen' : '')}>
                {this.show ? this.renderFocused() : this.renderUnfocused()}
            </div>
        )
    }

    renderUnfocused() {
        return this.props.buttonStyle
            ? this.renderButton()
            : this.renderTextInput();
    }

    renderFocused() {
        return this.autoKeys([
            <div className='row'>
                <div className='col-11'>
                    {this.renderTextInput()}
                </div>
                <div className='col-1'>
                    <EmojiButtonComponent
                        clickFun={
                            async () => {
                                this.show = false;
                                this.forceUpdate();
                            }
                        }
                        emoji='❌'
                        ariaLabel='Trash'
                    ></EmojiButtonComponent>
                </div>
            </div>
            ,
            ...Array.from(this.suggestions).map(([k, v]) => {
                return (
                    <button
                        key={k}
                        className='AutoCompleteButton'
                        onMouseUp={
                            () => {
                                this.show = false;
                                this.inputElementValue = v;
                                this.setValue(k);
                                this.forceUpdate();
                            }
                        }
                        style={{ backgroundColor: this.props.colors?.get(k) }}
                    >{v}</button>
                );
            })]);
    }
}
