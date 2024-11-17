const { DataTypes, Model } = require('sequelize')
const sequelize = require('../Config/db.config')

class User extends Model { };
class Product extends Model { }
class Supplier extends Model { }
class SpecialCustomer extends Model { }
class Category extends Model { }
class ProductCategory  extends Model { }
class InventoryTransaction extends Model { }

User.init(
    {
        username:{
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
            unique: {
                msg: 'Email is already registered'
            },
            validate: {
                isEmail: {
                    msg: 'Please provide valid email'
                },
            }
        },
        password: {
            type: DataTypes.STRING,
            unique: false,
            validate: {
                isAlphanumeric: {
                    msg: 'Password must be alphanumeric'
                },
                len: {
                    args: [8, 16],
                    msg: 'Password must be atleast 8 characters and not exceed 18'
                }
            }
        },
        firstName:{
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

Product.init(
    {
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
        supplier: {
            allowNull: true,
            references: {
                model: Supplier,
                key: 'id',
            }
        },
        sp_customer: {
            allowNull: true,
            references: {
                model: SpecialCustomer,
                key: 'id'
            }
        }
    },
    {
        sequelize,
        tableName: 'Products'
    }
)

Supplier.init(
    {
        name: DataTypes.STRING,
        phone_number: DataTypes.STRING,
    },
    {
        sequelize,
        tableName: 'Suppliers'
    }
)

SpecialCustomer.init(
    {
        name: DataTypes.STRING,
        balance: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    },
    {
        sequelize,
        tableName: 'SpecialCustomers'
    }
)
Category.init(
    {
        name: DataTypes.STRING
    },
    {
        sequelize,
        tableName: 'Categories'
    }
)

ProductCategory.init(
    {
        product_id: {
            references: {
                model: Product,
                key: 'id'
            }
        },
        category_id: {
            references: {
                model: Category,
                key: 'id'
            }
        },
    },
    {
        sequelize,
        tableName: 'ProductCategories'
    }
)

InventoryTransaction.init(
    {
        product: {
            references: {
                model: Product,
                key: 'id'
            }
        },
        supplier: {
            references: {
                model: Supplier,
                key: 'id'
            }
        },
        sp_customer: {
            references: {
                model: SpecialCustomer,
                key: 'id'
            }
        },
        quantity: {
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
            type: DataTypes.ENUM(['in, out'])
        },
        transaction_date: {
            type: DataTypes.DATEONLY,
            defaultValue: sequelize.NOW
        }
    },
    {
        sequelize,
        tableName: 'InventoryTransactions'
    }
)