import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

export const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
    },
    zipCode: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
    },
    createdAt: {
        type: DataTypes.DATE(3)
    },
    updatedAt: {
        type: DataTypes.DATE(3)
    }
}, {
    defaultScope: {
        order: [['createdAt', 'ASC']]
    }
});
