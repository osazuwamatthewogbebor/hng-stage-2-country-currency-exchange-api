import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";


const Country = sequelize.define("Countries", {
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    capital: {
        type: DataTypes.STRING,
        allowNull: true
    },
    region: {
        type: DataTypes.STRING,
        allowNull: true
    },
    population: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: { isNumeric: true }
    },
    currency_code: {
        type: DataTypes.STRING,
        allowNull: true
    },
    exchange_rate: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    estimated_gdp: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    flag_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    last_refreshed_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'countries',
    timestamps: false,
    indexes: [
        { fields: ['name'] },
        { fields: ['region'] },
        { fields: ['currency_code'] }
    ]
});


export default Country;