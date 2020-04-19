import React from 'react';
import { Tag } from '../../../models/Tag';
import { AbstractEdit } from '../AbstractEdit/AbstractEdit';
import { DropDownEdit } from '../DropDownEdit/DropDownEdit';
import './TagsEdit.scss';
import { EmojiButtonComponent } from '../../EmojiButtonComponent/EmojiButtonComponent';

export interface TagsEditProps {
    suggestions: Tag[];
}

export class TagsEdit<Tkey extends string> extends AbstractEdit<Tkey, string[], TagsEditProps> {
    name = 'TagsEdit';

    get lookedUpTags(): Tag[] {
        return this.value
            .map(i => {
                const result = this.props.suggestions.find(tag2 => tag2.id === i);
                if (result)
                    return result;

                return {
                    id: i,
                    tag: i,
                    color: ''
                };
            })
    }

    get suggestions(): Map<string, string> {
        const tags = this.value;
        const map = new Map(this.props.suggestions.filter(st => {
            return !tags.includes(st.tag);
        })
            .map(x => [x.id, x.tag]));
        map.set('', '');
        return map;
    }

    renderTagPuretext(tag: Tag) {
        return (<button
            disabled={true}
            key={tag.tag}
            className='Tag'
            style={{ backgroundColor: tag.color }}
        >{tag.tag}</button>)
    }

    renderTag(tag: Tag) {
        return (<button
            disabled={true}
            key={tag.tag}
            className='Tag'
            style={{ backgroundColor: tag.color }}
        >{tag.tag}<EmojiButtonComponent
            emoji='🗑️'
            clickFun={
                async () => {
                    this.removeTag(tag.id)
                    this.forceUpdate();
                }
            }
        ></EmojiButtonComponent></button>)
    }

    removeTag(id: string): void {
        const value = this.value;
        const i = value.indexOf(id);
        if (i < 0)
            return

        value.splice(i, 1);
    }

    renderPuretext() {
        return this.lookedUpTags.map(tag => this.renderTagPuretext(tag));
    }

    addTag = '';

    renderEdit() {
        return [
            ...this.lookedUpTags.map(tag => this.renderTag(tag)),
            <DropDownEdit
                placeholder={this.props.placeholder}
                editable={true}
                entity={this}
                field='addTag'
                label=''
                fromString={x => x}
                options={this.suggestions}
                valueChanged={() => {
                    const value = this.value;
                    if (!this.addTag || value.includes(this.addTag))
                        return;
                    this.value.push(this.addTag);
                    this.addTag = '';
                    this.forceUpdate();
                }}
            ></DropDownEdit>
        ];
    }
}
