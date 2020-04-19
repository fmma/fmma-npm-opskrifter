import React from "react";
import { Ingrediens } from "../../../models/Ingrediens";
import { Ingredient } from "../../../models/Opskrift";
import { AbstractEdit } from "../AbstractEdit/AbstractEdit";
import { AutoCompleteEdit } from "../AutoCompleteEdit/AutoCompleteEdit";
import { NumberEdit } from "../NumberEdit/NumberEdit";
import { TextEdit } from "../TextEdit/TextEdit";
import './IngredientsEdit.scss';
import { EmojiButtonComponent } from "../../EmojiButtonComponent/EmojiButtonComponent";

export interface IngredientsEditProps {
    ingreidenser: Ingrediens[];
}

interface Lookup {
    ingrediens: Ingredient,
    type?: Ingrediens
}

export class IngredientsEdit<Tkey extends string> extends AbstractEdit<Tkey, Ingredient[], IngredientsEditProps> {
    name = 'IngredientsEdit';

    get lookedUpIngredienser(): Lookup[] {
        return this.value
            .map(i => {
                const result = this.props.ingreidenser.find(i2 => i2.id === i.ingrediensId);
                return {
                    ingrediens: i,
                    type: result
                };
            })
    }

    renderIngredientPuretext(i: Lookup): any {
        return (
            <li key={i.ingrediens.ingrediensId}>
                {i.ingrediens.amount > 0 ? String(i.ingrediens.amount) : ''} {i.ingrediens.unit} {i.type?.name ?? i.ingrediens.ingrediensId}
            </li>
        );

    }

    renderIngredient(i: Lookup): any {
        return (
            <li>
                <div className="row">
                    <div className="col-3">
                        <NumberEdit
                            getFocus={this.addIngredientId === i.ingrediens.ingrediensId}
                            label=''
                            entity={i.ingrediens}
                            field='amount'
                            editable={true}
                        ></NumberEdit>
                    </div>
                    <div className="col-3">
                        <TextEdit
                            label=''
                            entity={i.ingrediens}
                            field='unit'
                            editable={true}
                        ></TextEdit>
                    </div>
                    <div className="col-4">
                        {i.type?.name ?? i.ingrediens.ingrediensId}
                    </div>
                    <div className='col-2'>
                        <EmojiButtonComponent
                            emoji='🗑️'
                            clickFun={async () => {
                                this.value.splice(this.value.indexOf(i.ingrediens), 1);
                                this.forceUpdate();
                            }}
                            ariaLabel='Trash'>
                        </EmojiButtonComponent>
                    </div>
                </div>
            </li>
        );
    }

    renderPuretext() {
        return (
            <ul>
                {this.autoKeys(this.lookedUpIngredienser.map(i => this.renderIngredientPuretext(i)))}
            </ul>
        );
    }

    get colors(): Map<string, string> {
        const map = new Map(this.props.ingreidenser.map(x => [x.id, x.color]));
        map.set('', '#FFFFFF');
        return map;
    }

    get autoCompleteOptions(): Map<string, string> {
        const map = this.props.ingreidenser;
        return new Map(map.map(x => [x.id, x.name]));
    }

    addIngredientId = '';

    renderEdit() {
        return [
            <ul>
                {this.autoKeys(this.lookedUpIngredienser.map(i => this.renderIngredient(i)))}
            </ul>,
            <AutoCompleteEdit<'addIngredientId', string>
                fromString={x => x}
                placeholder={'Tilføj ingrediens'}
                editable={true}
                entity={this}
                field='addIngredientId'
                label=''
                options={this.autoCompleteOptions}
                colors={this.colors}
                buttonStyle={true}
                valueChanged={() => {
                    const i = this.props.ingreidenser.find(i => i.id === this.addIngredientId);
                    if (!this.addIngredientId || i == null)
                        return;
                    this.value.push({
                        ingrediensId: i.id,
                        amount: 0,
                        unit: i.preferredUnit
                    });
                    this.forceUpdate();
                }}>
            </AutoCompleteEdit>
        ];
    }
}
