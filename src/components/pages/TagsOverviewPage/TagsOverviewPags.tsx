import { Guid } from 'guid-typescript';
import React from 'react';
import { TagStats } from '../../../models/TagStats';
import { AbstractComponent } from '../../../util/AbstractComponent';
import { Database } from '../../../util/DatabaseInjection';
import { ActionButtonComponent } from '../../ActionButtonComponent/ActionButtonComponent';
import { ColorEdit } from '../../edits/ColorEdit/ColorEdit';
import { TextEdit } from '../../edits/TextEdit/TextEdit';
import { EmojiButtonComponent } from '../../EmojiButtonComponent/EmojiButtonComponent';

interface EditableTag extends TagStats {
    dirty: boolean;
    deleted: boolean;
}

export class TagsOverviewPage extends AbstractComponent<{}> {
    name = 'TagsOverviewPage';

    tags: EditableTag[] = [];

    loadData = async () => {
        const result = await Database.getTagsStats();
        this.tags = result.map(t => ({ ...t, dirty: false, deleted: false }));
    }

    async save() {
        await Promise.all(this.tags.filter(t => t.deleted)?.map(t => Database.removeTag(t.tag)) ?? []);
        await Promise.all(this.tags.filter(t => !t.deleted && t.dirty)?.map(t => Database.putTag(t)) ?? []);
    }

    newTag() {
        if (this.tags.find(t => t.tag === ''))
            return;
        this.tags.unshift({
            id: Guid.create().toString(),
            tag: '',
            occurrences: 0,
            color: '',
            dirty: true,
            deleted: false
        });
        this.forceUpdate();
    }

    renderTagLine(tag: EditableTag) {
        return (
            <div className='row' key={tag.tag}>
                <div className='col-4'><TextEdit
                    placeholder={'navn'}
                    getFocus={tag.tag === ''}
                    entity={tag}
                    field={'tag'}
                    editable={true}
                    label={''}
                    valueChanged={() => {
                        tag.dirty = true;
                    }}
                ></TextEdit></div>
                <div className='col-4'><ColorEdit
                    entity={tag}
                    field={'color'}
                    editable={true}
                    label={''}
                    valueChanged={() => {
                        tag.dirty = true;
                    }}
                ></ColorEdit></div>
                <div className='col-2'>{tag.occurrences}</div>
                <div className='col-2'>
                    <EmojiButtonComponent
                        clickFun={
                            async () => {
                                tag.deleted = true;
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
                    <button onClick={this.newTag.bind(this)}>Tilføj</button>
                </div>
                <div className="col-6">
                    <ActionButtonComponent clickFun={this.save.bind(this)} text='Gem'></ActionButtonComponent>
                </div>
            </div>,
            <div className='row'>
                <div className='col-4'>Tag:</div>
                <div className='col-4'>Farve:</div>
                <div className='col-2'>Antal:</div>
                <div className='col-2'>Slet:</div>
            </div>,
            ...this.tags.filter(t => !t.deleted).map(tag => this.renderTagLine(tag))
        ];
    }
}
