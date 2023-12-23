import { Editor } from '@tinymce/tinymce-react';
import imageCompression from 'browser-image-compression';
import React from "react";
import { Media } from '../../../util/DependencyInjection';
import { AbstractEdit } from "../AbstractEdit/AbstractEdit";
import './RichTextEdit.scss';

export interface BlobInfo {
    id: () => string;
    name: () => string;
    filename: () => string;
    blob: () => File;
    base64: () => string;
    blobUri: () => string;
    uri: () => string;
}

export class RichTextEdit<Tkey extends string> extends AbstractEdit<Tkey, string> {


    name = 'RichTextEdit';

    renderEdit() {
        return (
            <Editor
                initialValue={this.value}
                init={{
                    image_dimensions: false,
                    image_class_list: [
                        { title: 'Responsive', value: 'img-responsive' }
                    ],
                    height: 500,
                    menubar: false,
                    plugins: [
                        'advlist autolink lists link image emoticons charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount super-easy-media-plugin'
                    ],
                    toolbar:
                        'image emoticons | undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | help',
                    images_upload_url: 'postAcceptor.php',
                    automatic_uploads: true,
                    images_upload_handler: (blobInfo: BlobInfo, success: any, failure: any) => {
                        this.handleImageUpload(blobInfo)
                            .then(x => success(x))
                            .catch(x => failure(x));
                    },
                    setup: (editor:any) => {
                        console.log(editor);
                    }
                }}
                onEditorChange={this.handleEditorChange}
            />
        );
    }

    handleEditorChange = (content: string, editor: Editor) => {
        this.setValue(content);
    }

    renderPuretext() {
        return (
            <div
                className='Puretext'
                dangerouslySetInnerHTML={{ __html: this.value }}>
            </div>
        );
    }

    async handleImageUpload(blobInfo: BlobInfo) {

        const imageFile = blobInfo.blob();
        console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
        console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

        var options = {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1920,
            useWebWorker: false
        }
        const compressedFile = await imageCompression(imageFile, options);
        console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
        console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

        const x = await Media.putMedia(blobInfo.filename(), compressedFile)
        return x;
    }
}
