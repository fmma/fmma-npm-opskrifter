import { Guid } from 'guid-typescript';
import React from 'react';
import { Ingrediens } from '../../../models/Ingrediens';
import { AbstractComponent } from '../../../util/AbstractComponent';
import { Database } from '../../../util/DatabaseInjection';
import { ActionButtonComponent } from '../../ActionButtonComponent/ActionButtonComponent';
import { ColorEdit } from '../../edits/ColorEdit/ColorEdit';
import { TextEdit } from '../../edits/TextEdit/TextEdit';
import { EmojiButtonComponent } from '../../EmojiButtonComponent/EmojiButtonComponent';

interface EditableIngredient extends Ingrediens {
    dirty: boolean;
    deleted: boolean;
}

export class IngredientsOverviewPage extends AbstractComponent<{}> {
    name = 'IngredientsOverviewPage';

    ingredients: EditableIngredient[] = [];

    loadData = async () => {
        const result = await Database.getIngredienser();
        this.ingredients = result.map(t => ({ ...t, dirty: false, deleted: false }));
    }

    async save() {
        await Promise.all(this.ingredients.filter(t => t.deleted)?.map(t => Database.removeIngrediens(t.name)) ?? []);
        await Promise.all(this.ingredients.filter(t => !t.deleted && t.dirty)?.map(t => Database.putIngrediens(t)) ?? []);
    }

    newTag() {
        this.ingredients.unshift({
            id: Guid.create().toString(),
            name: '',
            preferredUnit: '',
            color: '',
            dirty: true,
            deleted: false
        });
        this.forceUpdate();
    }

    renderTagLine(ingrediens: EditableIngredient) {
        return (
            <div className='row' key={ingrediens.name}>
                <div className='col-4'><TextEdit
                    placeholder={'Ingrediens'}
                    getFocus={ingrediens.name === ''}
                    entity={ingrediens}
                    field={'name'}
                    editable={true}
                    label={''}
                    valueChanged={() => {
                        ingrediens.dirty = true;
                    }}
                ></TextEdit></div>
                <div className='col-2'><ColorEdit
                    entity={ingrediens}
                    field={'color'}
                    editable={true}
                    label={''}
                    valueChanged={() => {
                        ingrediens.dirty = true;
                    }}
                ></ColorEdit></div>
                <div className='col-4'><TextEdit
                    entity={ingrediens}
                    field={'preferredUnit'}
                    editable={true}
                    label={''}
                    valueChanged={() => {
                        ingrediens.dirty = true;
                    }}
                ></TextEdit></div>
                <div className='col-2'>
                    <EmojiButtonComponent
                        clickFun={
                            async () => {
                                ingrediens.deleted = true;
                                this.forceUpdate();
                            }
                        }
                        emoji='🗑️'
                        ariaLabel='Trash'
                    ></EmojiButtonComponent>
                </div>
            </div>
        )
    }

    renderComponent() {
        return [
            <div className="row">
                <div className="col-6">
                    <button onClick={this.newTag.bind(this)}>Ny ingrediens</button>
                </div>
                <div className="col-6">
                    <ActionButtonComponent clickFun={this.save.bind(this)} text='Gem'></ActionButtonComponent>
                </div>
            </div>,
            <div className='row'>
                <div className='col-4'>Navn:</div>
                <div className='col-4'>Farve:</div>
                <div className='col-2'>Enhed:</div>
                <div className='col-2'>Slet:</div>
            </div>,
            this.ingredients.filter(t => !t.deleted).map(tag => this.renderTagLine(tag))
        ];
    }
}
