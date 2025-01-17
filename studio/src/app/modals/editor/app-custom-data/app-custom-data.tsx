import {Component, Element, Listen, State, h} from '@stencil/core';

import {get, set} from 'idb-keyval';

import {IonControllerUtils} from '../../../utils/core/ion-controller-utils';

import {StorageService} from '../../../services/storage/storage.service';

@Component({
    tag: 'app-custom-data',
    styleUrl: 'app-custom-data.scss'
})
export class AppCustomData {

    @Element() el: HTMLElement;

    private storageService: StorageService;

    @State()
    private files: StorageFile[];

    @State()
    private disableInfiniteScroll = false;

    private paginationNext: string | null;

    @State()
    private uploading: boolean = false;

    constructor() {
        this.storageService = StorageService.getInstance();
    }

    async componentDidLoad() {
        history.pushState({modal: true}, null);

        await this.search();
    }

    @Listen('popstate', { target: 'window' })
    async handleHardwareBackButton(_e: PopStateEvent) {
        await this.closeModal();
    }

    async closeModal() {
        await (this.el.closest('ion-modal') as HTMLIonModalElement).dismiss();
    }

    private selectData(storageFile: StorageFile): Promise<void> {
        return new Promise<void>(async (resolve) => {
            if (!storageFile) {
                resolve();
                return;
            }

            if (this.uploading) {
                resolve();
                return;
            }

            await this.selectAndClose(storageFile);

            resolve();
        });
    }

    private selectAndClose(data: StorageFile): Promise<void> {
        return new Promise<void>(async (resolve) => {
            await (this.el.closest('ion-modal') as HTMLIonModalElement).dismiss(data);

            resolve();
        });
    }

    private search(): Promise<void> {
        return new Promise<void>(async (resolve) => {
            const list: StorageFilesList = await this.storageService.getFiles(this.paginationNext, 'data');

            if (!list) {
                resolve();
                return;
            }

            if (!list.items || list.items.length <= 0) {
                this.emptyFiles();

                resolve();
                return;
            }

            if (!this.files) {
                this.files = [];
            }
            
            this.files = [...this.files, ...list.items];

            this.paginationNext = list.nextPageToken;

            this.disableInfiniteScroll = list.items.length < this.storageService.maxQueryResults;

            resolve();
        });
    }

    private emptyFiles() {
        this.files = [];

        this.disableInfiniteScroll = true;
    }

    private searchNext(e: CustomEvent<void>): Promise<void> {
        return new Promise<void>(async (resolve) => {
            await this.search();

            (e.target as HTMLIonInfiniteScrollElement).complete();

            resolve();
        });
    }

    async uploadNewData() {
        const infoDisplayedOnce: boolean = await get<boolean>('deckdeckgo_display_custom_data');

        if (!infoDisplayedOnce) {
            await this.openCustomDataPublicInfo();
        } else {
            await this.openFilePicker();
        }
    }

    private openFilePicker(): Promise<void> {
        return new Promise<void>((resolve) => {
            const filePicker: HTMLInputElement = this.el.querySelector('input');

            if (!filePicker) {
                resolve();
                return;
            }

            filePicker.click();

            resolve();
        });
    }

    private upload(): Promise<void> {
        return new Promise<void>(async (resolve) => {
            const filePicker: HTMLInputElement = this.el.querySelector('input');

            if (!filePicker) {
                this.uploading = false;
                resolve();
                return;
            }

            if (filePicker.files && filePicker.files.length > 0) {
                this.uploading = true;

                const storageFile: StorageFile = await this.storageService.uploadFile(filePicker.files[0], 'data', 10485760);

                if (storageFile) {
                    await this.selectAndClose(storageFile);
                }

                this.uploading = false;
            }

            resolve();
        });
    }

    private async openCustomDataPublicInfo() {
        const alert: HTMLIonAlertElement = await IonControllerUtils.createAlert({
            header: 'About your data',
            message: 'Please note that currently, all the data you would upload, will be publicly visible on the internet.',
            cssClass: 'custom-info',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        this.uploading = false;
                    }
                }, {
                    text: 'Ok',
                    handler: async () => {
                        await set('deckdeckgo_display_custom_data', true);

                        await this.openFilePicker();
                    }
                }
            ]
        });

        return await alert.present();
    }

    render() {
        return [
            <ion-header>
                <ion-toolbar color="tertiary">
                    <ion-buttons slot="start">
                        <ion-button onClick={() => this.closeModal()}>
                            <ion-icon name="close"></ion-icon>
                        </ion-button>
                    </ion-buttons>
                    <ion-title class="ion-text-uppercase">Your data</ion-title>
                </ion-toolbar>
            </ion-header>,
            <ion-content class="ion-padding">
                {this.renderData()}

                <input type="file" accept=".csv" onChange={() => this.upload()}/>

                <ion-infinite-scroll threshold="100px" disabled={this.disableInfiniteScroll}
                                     onIonInfinite={(e: CustomEvent<void>) => this.searchNext(e)}>
                    <ion-infinite-scroll-content
                        loadingText="Loading more images...">
                    </ion-infinite-scroll-content>
                </ion-infinite-scroll>
            </ion-content>,
            <ion-footer>
                <ion-toolbar>
                    <div class={this.uploading ? 'uploading' : undefined}>
                        {this.renderToolbarAction()}
                    </div>
                </ion-toolbar>
            </ion-footer>
        ];
    }

    private renderData() {
        if (!this.files || this.files.length <= 0) {
            return this.renderPlaceHolder();
        } else {
            return <div class="data-container">
                {this.renderFiles()}
            </div>;
        }
    }

    private renderFiles() {
        return (
            this.files.map((storageFile: StorageFile) => {
                return this.renderFile(storageFile);
            })
        );
    }

    private renderFile(storageFile: StorageFile) {
        return <div class="ion-padding data" custom-tappable onClick={() => this.selectData(storageFile)}>
            <ion-icon src="/assets/icons/file.svg"></ion-icon>
            <ion-label>{storageFile.name}</ion-label>
        </div>
    }

    private renderPlaceHolder() {
        return <div class="placeholder">
            <div>
                <ion-icon src="/assets/icons/file.svg"></ion-icon>
                <ion-label class="ion-text-center">Your collection of data is empty</ion-label>
            </div>
        </div>
    }

    private renderToolbarAction() {
        if (!this.uploading) {
            return <ion-button onClick={() => this.uploadNewData()} shape="round" color="tertiary">
                <ion-icon name="cloud-upload" slot="start"></ion-icon>
                <ion-label>Upload a new data</ion-label>
            </ion-button>
        } else {
            return [
                <ion-spinner color="tertiary"></ion-spinner>,
                <ion-label class="ion-padding-start">Upload in progress</ion-label>
            ];
        }
    }

}
