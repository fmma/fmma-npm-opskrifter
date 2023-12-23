import * as firebase from 'firebase/app';
import { AbstractMedia } from "./AbstractMedia";

export class FirebaseMedia extends AbstractMedia {
    async putMedia(id: string, mediaObject: Blob | File): Promise<string> {
        const service = firebase.storage();
        const ref = service.ref();
        const task = ref.child('images/' + id).put(mediaObject);
        return new Promise( (resolve, reject) => {
            task.on('state_changed',
            snapshot => {
              var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              console.log('Upload is ' + progress + '% done')
            },
            err => reject(err),
            async () => resolve(await task.snapshot.ref.getDownloadURL())
          )
        });
    }
}
