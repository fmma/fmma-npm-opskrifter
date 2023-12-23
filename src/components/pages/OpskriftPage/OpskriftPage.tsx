import { Guid } from 'guid-typescript';
import React from 'react';
import { Ingrediens } from '../../../models/Ingrediens';
import { Opskrift } from '../../../models/Opskrift';
import { Tag } from '../../../models/Tag';
import { AbstractRouteComponent } from '../../../util/AbstractRouteComponent';
import { Database } from '../../../util/DependencyInjection';
import { currentUser } from '../../../util/User';
import { ActionButtonComponent } from '../../ActionButtonComponent/ActionButtonComponent';
import { DropDownEdit } from '../../edits/DropDownEdit/DropDownEdit';
import { IngredientsEdit } from '../../edits/IngredientsEdit/IngredientsEdit';
import { RichTextEdit } from '../../edits/RichTextEdit/RichTextEdit';
import { StarsEdit } from '../../edits/StarsEdit/StarsEdit';
import { TagsEdit } from '../../edits/TagsEdit/TagsEdit';
import { TextAreaEdit } from '../../edits/TextAreaEdit/TextAreaEdit';
import { TextEdit } from '../../edits/TextEdit/TextEdit';
import './OpskriftPage.scss';
import { NumberEdit } from '../../edits/NumberEdit/NumberEdit';


export class OpskriftPage extends AbstractRouteComponent<{ id: string }> {
    name = 'OpskriftPage';

    constructor(props: any) {
        super(props);
        this.ingredientsRef = React.createRef();
    }

    opskrift?: Opskrift;
    editing = false;
    allTags: Tag[] = [];
    allIngredients: Ingrediens[] = [];

    initialState(): {} {
        this.loading = true;
        return {};
    }

    loadData = async () => {
        const id = this.routeProps().id;

        if (id == null)
            throw new Error('Søg efter en opskrift eller opret en ny.');

        this.allTags = Array.from(await Database.getTags());
        this.allIngredients = Array.from(await Database.getIngredienser());

        if (id === 'new') {
            this.opskrift = {
                title: '',
                tags: [],
                complexity: 1,
                duration: 60,
                durationActive: 60,
                abstract: '',
                persons: 2,
                personsLabel: undefined,
                ingredients: [],
                content: '',
                author: '',
                comments: [],
                id: '',
                lastModified: String(new Date().getTime())
            };
            this.editing = true;
            return;
        }

        const opskrift = await Database.getOpskriftAndRefreshImageTokens(id);


        if (opskrift)
            this.origPersons = opskrift.persons;
        else
            throw new Error('Kunne ikke finde opskrift');

        this.opskrift = opskrift;
        this.editing = false;
    }

    origPersons = 2;

    renderComponent() {
        if (this.opskrift == null) {
            return '';
        }

        if (!this.editing) {
            return this.renderPuretext(this.opskrift);
        }

        return this.renderEditing(this.opskrift);
    }

    readonly timeLookup = new Map([
        [15, '00:15'],
        [30, '00:30'],
        [45, '00:45'],
        [60, '01:00'],
        [60 + 15, '01:15'],
        [60 + 30, '01:30'],
        [60 + 45, '01:45'],
        [120, '02:00']
    ]);

    ingredientsRef: React.RefObject<IngredientsEdit<'ingredients'>>

    renderPuretext(opskrift: Opskrift) {
        return [
            <div className='row'>
                <div className='col-6'>
                </div>
                <div className='col-6'>
                    <button onClick={this.toggleEdit.bind(this)}>Rediger</button>
                </div>
            </div>,
            <h1>{opskrift.title}</h1>,
            <div className='row'>
                <div className='col-4'>
                    <StarsEdit
                        label={''}
                        editable={false}
                        field={'complexity'}
                        entity={opskrift}></StarsEdit>
                </div>
                <div className='col-4'>
                    <NumberEdit
                        field={'persons'}
                        entity={opskrift}
                        label=''
                        editable={true}
                        valueChanged={() => {
                            opskrift.ingredients.forEach(i => {
                                i.amount = Math.round(i.amount * 10 * opskrift.persons / this.origPersons) / 10;
                            });
                            this.origPersons = opskrift.persons;
                            this.ingredientsRef?.current?.forceUpdate();
                        }}
                        unit={opskrift.personsLabel ?? 'Personer'}
                    ></NumberEdit>
                </div>
                <div className='col-4'>
                    <span role='img' aria-label='Duration'>⏰</span>{this.timeLookup.get(opskrift.duration)} {opskrift.duration !== opskrift.durationActive ? '(' + this.timeLookup.get(opskrift.durationActive) + ')' : ''}
                </div>
            </div>,
            <div>
                <TagsEdit<'tags'>
                    label={''}
                    field={'tags'}
                    entity={opskrift}
                    editable={false}
                    suggestions={this.allTags}
                ></TagsEdit>
            </div>,
            <div>
                {opskrift.abstract}
            </div>,
            <div>
                <IngredientsEdit
                    ref={this.ingredientsRef}
                    editable={false}
                    label=''
                    entity={opskrift}
                    field='ingredients'
                    ingreidenser={this.allIngredients}
                ></IngredientsEdit>
            </div>,
            <div>
                <RichTextEdit
                    label=''
                    entity={opskrift}
                    field='content'
                    editable={false}
                ></RichTextEdit>
            </div>
        ];
    }

    renderEditing(opskrift: Opskrift) {
        return [
            <div className='row'>
                <div className='col-6'>
                    <ActionButtonComponent clickFun={this.save.bind(this)} text='Gem'></ActionButtonComponent>
                </div>
                <div className='col-6'>
                </div>
            </div>,
            <div>
                <TextEdit
                    placeholder={'Opskrift titel'}
                    label={'Titel'}
                    editable={true}
                    field={'title'}
                    entity={opskrift}></TextEdit>
            </div>,
            <div className='row'>
                <div className='col-4'>
                    <StarsEdit
                        label={'Kompleksitet'}
                        editable={true}
                        field={'complexity'}
                        entity={opskrift}></StarsEdit>
                </div>
                <div className='col-4'>
                    <NumberEdit
                        field={'persons'}
                        entity={opskrift}
                        label={'Antal'}
                        editable={true}>
                    </NumberEdit>
                    <DropDownEdit<'personsLabel', string | undefined>
                        field={'personsLabel'}
                        entity={opskrift}
                        label={''}
                        editable={true}
                        fromString={x => x}
                        options={new Map([
                            ['Personer', 'Personer'],
                            ['Bradepander', 'Bradepander'],
                        ])}
                    ></DropDownEdit>
                </div>
                <div className='col-4'>
                    <DropDownEdit
                        field={'duration'}
                        entity={opskrift}
                        label={'Varighed'}
                        editable={true}
                        fromString={x => +x}
                        options={this.timeLookup}
                    ></DropDownEdit>
                    <DropDownEdit
                        field={'durationActive'}
                        entity={opskrift}
                        label={'Aktiv varighed'}
                        editable={true}
                        fromString={x => +x}
                        options={this.timeLookup}
                    ></DropDownEdit>
                </div>
            </div>,
            <div>
                <TagsEdit<'tags'>
                    label={'Tags'}
                    field={'tags'}
                    entity={opskrift}
                    editable={true}
                    suggestions={this.allTags}
                ></TagsEdit>
            </div>,
            <div>
                <TextAreaEdit
                    placeholder={'Kort beskrivelse'}
                    editable={true}
                    label='Abstract'
                    entity={opskrift}
                    field='abstract'
                ></TextAreaEdit>
            </div>,
            <div>
                <IngredientsEdit
                    editable={true}
                    label='Ingredienser'
                    entity={opskrift}
                    field='ingredients'
                    ingreidenser={this.allIngredients}
                ></IngredientsEdit>
            </div>,
            <div>
                <RichTextEdit
                    label='Indhold'
                    entity={opskrift}
                    field='content'
                    editable={true}
                ></RichTextEdit>
            </div>
        ];
    }

    toggleEdit() {
        this.editing = !this.editing;
        this.forceUpdate();
    }

    async save() {
        const opskrift = this.opskrift;

        if (opskrift == null)
            return;

        let id = this.routeProps().id;
        if (id == null)
            return;

        if (id === 'new') {
            id = Guid.create().toString();
            opskrift.id = id;
        }
        const user = await currentUser();
        if (user == null) {
            this.throwError('Ikke logget ind');
            return;
        }

        opskrift.author = user.email;
        opskrift.lastModified = String(new Date().getTime());
        await Database.putOpskrift(opskrift);
        window.location.href = window.location.href.replace('new', id);
    }
}
