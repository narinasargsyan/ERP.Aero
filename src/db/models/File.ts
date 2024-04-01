import { DataTypes as Sequelize } from "sequelize";

const FileModel = {
    id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    extension: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    mimeType: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    size: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    uploadDate: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
};

const FileOptions = {
    timestamps: true,
    schema: "public",
    freezeTableName: true,
};

export const getModel = (seq) => {
    return seq.define("File", FileModel, FileOptions);
};

