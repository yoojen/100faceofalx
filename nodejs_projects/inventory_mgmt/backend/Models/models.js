const { DataTypes, Model } = require('sequelize')
const sequelize = require('../Config/db.config')
const crypto = require('crypto');

class User extends Model {
    hashPassword(value) {
        const salt = crypto.randomBytes(32).toString('hex');
        const hashedVersion = crypto.pbkdf2Sync(value, salt, 10000, 64, 'sha512').toString('hex');
        this.setDataValue('password', hashedVersion);
    }
 };
class Product extends Model { }
class Supplier extends Model { }
class SpecialCustomer extends Model { }
class Category extends Model { }
class InventoryTransaction extends Model { }
class Stock extends Model { }

User.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        username: {
            type: DataTypes.STRING,
            unique: {
                msg: 'Username already registered'
            },
            allowNull: true,
            validate: {
                is: {
                    args: /^(?!.*\d).+$/,
                    msg: 'Username must not contain numbers and can contain underscores.'
                },
                isLowercase: true,
                len: {
                    args: [5, 10],
                    msg: 'Username must be between 5 and 10 characters long.'
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'Email is already registered'
            },
            validate: {
                isEmail: {
                    msg: 'Please provide valid email'
                },
                isEmpty: (value) => {
                    if (value.length == 0) throw new Error('Email is required field')
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
            validate: {
                isAlphanumeric: {
                    msg: 'Password must be alphanumeric'
                },
            },
            isTooBig(value) {
                if (value.length < 8 || value.length > 18) {
                    throw new Error('Password must be atleast 8 characters and not exceed 18')
                }
            },
            set(value) {
                this.hashPassword(value);
            }
        },
        firstName: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                isAlpha: {
                    msg: 'Name must not contain any number'
                }
            }
        },
        lastName: {
            type: DataTypes.STRING,
            validate: {
                isAlpha: {
                    msg: 'Name must not contain any number'
                }
            }
        },
    },
    {
        sequelize,
        tableName: 'Users'
    }
)


Supplier.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING
        },
        phone_number: {
            allowNull: false,
            type: DataTypes.STRING
        },
    },
    {
        sequelize,
        tableName: 'Suppliers'
    }
)

Product.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        quantity_in_stock: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },
    {
        sequelize,
        tableName: 'Products'
    }
)


Stock.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            validate: {
                isAlphanumeric: {
                    msg: 'Field has to be alphanumeric'
                }
            }
        }
    },
    {
        sequelize,
        tableName: 'stocks'
    }
)

SpecialCustomer.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING
        },
        balance: {
            type: DataTypes.INTEGER,
        }
    },
    {
        sequelize,
        tableName: 'SpecialCustomers'
    }
)
Category.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING
        }
    },
    {
        sequelize,
        tableName: 'Categories'
    }
)


InventoryTransaction.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        quantity: {
            allowNull: false,
            type: DataTypes.INTEGER,
            validate: {
                isInt: {
                    msg: 'Quantity must be integer'
                },
                min: {
                    args: 1,
                    msg: 'Quantity must be atleast 1'
                }
            }
        },
        selling_price: {
            allowNull: false,
            type: DataTypes.INTEGER,
            validate: {
                isInt: {
                    msg: 'Quantity must be integer'
                },
                min: {
                    args: 1,
                    msg: 'Quantity must be atleast 1'
                }
            }
        },
        total_amount: {
            allowNull: false,
            type: DataTypes.INTEGER,
            validate: {
                isInt: {
                    msg: 'Quantity must be integer'
                },
                min: {
                    args: 1,
                    msg: 'Quantity must be atleast 1'
                },
                isMatch(value) {
                    if (parseInt(value) !== this.quantity * this.selling_price) {
                        throw new Error('Total amount must match the product of quantity and price');
                    }
                }
            }
        },
        transaction_type: {
            allowNull: false,
            type: DataTypes.ENUM,
            values: ['IN', 'OUT']
        },
    },
    {
        sequelize,
        tableName: 'InventoryTransactions'
    }
)

//Relationships
Supplier.hasMany(Product, {
    onDelete: "SET NULL"
});
Product.belongsTo(Supplier);

SpecialCustomer.hasMany(Product, {
    onDelete: 'SET NULL'
});
Product.belongsTo(SpecialCustomer);


Category.hasMany(Product, {
    onDelete: 'CASCADE',
});
Product.belongsTo(Category);

Product.hasMany(InventoryTransaction, {
    onDelete: "CASCADE"
});
InventoryTransaction.belongsTo(Product);

User.hasMany(InventoryTransaction, {
    onDelete: 'CASCADE'
});
InventoryTransaction.belongsTo(User);

User.hasMany(Stock, {
    onDelete: 'CASCADE'
});
Stock.belongsTo(User);

const models = {
    Supplier,
    SpecialCustomer,
    Product,
    Category,
    InventoryTransaction,
    Stock,
    User,
};

(async function(){
    try {
        await Supplier.sync({alter: true})
        await SpecialCustomer.sync({alter: true})
        await Category.sync({alter: true})
        await Product.sync({alter: true})
        await User.sync({ alter: true })
        await Stock.sync({alter: true})
        await InventoryTransaction.sync({alter: true})
    } catch (error) {
        console.error(error)
    }
}())
module.exports = models;