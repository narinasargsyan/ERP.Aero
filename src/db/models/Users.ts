import { DataTypes as Sequelize } from "sequelize";

const UsersModel = {
    id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
        validate: {
            isEmail: {
                msg: "Invalid email.",
            },
        },
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
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

const UsersOptions = {
    timestamps: true,
    schema: "public",
    freezeTableName: true,
};

export const getModel = (seq) => {
    return seq.define("Users", UsersModel, UsersOptions);
};

