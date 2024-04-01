import fs from "fs";
import multer, { StorageEngine } from "multer";
import crypto from "crypto";
import { Error } from "sequelize";
import { ControllerResponse } from "../../types";
import { NextFunction, Request, Response } from "express";
import { FileRepository } from "../../repositories";
import { models } from "../../db";
import * as path from "path";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename?: string) => void;

const fileRepository = new FileRepository(models.File);

export class FilesController {
    protected uploadDir: string;
    protected storage: StorageEngine;
    public upload: multer.Multer;
    private fileRepository: FileRepository

    constructor(fileRepository: FileRepository) {
        this.fileRepository = fileRepository;
        this.uploadDir = "./uploads";
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir);
        }

        this.storage = multer.diskStorage({
            destination(req, file, callback: DestinationCallback) {
                callback(null, "./uploads");
            },
            filename(req, file, cb: FileNameCallback) {
                crypto.pseudoRandomBytes(4, (err, buffer) => {
                    if (!err) {
                        const newFileName = `${buffer.toString("hex")}-${file.originalname}`;
                        cb(null, newFileName);
                    }
                });
            },
        });

        this.upload = multer({
            storage: this.storage,
        });
    }

    public async uploadFile(req: Request, res: Response, next: NextFunction): ControllerResponse {
        try {
            const { filename, size, mimetype } = req.file;
            await this.fileRepository.createFile(filename, size, mimetype);

            res.status(200).send(req.file);
        } catch (error) {
            console.error(`Error in uploadFile: ${error.message}`);
            next(error);
        }
    };

    public async list(req: Request, res: Response, next: NextFunction): ControllerResponse {
        try {
            const { list_size = 10, page = "1" } = req.query;
            const limit = Number(list_size);
            const pageNumber = Number(page);
            const offset = (pageNumber - 1) * limit;

            const list = await this.fileRepository.findAndCountFile(limit, offset);

            res.status(200).send(list);
        } catch (error) {
            console.error(`Error in list: ${error.message}`);
            next(error);
        }
    };

    public async deleteFile(req: Request, res: Response, next: NextFunction): ControllerResponse {
        try {
            const { id } = req.params;

            const file = await this.fileRepository.getFileById(Number(id));

            if (!file) {
                res.status(404).send("File not Found");
                return;
            }

            const path = `${this.uploadDir}/${file.name}`;

            await this.fileRepository.deleteFile(Number(id));

            await fs.promises.unlink(path);
            res.sendStatus(200);
        } catch (error) {
            console.error(`Error in deleteFile: ${error.message}`);
            next(error);
        }
    };

    public async downloadFile(req: Request, res: Response, next: NextFunction): ControllerResponse {
        try {
            const { id } = req.params;

            const file = await this.fileRepository.getFileById(Number(id));

            if (!file) {
                res.status(404).send("File not Found");
                return;
            }
            const path = `${this.uploadDir}/${file.name}`;

            res.download(path);
            return;
        } catch (error) {
            console.error(`Error in downloadFile: ${error.message}`);
            next(error);
        }
    };

    public async getFileInfo(req: Request, res: Response, next: NextFunction): ControllerResponse {
        try {
            const { id } = req.params;

            const file = await this.fileRepository.getFileById(Number(id));

            if (!file) {
                res.status(404).send("File not Found");
                return;
            }
            res.send(file);
        }  catch (error) {
            console.error(`Error in getFileInfo: ${error.message}`);
            next(error);
        }
    };

    public async updateFile(req: Request, res: Response, next: NextFunction): ControllerResponse {
        try {
            const { id } = req.params;
            const oldFile = await this.fileRepository.getFileById(Number(id));
            if (!oldFile) res.status(404).send("File Not found");

            const oldFilePath = `${this.uploadDir}/${oldFile.name}`;
            const extension = path.extname(req.file.originalname);

            const newFile = await this.fileRepository.updateFile(
                Number(id),
                req.file.originalname,
                extension,
                req.file.size,
                req.file.mimetype
            );

            await fs.promises.unlink(oldFilePath);
            res.status(200).send({ ...req.file, newFile });
        } catch (e) {
            res.status(400).send("File upload Failed");
        }
    };
}

export const filesController = new FilesController(fileRepository);
