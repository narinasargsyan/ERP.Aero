import { FileEntity } from "../entities";
import { BaseRepository } from "./base.repository";

export class FileRepository extends BaseRepository<FileEntity> {
    count(): Promise<number> {
        return this.model.count({});
    }

    public async createFile(filename: string, size: number, mimetype: string): Promise<FileEntity> {
        return await this.model.create({
            name: filename,
            size,
            mimeType: mimetype,
        });
    }

    public async findAndCountFile(limit: number, offset: number): Promise<void> {
        return await this.model.findAndCountAll({ limit, offset });
    }

    public async deleteFile(id: number): Promise<FileEntity> {
        return await this.model.destroy({ where: { id } });
    }

    public async getFileById(id: number): Promise<FileEntity> {
        return await this.model.findOne({ where: { id } });
    }

    public async updateFile(id: number, name: string, extension: string, size: number, mimeType: string): Promise<FileEntity> {
        return await this.model.update(
            {
                name,
                extension,
                size,
                mimeType,
                uploadDate: new Date(),
            },
            { where: { id } }
        );
    }
}
