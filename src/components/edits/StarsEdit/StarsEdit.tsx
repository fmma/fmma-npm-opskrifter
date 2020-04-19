import React from "react";
import { iota } from "../../../util/Util";
import { AbstractEdit } from "../AbstractEdit/AbstractEdit";
import './StarsEdit.scss';

export class StarsEdit<Tkey extends string> extends AbstractEdit<Tkey, number> {
    name = 'StarsEdit';

    readonly starIcon = '🔶' // '★' // 🌣💀︎★🕱🏶🖒🗲

    private get stars(): number {
        return this.props.entity[this.props.field];
    }

    private setStars() {
        this.props.entity[this.props.field] = this.tempStars;
    }

    private tempStars = this.props.entity[this.props.field];

    private renderStar(i: number, empty: boolean) {
        return (<span
            key={i}
            onMouseEnter={
                () => {
                    this.tempStars = i + 1;
                    this.forceUpdate();
                }
            }
            onMouseLeave={
                () => {
                    this.tempStars = this.stars;
                    this.forceUpdate();
                }
            }
            onMouseDown={
                () => {
                    this.setStars();
                    this.forceUpdate();
                }
            }
            className={empty ? 'EmptyStar EditableStar' : 'EditableStar Star'}
        >{this.starIcon}</span>)
    }

    renderEdit() {
        return (
            <div> {[
                ...iota(this.tempStars).map(i => this.renderStar(i, false)),
                ...iota(4 - this.tempStars).map(i => this.renderStar(i + this.tempStars, true))
            ]} </div>
        );
    }

    private renderStarPureText(i: number) {
        return (<span key={i} className={'Star'}>{this.starIcon}</span>)
    }

    renderPuretext() {
        return iota(this.tempStars).map(i => this.renderStarPureText(i))
    }
}
