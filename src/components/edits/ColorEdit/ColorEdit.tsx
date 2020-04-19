import React from 'react';
import { GithubPicker } from 'react-color';
import { AbstractEdit } from "../AbstractEdit/AbstractEdit";
import './ColorEdit.scss';
import { singleOrEmpty } from '../../../util/Util';

export class ColorEdit<Tkey extends string> extends AbstractEdit<Tkey, string> {
    name = 'ColorEdit';

    renderPuretext() {
        return (
            <button
                className="ColorBox"
                style={{ backgroundColor: this.value }}
                disabled={true}
            >Vælg farve</button>
        );
    }

    renderEdit() {
        return [
            <button
                onMouseUp={this.toggleShowPicker.bind(this)}
                className="ColorBox"
                style={{ backgroundColor: this.value }}>F</button>,
            ...singleOrEmpty(this.showPicker,  () => this.renderPicker())
        ];
    }

    toggleShowPicker() {
        this.showPicker = !this.showPicker;
        this.forceUpdate();
    }

    showPicker = false;

    renderPicker() {
        return (
            <div className="ColorPickerPopup">
                <GithubPicker
                    color={this.value}
                    onChangeComplete={x => {
                        this.showPicker = false;
                        this.setValue(x.hex);
                        this.forceUpdate();
                    }}
                />
            </div>
        );
    }
}
