export class FileEntity {
    public id?: number;
    public name?: string;
    public extension?: string;
    public mimeType?: string;
    public size?: number;
    public uploadDate?: Date;

    constructor(
        id?: number,
        name?: string,
        extension?: string,
        mimeType?: string,
        size?: number,
        uploadDate?: Date
    ) {
        this.id = id;
        this.name = name;
        this.extension = extension;
        this.mimeType = mimeType;
        this.size = size;
        this.uploadDate = uploadDate;
    }
}

